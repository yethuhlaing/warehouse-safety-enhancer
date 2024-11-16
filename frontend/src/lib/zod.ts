import * as z from "zod";
import { UserRole } from "@prisma/client";

export const signInSchema = z.object({
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export const userAuthSchema = z.object({
    email: z.string().email(),
  })
  
export const ogImageSchema = z.object({
    heading: z.string(),
    type: z.string(),
    mode: z.enum(["light", "dark"]).default("dark"),
});

export const userNameSchema = z.object({
    name: z.string().min(3).max(32),
});

export const userRoleSchema = z.object({
    role: z.nativeEnum(UserRole),
});
