import React, { useState } from 'react';
import { PantryItem, usePantry } from './PantryContext';
import { useNavigate } from 'react-router-dom';
import AddItemForm from './AddItemForm';
import { warn } from 'console';

const AddItemPage: React.FC = () => {
  const { addItem } = usePantry();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleAddItem = async (item: { product_name: string, quantity: number, category: string, upc_barcode: string } ) => {
      try{
          const response = await fetch('http://localhost:3001/product', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(item),
          });
          const data = await response.json().catch(() => null);
          if (response.ok) {
              // add to local pantry context so inbox receives a notification/event
              try {
                addItem({
                  name: item.product_name,
                  quantity: item.quantity,
                  category: item.category,
                  barcode: item.upc_barcode || undefined,
                });
              } catch (e) {
                // if addItem isn't available for some reason, continue
                // eslint-disable-next-line no-console
                console.debug('addItem failed:', e);
              }
              alert('Product added');
              // Store returned product if any
              if (data) localStorage.setItem('Product', JSON.stringify(data));
              navigate('/pantry');
          } else {
              setError("Failed to add Product");
          }
      } catch (error) {
          setError('An error occurred. Please try again later.');
      }
  };




  return <AddItemForm onAdd={handleAddItem} />;
};



export default AddItemPage;
