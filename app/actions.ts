'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { parseWithZod } from '@conform-to/zod';
import type { CreateEventRequest } from 'nylas';

import prisma from '@/lib/db';
import { nylas } from '@/lib/nylas';
import { requireUser } from '@/lib/hooks';
import {
  settingsSchema,
  eventTypeSchema,
  onboardingSchemaValidation,
} from '@/lib/zodSchemas';

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

  await prisma.user.update({
    where: { id: session.user?.id },
    data: {
      name: submission.value.fullName,
      userName: submission.value.userName,
      availability: {
        createMany: {
          data: [
            { day: 'Monday', fromTime: '09:00', tillTime: '18:00' },
            { day: 'Tuesday', fromTime: '09:00', tillTime: '18:00' },
            { day: 'Wednesday', fromTime: '09:00', tillTime: '18:00' },
            { day: 'Thursday', fromTime: '09:00', tillTime: '18:00' },
            { day: 'Friday', fromTime: '09:00', tillTime: '18:00' },
            { day: 'Saturday', fromTime: '09:00', tillTime: '18:00' },
            { day: 'Sunday', fromTime: '09:00', tillTime: '18:00' },
          ],
        },
      },
    },
  });

  return redirect('/onboarding/grant-id');
}

export async function SettingsAction(
  prevState: Record<string, unknown>,
  formData: FormData
) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  await prisma.user.update({
    where: { id: session.user?.id },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  return redirect('/dashboard');
}

export async function updateAvailabilityAction(formData: FormData) {
  await requireUser();

  const rawData = Object.fromEntries(formData.entries());
  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith('id-'))
    .map((key) => {
      const id = key.replace('id-', '');
      return {
        id,
        isActive: rawData[`isActive-${id}`] === 'on',
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath('/dashboard/availability');
  } catch (error) {
    console.error('Error updating availability:', error);
  }
}

export async function CreateEventTypeAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  await prisma.eventType.create({
    data: {
      userId: session.user?.id,
      url: submission.value.url,
      title: submission.value.title,
      duration: submission.value.duration,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  });

  return redirect('/dashboard');
}

export async function CreateMeetingAction(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      userName: formData.get('userName') as string,
    },
    select: {
      name: true,
      grantId: true,
      zoomToken: true,
      grantEmail: true,
      microsoftToken: true,
      calendarProvider: true,
    },
  });

  if (!getUserData) {
    throw new Error('User not found');
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get('eventTypeId') as string,
    },
    select: {
      title: true,
      duration: true,
      description: true,
      videoCallSoftware: true,
    },
  });

  const fromTime = formData.get('fromTime') as string;
  const eventDate = formData.get('eventDate') as string;
  const meetingLength = Number(formData.get('meetingLength'));
  const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  const calendars = await nylas.calendars.list({
    identifier: getUserData.grantId as string,
  });

  const calendarId = calendars.data[0].id;

  const getConferencingSetup = (
    calendarProvider: string
  ): CreateEventRequest['conferencing'] => {
    if (calendarProvider === 'microsoft') {
      return {
        provider: 'Microsoft Teams',
        autocreate: {
          access_token: getUserData.microsoftToken || undefined,
        },
      };
    }

    if (calendarProvider === 'zoom') {
      return {
        provider: 'Zoom Meeting',
        autocreate: {
          access_token: getUserData.zoomToken || undefined,
        },
      };
    }

    return undefined;
  };

  type ParticipantStatus = 'yes' | 'no' | 'maybe' | 'noreply';

  const participants: {
    email: string;
    name: string;
    status: ParticipantStatus;
  }[] = [
    {
      email: getUserData.grantEmail as string,
      name: getUserData.name || 'Host',
      status: 'yes',
    },
    {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      status: 'yes',
    },
  ];

  await nylas.events.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      calendarId: calendarId,
      title: eventTypeData?.title,
      description: eventTypeData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: getConferencingSetup(
        getUserData.calendarProvider || 'google'
      ),
      participants: participants,
    },
    queryParams: {
      calendarId: calendarId,
      notifyParticipants: true,
    },
  });

  return redirect('/success');
}
