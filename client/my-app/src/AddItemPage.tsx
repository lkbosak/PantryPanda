import React, { useState } from 'react';
import { PantryItem, usePantry } from './PantryContext';
import { useNavigate } from 'react-router-dom';
import AddItemForm from './AddItemForm';
import { warn } from 'console';

const AddItemPage: React.FC = () => {
  const { addItem } = usePantry();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleAddItem = async (item: { name: string, quantity: number, category: string, barcode: string} ) => {
      
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
              setError("Failed to add Product");
          }
      } catch (error) {
          setError('An error occurred. Please try again later.');
      }
  };




  return <AddItemForm onAdd={handleAddItem} />;
};



export default AddItemPage;
