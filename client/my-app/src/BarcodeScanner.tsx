import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onDetected?: (result: { code: string; name?: string }) => void;
  autoStart?: boolean;
};

const BarcodeScanner: React.FC<Props> = ({ onDetected, autoStart = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<any | null>(null);
  const [resultText, setResultText] = useState<string>('Result will appear here...');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (autoStart) startScanner().catch(err => console.error(err));
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startScanner() {
    // stop existing
    if (controlsRef.current) {
      try { controlsRef.current.stop(); } catch (e) { console.error('stop error', e); }
      controlsRef.current = null;
    }


    // Load ZXing ESM modules at runtime by injecting a module script blob that imports from UNPKG.
    // We generate the import inside a Blob to avoid bundler static analysis of `import()` calls.
    if (!(window as any).__ZX) {
      const moduleCode = `
        import * as browserModule from 'https://unpkg.com/@zxing/browser@0.1.4?module';
        import * as coreModule from 'https://unpkg.com/@zxing/library@0.20.0?module';
        window.__ZX = { browserModule, coreModule };
      `;
      const blob = new Blob([moduleCode], { type: 'text/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      const script = document.createElement('script');
      script.type = 'module';
      script.src = blobUrl;
      document.head.appendChild(script);

      // wait until the module attaches to window.__ZX or timeout
      const waitForZX = new Promise<void>((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
          if ((window as any).__ZX) {
            clearInterval(interval);
            resolve();
          } else if (Date.now() - start > 10000) {
            clearInterval(interval);
            reject(new Error('Timed out loading ZXing modules'));
          }
        }, 200);
      });
      try {
        await waitForZX;
      } catch (err) {
        setResultText('Failed to load scanner libraries');
        console.error(err);
        return;
      }
    }

    const browserModule: any = (window as any).__ZX.browserModule;
    const coreModule: any = (window as any).__ZX.coreModule;

    const BrowserMultiFormatReader = browserModule.BrowserMultiFormatReader;
    const BrowserCodeReader = browserModule.BrowserCodeReader;
    const BarcodeFormat = coreModule.BarcodeFormat;
    const DecodeHintType = coreModule.DecodeHintType;

    // Restrict to UPC formats
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.UPC_A, BarcodeFormat.UPC_E]);

    const codeReader = new BrowserMultiFormatReader(hints);

    const devices = await BrowserCodeReader.listVideoInputDevices();
    if (!devices || devices.length === 0) {
      setResultText('Error: No video input devices found.');
      throw new Error('No video input devices found');
    }

    const selectedDeviceId = devices[0].deviceId;
    const previewElem = videoRef.current;
    if (!previewElem) {
      setResultText('Error: Video element not found.');
      throw new Error('Video element not found');
    }

    setIsRunning(true);

    const controls = await codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      previewElem,
      async (result: any, error: any, controls: any) => {
          if (result) {
          const text = result.getText();
          setResultText(`Result: ${text}`);
          // attempt to extract a friendly name from Nutritionix lookup
          let friendlyName: string | undefined = undefined;
          if (onDetected) onDetected({ code: text, name: friendlyName });
          try {
            // Open Food Facts call
            const offRes = await fetch(
              `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(text)}.json`,
              {
                method: 'GET',
              }
            );

            const offData = await offRes.json().catch(() => null);

            // OFF returns status === 1 when a product is found
            const product = offData?.status === 1 ? offData.product : null;

            // OFF uses `brands` and `product_name`
            const rawBrand = product?.brands || '';
            const brandName =
              rawBrand
                .split(/[|,]/)[0]  // brands can be pipe or comma separated
                ?.trim() || 'Unknown';

            const foodName = product?.product_name || 'Unknown';

            // once we have a friendly name, notify again
            friendlyName = `${brandName} ${foodName}`.trim();
            if (onDetected) onDetected({ code: text, name: friendlyName });

            setResultText(`Brand: ${brandName} ${foodName} UPC: ${text}`);

            // @ts-ignore
            globalThis.scannedFood = { upc: text, brandName, foodName };

            // send to backend
            fetch('http://localhost:3001/product', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ foodName, upc: text })
            }).catch(err => console.error('Save failed:', err));
          } catch (err) {
            console.error('API Error:', err);
          }

          // stop after first good read
          try { controls.stop(); } catch (e) { console.error('controls stop error', e); }
          controlsRef.current = null;
          setIsRunning(false);
        }
        if (error && error.name !== 'NotFoundException') {
          console.error(error);
          setResultText(`Error: ${error.message}`);
        }
      }
    );

    controlsRef.current = controls;
  }

  function stopScanner() {
    if (controlsRef.current) {
      try { controlsRef.current.stop(); } catch (e) { console.error('controlsRef stop error', e); }
      controlsRef.current = null;
    }
    setIsRunning(false);
  }

  return (
    <div>
      <h3>UPC Barcode Scanner</h3>
      <div id="test-area-qr-code-webcam">
        <video ref={videoRef} style={{ width: 400, height: 'auto' }} autoPlay muted />
      </div>
      <div id="result" style={{ marginTop: 8 }}>{resultText}</div>
      <div style={{ marginTop: 8 }}>
        <button onClick={() => startScanner()} disabled={isRunning} style={{ marginRight: 8 }}>Start Scan</button>
        <button onClick={() => stopScanner()} disabled={!isRunning}>Stop Scan</button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
