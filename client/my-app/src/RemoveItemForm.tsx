import React, { useState } from 'react';

interface RemoveItemFormProps {
  onRemove: (identifier: { name?: string; barcode?: string }) => void;
}

const RemoveItemForm: React.FC<RemoveItemFormProps> = ({ onRemove }) => {
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name && !barcode) {
      setError('Please enter an item name or barcode.');
      return;
    }
    setError('');
    onRemove({ name: name || undefined, barcode: barcode || undefined });
    setName('');
    setBarcode('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.9)', padding: '1.5rem', borderRadius: '10px', maxWidth: '350px' }}>
      <h3>Remove Item</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </label>
      <label>
        Barcode:
        <input
          type="text"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </label>
      <button type="submit" style={{ padding: '0.75rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
        Remove Item
      </button>
    </form>
  );
};

export default RemoveItemForm;