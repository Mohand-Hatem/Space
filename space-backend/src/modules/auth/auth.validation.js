import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email address is required" })
      .email("Please provide a valid email address")
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password cannot exceed 128 characters"),
    firstName: z
      .string({ required_error: "First name is required" })
      .trim()
      .min(2, "First name must contain at least 2 characters")
      .max(50, "First name cannot exceed 50 characters"),
    lastName: z
      .string({ required_error: "Last name is required" })
      .trim()
      .min(2, "Last name must contain at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email address is required" })
      .email("Please provide a valid email address")
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    otp: z
      .string({ required_error: "Verification code is required" })
      .length(6, "OTP must be exactly 6 digits long")
      .regex(/^\d{6}$/, "OTP must consist only of numeric digits"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    otp: z
      .string({ required_error: "Verification code is required" })
      .length(6, "OTP must be exactly 6 digits long")
      .regex(/^\d{6}$/, "OTP must consist only of numeric digits"),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password cannot exceed 128 characters"),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z
      .string({ required_error: "Google authentication ID token is required" })
      .trim()
      .min(1, "ID token cannot be empty"),
  }),
});
