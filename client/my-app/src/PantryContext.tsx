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
    setPantryItems(prev => {
      const next = [item, ...prev];
      try {
        const categoryCount = next.filter(i => i.category === item.category).length;
        // Dispatch a global event so other parts of the app (Inbox) can show notifications
        window.dispatchEvent(new CustomEvent('pantry-change', { detail: { action: 'add', item, categoryCount } }));
        // Also persist notification to backend if possible
        (async () => {
          try {
            const storedId = localStorage.getItem('user_id');
            const mockUser = localStorage.getItem('mockUser');
            let userId: string | null = null;
            if (storedId) {
              try { userId = JSON.parse(storedId); } catch { userId = storedId; }
            } else if (mockUser) {
              try { userId = JSON.parse(mockUser).id || JSON.parse(mockUser).user_id || null; } catch { userId = null; }
            }
            const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
            const notifPayload = {
              user_id: userId,
              action: 'add',
              item: {
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                barcode: item.barcode,
              },
              categoryCount,
            };
            await fetch('https://pantrypanda-backend.onrender.com/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(notifPayload),
              mode: 'cors',
            });
          } catch (e) {
            // ignore backend notification errors
            // eslint-disable-next-line no-console
            console.debug('Failed to persist notification:', e);
          }
        })();
      } catch (e) {
        // ignore
      }
      return next;
    });

  };
  const removeItem = (identifier: {name?: string; barcode?: string}) => {
    setPantryItems(prev => {
      // find items that will be removed for notification details
      const toRemove = prev.filter(item => {
        if (identifier.name) return item.name === identifier.name;
        if (identifier.barcode) return item.barcode === identifier.barcode;
        return false;
      });
      const next = prev.filter(item => {
        if (identifier.name) return item.name !== identifier.name;
        if (identifier.barcode) return item.barcode !== identifier.barcode;
        return true;
      });
      try {
        // dispatch an event per removed item
        toRemove.forEach(removed => {
          const remainingCount = next.filter(i => i.category === removed.category).length;
          window.dispatchEvent(new CustomEvent('pantry-change', { detail: { action: 'remove', item: removed, remainingCount } }));
        });
        // Persist removal notifications to backend
        (async () => {
          try {
            const storedId = localStorage.getItem('user_id');
            const mockUser = localStorage.getItem('mockUser');
            let userId: string | null = null;
            if (storedId) {
              try { userId = JSON.parse(storedId); } catch { userId = storedId; }
            } else if (mockUser) {
              try { userId = JSON.parse(mockUser).id || JSON.parse(mockUser).user_id || null; } catch { userId = null; }
            }
            const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
            for (const removed of toRemove) {
              const payload = {
                user_id: userId,
                action: 'remove',
                item: { name: removed.name, category: removed.category, quantity: removed.quantity, barcode: removed.barcode },
                remainingCount: next.filter(i => i.category === removed.category).length,
              };
              await fetch('https://pantrypanda-backend.onrender.com/notifications', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
                mode: 'cors',
              }).catch(() => null);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.debug('Failed to persist removal notifications:', e);
          }
        })();
      } catch (e) {
        // ignore
      }
      return next;
    });
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