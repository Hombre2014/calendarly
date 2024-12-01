import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { MenuIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

import prisma from '../lib/db';
import Logo from '@/public/logo.png';
import { signOut } from '../lib/auth';
import { requireUser } from '../lib/hooks';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';
import DashboardLinks from '../components/DashboardLinks';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: { userName: true, grantId: true },
  });

  if (!data?.userName) {
    return redirect('/onboarding');
  }

  if (!data?.grantId) {
    return redirect('/onboarding/grant-id');
  }

  return data;
}

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const session = await requireUser();

  const data = await getData(session.user?.id as string);

  return (
    <>
      <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-[280px_1fr]">
        <div className="hidden md:block border-r bg-muted/40">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image alt="Logo" src={Logo} className="size-10" />
                <p className="text-xl font-bold text-primary">Calendarly</p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="md:hidden shrink-0"
                  size="icon"
                  variant="outline"
                >
                  <MenuIcon className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 mt-10">
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="ml-auto flex items-center gap-x-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width={20}
                      height={20}
                      alt="Profile Image"
                      src={session?.user?.image as string}
                      className="rounded-full h-full w-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <form
                      action={async () => {
                        'use server';
                        await signOut();
                      }}
                      className="w-full"
                    >
                      <button className="w-full text-left">Log out</button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
