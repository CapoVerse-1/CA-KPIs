import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { calculateItemQuantities, Item, countItemSizes } from '@/lib/api/items';
import { useToast } from '@/hooks/use-toast';

// Reuse the ItemWithSizeCount interface or adapt if necessary
export interface OriginalItemWithQuantities extends Item {
  sizeCount: number;
  quantities?: {
    originalQuantity: number;
    availableQuantity: number;
    inCirculation: number;
    totalQuantity: number;
  };
}

export function useAllOriginalItems() {
  const [items, setItems] = useState<OriginalItemWithQuantities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useUser();
  const { toast } = useToast();

  const loadItems = useCallback(async () => {
    if (!currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch accessible brand IDs for the current user
      const { data: brandAccessData, error: brandAccessError } = await supabase
        .from('brand_access')
        .select('brand_id')
        .eq('user_id', currentUser.id);

      if (brandAccessError) {
        throw new Error(`Failed to fetch accessible brands: ${brandAccessError.message}`);
      }

      // Define an interface or type for the brand access data
      interface BrandAccess {
        brand_id: string;
      }
      
      const accessibleBrandIds = (brandAccessData as BrandAccess[] | null)?.map((access: BrandAccess) => access.brand_id) || [];

      if (accessibleBrandIds.length === 0) {
        console.log('useAllOriginalItems - User has no accessible brands.');
        setItems([]);
        setLoading(false);
        return;
      }
      
      console.log('useAllOriginalItems - Fetching original items for brands:', accessibleBrandIds);
      
      // 2. Fetch original items (original_item_id is NULL) across accessible brands
      const { data: itemsData, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .in('brand_id', accessibleBrandIds)
        .is('original_item_id', null);

      if (fetchError) {
        throw fetchError;
      }

      if (!itemsData) {
        console.log('useAllOriginalItems - No original items found for accessible brands.');
        setItems([]);
        setLoading(false);
        return;
      }

      console.log('useAllOriginalItems - Fetched', itemsData.length, 'original items');

      // 3. Calculate quantities and size count for each item
      const itemsWithDetails = await Promise.all(
        itemsData.map(async (item: Item) => {
          const quantities = await calculateItemQuantities(item.id);
          const sizeCount = await countItemSizes(item.id);
          return {
            ...item,
            quantities,
            sizeCount,
          } as OriginalItemWithQuantities;
        })
      );

      console.log('useAllOriginalItems - Setting items with details:', itemsWithDetails.length);
      setItems(itemsWithDetails);

    } catch (err) {
      console.error('Error loading all original items:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load original items';
      setError(new Error(errorMessage));
      toast({
        title: 'Error',
        description: `${errorMessage}. Please try again.`,
        variant: 'destructive',
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const sortedItems = [...items].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return {
    items: sortedItems,
    loading,
    error,
    refreshItems: loadItems,
  };
} 