import React from 'react';
import { usePantry } from './PantryContext';
import RemoveItemForm from './RemoveItemForm';

const RemoveItemPage = () => {
  const { removeItem } = usePantry();

  return <RemoveItemForm onRemove={removeItem} />;
};

export default RemoveItemPage;