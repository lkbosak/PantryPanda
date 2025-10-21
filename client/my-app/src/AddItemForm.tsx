import React, { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';

interface AddItemFormProps {
  onAdd: (item: { product_name: string; quantity: number; category: string; upc_barcode: string; expirationDate?: string; minLevel?: number }) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd }) => {
  const [product_name, setProduct_name] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('');
  const [upc_barcode, setUpc_barcode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  // default expiration date two years from now (YYYY-MM-DD)
  const twoYearsFromNow = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 2);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const [expirationDate, setExpirationDate] = useState(twoYearsFromNow());
  const [minLevel, setMinLevel] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product_name) {
      setError('Please enter an item name.');
      return;
    }
    if (quantity === '' ) {
      setError('Please enter a quantity greater than 0.');
      return;
    }
    const qtyNum = Number(quantity);
    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      setError('Quantity must be a number greater than 0.');
      return;
    }
    if (!category) {
      setError('Please select a destination.');
      return;
    }
    const minLevelNum = minLevel === '' ? undefined : Number(minLevel);
    onAdd({ product_name, quantity: qtyNum, category, upc_barcode, expirationDate: expirationDate || undefined, minLevel: minLevelNum });
    setProduct_name('');
    setQuantity('1');
    setCategory('');
  setExpirationDate(twoYearsFromNow());
    setMinLevel('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.9)', padding: '1.5rem', borderRadius: '10px', maxWidth: '350px' }}>
      <h3>Add Item</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label htmlFor="item-name">Name:</label>
        <input
          id="item-name"
          type="text"
          value={product_name}
          onChange={e => setProduct_name(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      <div>
        <label htmlFor="item-barcode">Barcode:</label>
        <input
          id="item-barcode"
          type="text"
          value={upc_barcode}
          onChange={e => setUpc_barcode(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
        <div style={{ marginTop: '0.5rem' }}>
          <button type="button" onClick={() => setShowScanner(s => !s)} style={{ padding: '0.4rem 0.6rem' }}>
            {showScanner ? 'Close scanner' : 'Scan barcode'}
          </button>
        </div>
        {showScanner && (
          <div style={{ marginTop: '0.75rem' }}>
            <BarcodeScanner
              autoStart
              onDetected={(code) => {
                setUpc_barcode(code);
                setShowScanner(false);
              }}
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="item-expiration">Expiration Date:</label>
        <input
          id="item-expiration"
          type="date"
          value={expirationDate}
          onChange={e => setExpirationDate(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      <div>
        <label htmlFor="item-minlevel">Desired minimum quantity:</label>
        <input
          id="item-minlevel"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={minLevel}
          onKeyDown={e => {
            if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
            // block anything that's not a digit
            if (!/^\d$/.test(e.key)) e.preventDefault();
          }}
          onPaste={e => {
            const text = e.clipboardData.getData('text');
            if (!/^\d*$/.test(text)) {
              e.preventDefault();
            }
          }}
          onChange={e => {
            const v = e.target.value;
            if (/^\d*$/.test(v)) setMinLevel(v);
          }}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      <div>
        <label htmlFor="item-quantity">Quantity:</label>
        <input
          id="item-quantity"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={quantity}
          onKeyDown={e => {
            if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
          }}
          onPaste={e => {
            const text = e.clipboardData.getData('text');
            if (!/^\d*$/.test(text)) e.preventDefault();
          }}
          onChange={e => {
            const v = e.target.value;
            if (v === '' || /^\d+$/.test(v)) setQuantity(v);
          }}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          required
        />
      </div>
      <div>
        <label htmlFor="item-category">Category:</label>
        <select id="item-category" value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
          <option value="" disabled>-- Select destination --</option>
          <option value="fridge">Fridge</option>
          <option value="freezer">Freezer</option>
          <option value="spice rack">Spice Rack</option>
          <option value="pantry">Dry Goods</option>
        </select>
      </div>
      <button type="submit" style={{ padding: '0.75rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
        Add Item
      </button>
    </form>
  );
};

export default AddItemForm;
