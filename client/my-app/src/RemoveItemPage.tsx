import React from 'react';
import { usePantry } from './PantryContext';
import { useNavigate } from 'react-router-dom';
import RemoveItemForm from './RemoveItemForm';

const RemoveItemPage = () => {
  const { removeItem } = usePantry();
  const navigate = useNavigate();

  const handleRemoveItem = (identifier: { name?: string; barcode?: string }) => {
    removeItem(identifier);
    alert('Item removed successfully!');
    navigate('/pantry');
  };

  return <RemoveItemForm onRemove={handleRemoveItem} />;
};

export default RemoveItemPage;