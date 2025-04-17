"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Root page session check:', data.session ? 'Authenticated' : 'Not authenticated');
        
        if (data.session) {
          console.log('Root page: User is authenticated, redirecting to /inventory');
          router.replace('/inventory');
        } else {
          console.log('Root page: User is not authenticated, redirecting to /login');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  return null;
}

