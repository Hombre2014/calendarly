import { notFound } from 'next/navigation';

import prisma from '@/lib/db';
import { requireUser } from '@/lib/hooks';
import EmptyState from '@/components/EmptyState';

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
        <p>No data</p>
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
