import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameItem } from '../types';
import { gameItems as initialItems } from '../data/items';

interface ItemsContextType {
  items: GameItem[];
  addItem: (item: Omit<GameItem, 'id'>) => void;
  updateItem: (id: string, item: Omit<GameItem, 'id'>) => void;
  deleteItem: (id: string) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GameItem[]>(() => {
    const savedItems = localStorage.getItem('gameItems');
    return savedItems ? JSON.parse(savedItems) : initialItems;
  });

  useEffect(() => {
    localStorage.setItem('gameItems', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<GameItem, 'id'>) => {
    const id = Date.now().toString();
    const item: GameItem = { ...newItem, id };
    setItems(prev => [...prev, item]);
  };

  const updateItem = (id: string, updatedItem: Omit<GameItem, 'id'>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...updatedItem, id } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};