'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  Users2,
  Settings,
  HomeIcon,
  LucideProps,
  CalendarCheck,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface AppProps {
  id: number;
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}

export const dashboardLinks: AppProps[] = [
  {
    id: 0,
    icon: HomeIcon,
    href: '/dashboard',
    name: 'Event Types',
  },
  {
    id: 1,
    icon: Users2,
    name: 'Meetings',
    href: '/dashboard/meetings',
  },
  {
    id: 2,
    icon: CalendarCheck,
    name: 'Availability',
    href: '/dashboard/availability',
  },
  {
    id: 3,
    icon: Settings,
    name: 'Settings',
    href: '/dashboard/settings',
  },
];

const DashboardLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            pathname === link.href
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground',
            'flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary'
          )}
        >
          <link.icon className="size-4" />
          <span>{link.name}</span>
        </Link>
      ))}
    </>
  );
};

export default DashboardLinks;
