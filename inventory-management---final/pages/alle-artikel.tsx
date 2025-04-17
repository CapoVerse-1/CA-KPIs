"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Metadata } from 'next';
import { fetchAllItems, Item } from '@/lib/api/items'; // Assuming this exists
import { useUser } from '@/contexts/UserContext';
import ItemCard from '@/components/ItemCard'; // Use the new ItemCard
import Header from '@/components/Header';

// Define a simplified item type for this page if needed, or enhance ItemCard to handle missing props
interface AggregatedItem extends Item {
  totalQuantity: number;
  availableQuantity: number;
  inCirculation: number;
  // Add other relevant aggregated fields if needed
}

export const metadata: Metadata = {
  title: 'Alle Artikel | JTI Inventory Management',
  description: 'Übersicht aller Originalartikel im JTI Inventory Management System',
};

export default function AlleArtikelPage() {
  const { currentUser } = useUser();
  const [items, setItems] = useState<AggregatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      try {
        // TODO: This fetch function likely needs modification 
        //       to aggregate counts across all brands/promoters.
        //       Or, we fetch basic item data and ItemCard handles displaying limited info.
        const fetchedItems = await fetchAllItems(); // Placeholder - needs implementation

        // Placeholder aggregation logic - replace with actual aggregation if needed
        const aggregatedItems = fetchedItems.map(item => ({
          ...item,
          // Dummy data - replace with actual aggregated counts
          totalQuantity: 0, 
          availableQuantity: 0,
          inCirculation: 0,
          // We need to ensure ItemCard can handle potentially missing itemSizes, quantities etc.
          // or fetch them here.
        }));

        setItems(aggregatedItems);
      } catch (err) {
        console.error("Error fetching all items:", err);
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [currentUser]);

  return (
    <div className="flex flex-col h-screen">
      <Header title="Alle Artikel" />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading all items...</span>
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 p-4">
            <p>Error: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.length > 0 ? (
              items.map((item) => (
                // Render the simplified ItemCard 
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  // Pass dummy/empty props for handlers/data not relevant here
                  // Or modify ItemCard to not require them when showActions/showMenu are false
                  itemSizes={{}} // Placeholder 
                  isPinned={() => false} // Placeholder
                  isMassEditMode={false} // Placeholder
                  itemQuantities={{}} // Placeholder
                  selectedAction={null} // Placeholder
                  selectedPromoter={null} // Placeholder
                  handleEdit={() => {}} // No-op
                  handleToggleInactive={() => {}} // No-op
                  handleTogglePin={() => {}} // No-op
                  handleShowHistory={() => {}} // No-op
                  handleDeleteClick={() => {}} // No-op
                  stopSharingItem={async () => {}} // No-op
                  handleQuantityChange={() => {}} // No-op
                  handleMassEditQuantityChange={() => {}} // No-op
                  handleMassEditSizeChange={() => {}} // No-op
                  // Hide actions and menu
                  showActions={false} 
                  showMenu={false} 
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No items found across all brands.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 