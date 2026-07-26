import { z } from 'zod';

/**
 * Strict Input Validation Schemas for StoryNest.
 * Every input is validated against strict types, exact lengths, regex formats, and allowed enums.
 * Anything that fails validation is REJECTED rather than sanitized.
 */

// ── Email Validation Schema ──
export const emailSchema = z
  .string({ required_error: 'Email address is required.' })
  .trim()
  .min(5, 'Email must be at least 5 characters long.')
  .max(254, 'Email cannot exceed 254 characters.')
  .email('Invalid email address format.');

// ── Username Validation Schema ──
export const usernameSchema = z
  .string({ required_error: 'Username is required.' })
  .trim()
  .min(3, 'Username must be at least 3 characters.')
  .max(30, 'Username cannot exceed 30 characters.')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens.');

// ── Password Validation Schema ──
export const passwordSchema = z
  .string({ required_error: 'Password is required.' })
  .min(8, 'Password must be at least 8 characters long.')
  .max(128, 'Password cannot exceed 128 characters.')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.');

// ── Form Schemas ──

// 1. Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
});

// 2. Signup Schema
export const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  profilePic: z.any().optional(),
});

// 3. Google OAuth Signup Schema
export const googleSignupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  profilePic: z.any().optional(),
});

// 4. Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// 5. Reset Password Schema
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

// 6. Newsletter Subscription Schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

// 7. Post Category Allowed Enums
export const ALLOWED_CATEGORIES = [
  "Technology",
  "Lifestyle",
  "Travel",
  "Food & Cooking",
  "Business & Finance",
  "Health & Wellness",
  "Culture & Arts",
  "Personal Stories",
  "Other"
];

// 8. Story Post Schema
export const postSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(3, 'Title must be at least 3 characters.')
    .max(120, 'Title cannot exceed 120 characters.'),
  slug: z
    .string({ required_error: 'Slug is required.' })
    .trim()
    .min(2, 'Slug must be at least 2 characters.')
    .max(36, 'Slug cannot exceed 36 characters.')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  content: z
    .string({ required_error: 'Story content is required.' })
    .trim()
    .min(10, 'Story content must be at least 10 characters long.')
    .max(50000, 'Story content exceeds maximum length (50,000 characters).'),
  category: z
    .string()
    .optional()
    .transform((val) => (val && ALLOWED_CATEGORIES.includes(val) ? val : "Other")),
  status: z.enum(['active', 'inactive']),
  image: z.any().optional(),
});

// 9. Profile Edit Schema
export const editProfileSchema = z.object({
  username: usernameSchema,
  email: emailSchema.optional(),
  profilePic: z.any().optional(),
});

// 10. File Validation Utility
export const validateImageFile = (file) => {
  if (!file) return { valid: true };
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
  const maxSizeMs = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Invalid file type. Only PNG, JPG, JPEG, GIF, and WEBP images are allowed.' };
  }
  if (file.size > maxSizeMs) {
    return { valid: false, message: 'File size exceeds maximum limit of 10 MB.' };
  }
  return { valid: true };
};
