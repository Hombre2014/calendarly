'use client';

import { useFormState } from 'react-dom';
import { parseWithZod } from '@conform-to/zod';

import { useForm } from '@conform-to/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingAction } from '@/app/actions';
import { onboardingSchema } from '@/app/lib/zodSchemas';
import { SubmitButton } from '@/app/components/SubmitButtons';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

const OnboardingRoute = () => {
  const [lastResult, action] = useFormState(OnboardingAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome to <span className="text-primary">Calendarly</span>
          </CardTitle>
          <CardDescription>
            We need the following information to set up your profile
          </CardDescription>
        </CardHeader>
        <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
          <CardContent className="flex flex-col gap-y-5">
            <div className="grid gap-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Dow"
                key={fields.fullName.key}
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue}
              />
              <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  calendarly.com/
                </span>
                <Input
                  placeholder="username"
                  key={fields.userName.key}
                  className="rounded-l-none"
                  name={fields.userName.name}
                  defaultValue={fields.userName.initialValue}
                />
              </div>
              <p className="text-red-500 text-sm">{fields.userName.errors}</p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Submit" className="w-full" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default OnboardingRoute;