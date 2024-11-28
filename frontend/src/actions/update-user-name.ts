"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { userNameSchema } from "@/lib/zod";
import { auth } from "@/auth";

export type FormData = {
    name: string;
};

export async function updateUserName(userId: string, data: FormData) {
    try {
        const session = await auth();

        if (!session?.user || session?.user.id !== userId) {
            throw new Error("Unauthorized");
        }

        const { name } = userNameSchema.parse(data);

        // Update the user name.
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: name,
            },
        });

        revalidatePath("/dashboard/settings");
        return { status: "success" };
    } catch (error) {
        // console.log(error)
        return { status: error };
    }
}
