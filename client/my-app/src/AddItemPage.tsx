import React from 'react';
import { usePantry } from './PantryContext';
import AddItemForm from './AddItemForm';

const AddItemPage = () => {
  const { addItem } = usePantry();

  return <AddItemForm onAdd={addItem} />;
};

export default AddItemPage;