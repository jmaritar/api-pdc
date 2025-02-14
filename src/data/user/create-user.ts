import prisma from '@/client/prisma';

import { type CreateUser } from './schema';

interface CreateUserDataProps {
  values: CreateUser;
}

export async function CreateUserData({ values }: CreateUserDataProps) {
  return await prisma.user.create({
    data: {
      email: values.email,
      password: values.password,
      name: values.name,
      role: values.role,
      is_active: values.is_active,
    },
  });
}
