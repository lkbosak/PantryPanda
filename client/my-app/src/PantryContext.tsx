import React, { createContext, useContext, useState } from 'react';

export interface PantryItem {
  name: string;
  quantity: number;
  category: string;
  barcode?: string;
}

interface PantryContextType {
  pantryItems: PantryItem[];
  addItem: (item: PantryItem) => void;
  removeItem: (identifier: {name?: string; barcode?: string}) => void; // or use a unique id if you have one
}

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  const addItem = (item: PantryItem) => {
    setPantryItems(prev => [item, ...prev]);

  };
  const removeItem = (identifier: {name?: string; barcode?: string}) => {
    setPantryItems(prev => prev.filter(item => {
      // If name is provided, remove items with that name
      if (identifier.name) {
        return item.name !== identifier.name;
      }
      // If barcode is provided, remove items with that barcode
      if (identifier.barcode) {
        return item.barcode !== identifier.barcode;
      }
      // If neither is provided, keep the item (should not happen)
      return true;
    }));
  };

  return (
    <PantryContext.Provider value={{ pantryItems, addItem, removeItem }}>
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (!context) throw new Error('usePantry must be used within a PantryProvider');
  return context;
};

export { PantryContext };