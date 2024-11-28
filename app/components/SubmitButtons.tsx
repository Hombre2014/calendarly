'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import GoogleLogo from '@/public/google.svg';
import GitHubLogo from '@/public/github.svg';
import { Button } from '@/components/ui/button';

export function GoogleAuthButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button className="w-full" disabled variant="outline">
          <Loader2 className="animate-spin size-4 mr-2" /> Please wait...
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          <Image src={GoogleLogo} alt="Google Logo" className="size-4 mr-2" />
          Sign in with Google
        </Button>
      )}
    </>
  );
}

export function GitHubAuthButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button className="w-full" disabled variant="outline">
          <Loader2 className="animate-spin size-4 mr-2" /> Please wait...
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          <Image src={GitHubLogo} alt="GitHub Logo" className="size-4 mr-2" />
          Sign in with GitHub
        </Button>
      )}
    </>
  );
}
