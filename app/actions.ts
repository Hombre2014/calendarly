'use server';

import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';

import prisma from './lib/db';
import { requireUser } from './lib/hooks';
import { onboardingSchemaValidation } from './lib/zodSchemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function OnboardingAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      async isUserNameUnique() {
        const existingUserName = await prisma.user.findUnique({
          where: { userName: formData.get('userName') as string },
        });
        return !existingUserName;
      },
    }),

    async: true,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: { id: session.user?.id },
    data: {
      name: submission.value.fullName,
      userName: submission.value.userName,
    },
  });

  return redirect('/dashboard');
}
