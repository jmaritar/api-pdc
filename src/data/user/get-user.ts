import prisma from "@/client/prisma";



export async function getUserData(email: string) {
  return await prisma.user.findUnique({
          where: { email },
        });
}