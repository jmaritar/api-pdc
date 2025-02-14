import prisma from '@/client/prisma';

export async function getUserData(email: string) {
  if (!email) return null;

  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
