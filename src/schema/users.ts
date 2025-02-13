import { z } from 'zod';

export const userSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .trim()
    .min(1, 'Email cannot be empty')
    .email('Invalid email'),
  name: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .min(1, 'Name cannot be empty'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .trim()
    .min(8, 'Password cannot be empty'),
});

export type Users = z.infer<typeof userSchema>;