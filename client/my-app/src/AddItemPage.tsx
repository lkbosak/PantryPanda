// eslint-disable-next-line
import React, { useState } from 'react';
// eslint-disable-next-line
import { PantryItem, usePantry } from './PantryContext';
import { useNavigate } from 'react-router-dom';
import AddItemForm from './AddItemForm';
// eslint-disable-next-line
import { warn } from 'console';

const AddItemPage: React.FC = () => {
  const navigate = useNavigate();
    const userIdstr = localStorage.getItem('user_id');
    const user_id = Number(userIdstr);
    console.log('user id ' + user_id)
    const handleAddItem = async (item: { 
        product_name: string, 
        quantity: number, 
        category: string, 
        upc_barcode: string, 
        expirationDate?: string, 
        minLevel?: number} ) => {
        try{
            const response = await fetch('/api/product', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(item),
            });
            console.log(item)
            const data = await response.json();
            await fetch('/api/user-inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user_id,
                    product_name: item.product_name,
                    product_id: data.product_id,
                    quantity: Number(item.quantity),
                    unit: 'gallon', 
                    expiration_date: item.expirationDate ? (item.expirationDate) : null,
                    date_added: new Date(),
                    location: item.category, 
                    qPref: item.minLevel ?? 1,
                })
            });
            // create a GroceryList entry so the item appears on the user's shopping list
            try {
                await fetch('/api/grocery-list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        qToBuy: item.minLevel ?? 1,
                        isPurchased: false,
                        product_id: data.product_id,
                        user_id: user_id,
                    })
                });
            } catch (err) {
                console.error('Failed to create grocery list entry', err);
            }
            try{
                if (response.ok && data) {
                    alert('Product added');
                    // Store user info or token if returned by backend
                    localStorage.setItem('Product', JSON.stringify(data));
                    navigate('/pantry');
                } else {
                    console.error('Failed to add product, response not ok');
                    alert('Failed to add product');
                }
            }catch(err){
                console.error(err);
            }
        } catch (err) {
            console.error('Failed to add product', err);
            throw err;
        }
    };
    return <AddItemForm onAdd={handleAddItem} />;};

export default AddItemPage;
