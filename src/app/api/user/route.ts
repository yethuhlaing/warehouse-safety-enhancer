import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

import prisma from "@/lib/prisma";

export const DELETE = auth(async (req: any) => {
    if (!req.auth) {
        return new Response("Not authenticated", { status: 401 });
    }

    const currentUser = req.auth.user;
    if (!currentUser) {
        return new Response("Invalid user", { status: 401 });
    }

    try {
        await prisma.user.delete({
            where: {
                id: currentUser.id,
            },
        });
    } catch (error) {
        return new Response("Internal server error", { status: 500 });
    }

    return new Response("User deleted successfully!", { status: 200 });
});
