'use client';

import Link from 'next/link';
// import { useFormState } from 'react-dom';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { eventTypeSchema } from '@/lib/zodSchemas';
import { Textarea } from '@/components/ui/textarea';
import { CreateEventTypeAction } from '@/app/actions';
import ButtonGroup from '@/components/custom/ButtonGroup';
import { SubmitButton } from '@/components/custom/SubmitButtons';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

type VideoCallProvider = 'Zoom Meeting' | 'Google Meet' | 'Microsoft Teams';

const NewEventRoute = () => {
  const [activePlatform, setActivePlatform] =
    useState<VideoCallProvider>('Google Meet');

  const [lastResult, action] = useActionState(CreateEventTypeAction, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: eventTypeSchema,
      });
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Add new event type</CardTitle>
          <CardDescription>
            Create new ent type that allows people to book you!
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                key={fields.title.key}
                name={fields.title.name}
                placeholder="30 minutes meeting"
                defaultValue={fields.title.initialValue}
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="url">URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 round-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  calendarly.com/
                </span>
                <Input
                  key={fields.url.key}
                  name={fields.url.name}
                  placeholder="example-url"
                  className="rounded-l-none"
                  defaultValue={fields.url.initialValue}
                />
              </div>
              <p className="text-red-500 text-sm">{fields.url.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                key={fields.description.key}
                name={fields.description.name}
                placeholder="Short 30 minutes meeting"
                defaultValue={fields.description.initialValue}
              />
              <p className="text-red-500 text-sm">
                {fields.description.errors}
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                key={fields.duration.key}
                name={fields.duration.name}
                defaultValue={fields.duration.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.duration.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Video Call Provider</Label>
              <input
                type="hidden"
                name="videoCallSoftware"
                value={activePlatform}
              />
              <ButtonGroup>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setActivePlatform('Zoom Meeting')}
                  variant={
                    activePlatform === 'Zoom Meeting' ? 'secondary' : 'outline'
                  }
                >
                  Zoom
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setActivePlatform('Google Meet')}
                  variant={
                    activePlatform === 'Google Meet' ? 'secondary' : 'outline'
                  }
                >
                  Google Meet
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setActivePlatform('Microsoft Teams')}
                  variant={
                    activePlatform === 'Microsoft Teams'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  Microsoft Teams
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-sm">
                {fields.videoCallSoftware.errors}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex w-full justify-between">
            <Button type="button" variant="secondary" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton text="Create Event Type" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewEventRoute;
