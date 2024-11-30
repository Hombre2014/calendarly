import { conformZodMessage } from '@conform-to/zod';
import { z } from 'zod';

export const onboardingSchema = z.object({
  fullName: z.string().min(3).max(150),
  userName: z
    .string()
    .min(3)
    .max(150)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: 'Username can only contain letters, numbers and dashes "-"',
    }),
});

export function onboardingSchemaValidation(options?: {
  isUserNameUnique: () => Promise<boolean>;
}) {
  return z.object({
    userName: z
      .string()
      .min(3)
      .max(150)
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: 'Username can only contain letters, numbers and dashes "-"',
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUserNameUnique !== 'function') {
            ctx.addIssue({
              code: 'custom',
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isUserNameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: 'custom',
                message: 'Username is already taken',
              });
            }
          });
        })
      ),
    fullName: z.string().min(3).max(150),
  });
}
