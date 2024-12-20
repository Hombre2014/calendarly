import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Pen,
  Trash,
  Link2,
  Users2,
  Settings,
  ExternalLink,
} from 'lucide-react';

import prisma from '@/lib/db';
import { requireUser } from '@/lib/hooks';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/custom/EmptyState';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userName: true,
      eventType: {
        select: {
          id: true,
          url: true,
          title: true,
          active: true,
          duration: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const DashboardPage = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <>
      {data.eventType.length > 0 ? (
        <>
          <div className="flex items-center justify-between px-2">
            <div className="hidden sm:grid gap-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold">
                Event types
              </h1>
              <p className="text-muted-foreground">
                Create and manage your event types here.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new">Create New Event</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.eventType.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden shadow rounded-lg border relative"
              >
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Event</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={`/${data.userName}/${item.url}`}>
                            <ExternalLink className="mr-2 size-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link2 className="mr-2 size-4" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pen className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link
                  href={`/dashboard/${item.url}`}
                  className="flex items-center p-5"
                >
                  <div className="flex-shrink-0">
                    <Users2 className="size-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Duration {item.duration} minutes
                      </dt>
                      <dd className="text-lg font-medium">{item.title}</dd>
                    </dl>
                  </div>
                </Link>
                <div className="bg-muted px-5 py-3 flex justify-between items-center">
                  <Switch />
                  <Button>Edit Event</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          href="/dashboard/new"
          buttonText="Add event type"
          title="You have no Event Types"
          description="You can create your first event type by clicking the button below"
        />
      )}
    </>
  );
};

export default DashboardPage;
