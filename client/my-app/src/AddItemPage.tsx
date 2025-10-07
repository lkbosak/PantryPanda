import React from 'react';
import { usePantry } from './PantryContext';
import { useNavigate } from 'react-router-dom';
import AddItemForm from './AddItemForm';

const AddItemPage = () => {
  const { addItem } = usePantry();
  const navigate = useNavigate();

  const handleAddItem = (item: { name: string; quantity: number; category: string }) => {
    addItem(item);
    alert('Item added successfully!');
    navigate('/pantry');
  };

  return <AddItemForm onAdd={handleAddItem} />;
};

export default AddItemPage;