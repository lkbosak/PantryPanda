import React, { useState } from 'react';

interface AddItemFormProps {
  onAdd: (item: { name: string; quantity: number; category: string, barcode: string }) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('Fridge');
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter an item name.');
      return;
    }
    setError('');
    onAdd({ name, quantity,category, barcode });
    setName('');
    setQuantity(1);
    setCategory('Fridge');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.9)', padding: '1.5rem', borderRadius: '10px', maxWidth: '350px' }}>
      <h3>Add Item</h3>
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
      <label>
        Quantity:
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </label>
      <label>
        Category:
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
          <option value="Fridge">Fridge</option>
          <option value="Freezer">Freezer</option>
          <option value="Spice Rack">Spice Rack</option>
          <option value="Dry Goods">Dry Goods</option>
        </select>
      </label>
      <button type="submit" style={{ padding: '0.75rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
        Add Item
      </button>
    </form>
  );
};

export default AddItemForm;
