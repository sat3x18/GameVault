import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameItem } from '../types';
import { supabase } from '../lib/supabase';
import { gameItems as fallbackItems } from '../data/items';

interface ItemsContextType {
  items: GameItem[];
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<GameItem, 'id'>) => Promise<void>;
  updateItem: (id: string, item: Omit<GameItem, 'id'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformSupabaseItem = (item: any): GameItem => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
    category: item.category,
    inStock: item.in_stock,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching items:', fetchError);
        // Fall back to local data if Supabase is not configured
        setItems(fallbackItems);
        setError('Using local data - Supabase not configured');
      } else {
        const transformedItems = data?.map(transformSupabaseItem) || [];
        setItems(transformedItems);
      }
    } catch (err) {
      console.error('Error in fetchItems:', err);
      setItems(fallbackItems);
      setError('Using local data - connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (newItem: Omit<GameItem, 'id'>) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('items')
        .insert({
          title: newItem.title,
          price: newItem.price,
          image: newItem.image,
          description: newItem.description,
          category: newItem.category,
          in_stock: newItem.inStock
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        const transformedItem = transformSupabaseItem(data);
        setItems(prev => [transformedItem, ...prev]);
      }
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item');
      throw err;
    }
  };

  const updateItem = async (id: string, updatedItem: Omit<GameItem, 'id'>) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('items')
        .update({
          title: updatedItem.title,
          price: updatedItem.price,
          image: updatedItem.image,
          description: updatedItem.description,
          category: updatedItem.category,
          in_stock: updatedItem.inStock
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        const transformedItem = transformSupabaseItem(data);
        setItems(prev => prev.map(item => 
          item.id === id ? transformedItem : item
        ));
      }
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
      throw err;
    }
  };

  const refreshItems = async () => {
    await fetchItems();
  };

  return (
    <ItemsContext.Provider value={{ 
      items, 
      loading, 
      error, 
      addItem, 
      updateItem, 
      deleteItem, 
      refreshItems 
    }}>
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