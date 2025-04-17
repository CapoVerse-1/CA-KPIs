import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the inventory page on mount
    router.replace('/inventory');
  }, [router]);

  // Return null or a loading indicator while redirecting
  return null; 
};

export default HomePage; 