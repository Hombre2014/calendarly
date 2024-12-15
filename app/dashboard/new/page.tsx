'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
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

  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Add new event type</CardTitle>
          <CardDescription>
            Create new ent type that allows people to book you!
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input placeholder="30 minutes meeting" />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="url">URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 round-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  calendarly.com/
                </span>
                <Input
                  className="rounded-l-none"
                  placeholder="duration-meeting"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea placeholder="Short 30 minutes meeting" />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select>
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
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Video Call Provider</Label>
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
