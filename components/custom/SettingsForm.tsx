'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useFormState } from 'react-dom';
import { useForm } from '@conform-to/react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SubmitButton } from './SubmitButtons';
import { SettingsAction } from '@/app/actions';
import { parseWithZod } from '@conform-to/zod';
import { Button } from '@/components/ui/button';
import { settingsSchema } from '@/lib/zodSchemas';
import { UploadDropzone } from '@/lib/uploadthing';
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

interface SettingsFormProps {
  email: string;
  fullName: string;
  profileImage: string;
}

const SettingsForm = ({ email, fullName, profileImage }: SettingsFormProps) => {
  const [lastResult, action] = useFormState(SettingsAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingsSchema,
      });
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              className="input"
              placeholder="John Doe"
              defaultValue={fullName}
              key={fields.fullName.key}
              name={fields.fullName.name}
            />
            <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled
              id="email"
              type="email"
              className="input"
              defaultValue={email}
              placeholder="joe@email.com"
            />
          </div>
          <div className="flex flex-col gap-y-5">
            <Label htmlFor="profileImage">Profile Image</Label>
            <input
              type="hidden"
              key={fields.fullName.key}
              value={currentProfileImage}
              name={fields.profileImage.name}
            />
            {currentProfileImage ? (
              <div className="relative size-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Profile Image"
                  src={currentProfileImage}
                  className="rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setCurrentProfileImage('')}
                  className="absolute -top-3 -right-3 h-5 w-5 p-0 rounded-full"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success('Image uploaded successfully');
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
                endpoint="imageUploader"
              />
            )}
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
};

export default SettingsForm;
