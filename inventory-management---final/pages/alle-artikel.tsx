import React from 'react';
import { Box, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import Layout from '../components/Layout'; // Assuming Layout component exists

// Placeholder type for item data - will be refined later
type AggregatedItem = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  initial_stock: number;
  current_available: number;
  current_circulation: number;
  current_burned: number;
  current_total: number; // initial_stock - burned
  // Add other relevant item fields if needed
};

const AlleArtikelPage = () => {
  // Placeholder for data fetching state
  const [items, setItems] = React.useState<AggregatedItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Placeholder for fetching data
    // Replace with actual API call later
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate empty data for now
        setItems([]);
        // TODO: Replace with actual API call to /api/items/all-originals-with-counts
        // const response = await fetch('/api/items/all-originals-with-counts');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch items');
        // }
        // const data = await response.json();
        // setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Box p={5}>
        <Heading mb={6}>Alle Artikel</Heading>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Text color="red.500">Error: {error}</Text>
        ) : items.length === 0 ? (
          <Text>Keine Artikel gefunden.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {/* TODO: Map over items and render simplified ItemCard components */}
            {/* Example:
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item} // Pass the aggregated data structure
                available={item.current_available}
                inCirculation={item.current_circulation}
                burned={item.current_burned}
                total={item.current_total}
                showActions={false} // Prop to hide actions
                showMenu={false} // Prop to hide menu
                // Pass other necessary props like refetch function (can be dummy)
                refetchItems={() => {}} // Provide a no-op function
              />
            ))} */}
            <Text>Item Cards will be displayed here.</Text>
          </SimpleGrid>
        )}
      </Box>
    </Layout>
  );
};

export default AlleArtikelPage; 