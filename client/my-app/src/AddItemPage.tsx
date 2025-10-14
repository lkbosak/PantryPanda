import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddItemForm from './AddItemForm';

const AddItemPage: React.FC = () => {
    const navigate = useNavigate();

    const handleAddItem = async (item: { name: string, quantity: number, category: string, barcode: string, expirationDate?: string, minLevel?: number} ) => {
      
      try{
          const response = await fetch('http://localhost:3001/product', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(item),
          });
          const data = await response.json();
          if (response.ok && data) {
              alert('Product added');
              // Store user info or token if returned by backend
              localStorage.setItem('Product', JSON.stringify(data));
              navigate('/pantry');
          } else {
              console.error('Failed to add product, response not ok');
              alert('Failed to add product');
          }
      } catch (err) {
          console.error('Failed to add product', err);
          throw err;
      }
  };




  return <AddItemForm onAdd={handleAddItem} />;
};



export default AddItemPage;
