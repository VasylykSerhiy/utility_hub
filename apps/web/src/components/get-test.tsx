'use client';

import { useEffect, useState } from 'react';

import { ThemeToggleButton } from '@/components/layout/theme-toggle-button';
import { GetTestResponse } from '@workspace/types';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

const GetTest = () => {
  const [test, setTest] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        console.log(1);
        const response = await fetch('http://localhost:3001/v1/test');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data: GetTestResponse = await response.json();
        setTimeout(() => {
          setTest(data.message);
          setLoading(false);
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    fetchTest();
  }, []);

  return (
    <Card className='w-full'>
      <CardHeader>
        <h3
          className={cn(
            'text-xl font-semibold',
            loading && 'text-yellow-500',
            test && !error && 'text-green-500',
            error && 'text-red-500',
          )}
        >
          API Connection Test
        </h3>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='text-muted-foreground flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Testing API connection...
          </div>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <p className='text-green-500'>{test}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GetTest;
