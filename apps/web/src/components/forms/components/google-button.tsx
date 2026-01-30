import { Button } from '@workspace/ui/components/button';
import GoogleIcon from '@workspace/ui/components/icons/google';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Routes } from '@/constants/router';
import { createClient } from '@/lib/supabase/client';

const GoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const _next = searchParams.get('next');

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
    } catch (_error) {
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
