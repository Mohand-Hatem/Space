import { z } from "zod";
import { WORKSPACE_CONSTANTS, WORKSPACE_ROLES } from "./workspace.constants.js";

/**
 * Zod validation schema for creating a brand new tenant organization
 * Note: slug is optional! If omitted by the frontend UI, our service layer autogenerates it!
 */
export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Workspace name is strictly required" })
      .trim()
      .min(
        WORKSPACE_CONSTANTS.NAME_MIN_LENGTH,
        `Name must be at least ${WORKSPACE_CONSTANTS.NAME_MIN_LENGTH} characters`,
      )
      .max(
        WORKSPACE_CONSTANTS.NAME_MAX_LENGTH,
        `Name cannot exceed ${WORKSPACE_CONSTANTS.NAME_MAX_LENGTH} characters`,
      ),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        WORKSPACE_CONSTANTS.SLUG_REGEX,
        "Slug must consist strictly of lowercase letters, numbers, and single hyphens",
      )
      .optional(),
    description: z
      .string()
      .trim()
      .max(
        WORKSPACE_CONSTANTS.DESCRIPTION_MAX_LENGTH,
        `Description cannot exceed ${WORKSPACE_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
      )
      .optional()
      .default(""),
    logoUrl: z
      .string()
      .url("Please provide a valid HTTP/HTTPS logo image URL")
      .nullable()
      .optional(),
  }),
});

/**
 * Zod validation schema for updating workspace metadata or administrative settings
 */
export const updateWorkspaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(WORKSPACE_CONSTANTS.NAME_MIN_LENGTH)
      .max(WORKSPACE_CONSTANTS.NAME_MAX_LENGTH)
      .optional(),
    description: z
      .string()
      .trim()
      .max(WORKSPACE_CONSTANTS.DESCRIPTION_MAX_LENGTH)
      .optional(),
    logoUrl: z
      .string()
      .url("Please provide a valid logo image URL")
      .nullable()
      .optional(),
    settings: z
      .object({
        allowMemberInvites: z.boolean().optional(),
        defaultInviteRole: z.nativeEnum(WORKSPACE_ROLES).optional(),
        requireAdminApproval: z.boolean().optional(),
      })
      .optional(),
  }),
});

/**
 * Zod parameter schema for validating routing identifiers in URLs
 */
export const workspaceSlugParamSchema = z.object({
  params: z.object({
    slug: z.string().trim().toLowerCase(),
  }),
});

export const workspaceIdParamSchema = z.object({
  params: z.object({
    workspaceId: z
      .string({
        required_error:
          "Target Workspace ObjectId parameter is strictly required",
      })
      .length(24, "Workspace ObjectId must be exactly 24 hex characters"),
  }),
});
