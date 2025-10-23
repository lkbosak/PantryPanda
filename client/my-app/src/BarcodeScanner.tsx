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

    // dynamic import of zxing browser builds (run-time)
  // dynamic import from UNPKG; TypeScript can't statically type these URLs so ignore the check
  // @ts-ignore
  const browserModule: any = await import('https://unpkg.com/@zxing/browser@0.1.4?module');
  // @ts-ignore
  const coreModule: any = await import('https://unpkg.com/@zxing/library@0.20.0?module');

    const BrowserMultiFormatReader = browserModule.BrowserMultiFormatReader;
    const BrowserCodeReader = browserModule.BrowserCodeReader;
    const BarcodeFormat = coreModule.BarcodeFormat;
    const DecodeHintType = coreModule.DecodeHintType;

    // Restrict to UPC formats as the original
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

          // Try to call Nutritionix and then backend
          try {
            // Nutritionix call
            const nxRes = await fetch(`https://trackapi.nutritionix.com/v2/search/item/?upc=${text}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-app-id': '395535ef',
                'x-app-key': 'df0b14dcc38d529aaf9a70effd90189f'
              }
            });
            const nxData = await nxRes.json().catch(() => null);
            const brandName = nxData?.foods?.[0]?.brand_name || 'Unknown';
            const foodName = nxData?.foods?.[0]?.food_name || 'Unknown';
            // once we have a friendly name, notify again by setting globalThis and (optionally) calling onDetected
            friendlyName = `${brandName} ${foodName}`;
            if (onDetected) onDetected({ code: text, name: friendlyName });
            setResultText(`Brand: ${brandName} ${foodName} UPC:${text}`);

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
