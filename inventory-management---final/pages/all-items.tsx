'use client';

import React from 'react';
import { useAllOriginalItems, OriginalItemWithQuantities } from '@/hooks/useAllOriginalItems'; // Import type
import ItemCard from '@/components/ItemCard'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import Header from '@/components/Header'; 
import { ItemWithSizeCount } from '@/hooks/useItems'; // Import the type ItemCard expects

const AllItemsPage: React.FC = () => {
  // Correct destructuring: use 'loading' instead of 'isLoading'
  const { items, loading, error } = useAllOriginalItems();

  return (
    <div className="flex flex-col min-h-screen">
       {/* Remove props not accepted by Header */}
       <Header /> 
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Alle Originalartikel</h1>
        {loading && ( // Use 'loading'
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
            ))}
          </div>
        )}
        {error && <p className="text-red-500">Fehler beim Laden der Artikel: {error.message}</p>}
        {!loading && !error && items && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item: OriginalItemWithQuantities) => (
              <ItemCard
                key={item.id}
                // Cast the item to the type expected by ItemCard 
                // Assuming OriginalItemWithQuantities is compatible with ItemWithSizeCount
                item={item as ItemWithSizeCount} 
                showActions={false} 
                showMenu={false} // Also hide the menu dots
                // Dummy props for handlers ItemCard expects but aren't used here
                itemSizes={{}} 
                isPinned={() => false}
                isMassEditMode={false}
                itemQuantities={{}}
                selectedAction={null}
                selectedPromoter={null}
                handleEdit={() => {}}
                handleToggleInactive={() => {}}
                handleTogglePin={() => {}}
                handleShowHistory={() => {}}
                handleDeleteClick={() => {}}
                stopSharingItem={async () => {}}
                handleQuantityChange={() => {}}
                handleMassEditQuantityChange={() => {}}
                handleMassEditSizeChange={() => {}} 
              />
            ))}
          </div>
        )}
        {!loading && !error && (!items || items.length === 0) && (
          <p>Keine Originalartikel gefunden.</p>
        )}
      </main>
    </div>
  );
};

export default AllItemsPage; 