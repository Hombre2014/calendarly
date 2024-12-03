import { notFound } from 'next/navigation';

import prisma from '@/lib/db';
import { requireUser } from '@/lib/hooks';
import SettingsForm from '@/components/custom/SettingsForm';

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: { id: id },
    select: { name: true, email: true, image: true },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const SettingsRoute = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <div>
      <SettingsForm
        email={data.email}
        fullName={data.name as string}
        profileImage={data.image as string}
      />
    </div>
  );
};

export default SettingsRoute;
