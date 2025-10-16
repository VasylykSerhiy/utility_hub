import React, { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { Routes } from '@/constants/router';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

import { Button } from '@workspace/ui/components/button';
import GoogleIcon from '@workspace/ui/components/icons/google';

const GoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/confirm?next=${Routes.DASHBOARD}`,
        },
      });
      if (error) toast.error(error?.message);
    } catch (error) {
      toast('Error signing in with Google', { duration: 1000 });
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant='outline'
      type='button'
      disabled={isLoading}
      onClick={signInWithGoogle}
    >
      <GoogleIcon />
      Google
    </Button>
  );
};

export default GoogleButton;
