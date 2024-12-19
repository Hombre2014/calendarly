import Image from 'next/image';

import { signIn } from '@/lib/auth';
import Logo from '@/public/logo.png';
import { Button } from '@/components/ui/button';
import { GitHubAuthButton, GoogleAuthButton } from './SubmitButtons';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

const AuthModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try for Free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row justify-center items-center gap-2">
            <Image src={Logo} alt="Logo" className="size-10" />
            <span className="text-3xl font-semibold">
              <span className="text-primary">Calendarly</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col mt-5 gap-3">
          <form
            action={async () => {
              'use server';

              await signIn('google');
            }}
            className="w-full"
          >
            <GoogleAuthButton />
          </form>
          <form
            action={async () => {
              'use server';

              await signIn('github');
            }}
            className="w-full"
          >
            <GitHubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
