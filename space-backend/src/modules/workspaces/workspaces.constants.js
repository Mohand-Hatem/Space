/**
 * Immutable Domain Enumerations and Constants for Workspaces
 */
export const WORKSPACE_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
});

/**
 * Team Attribute-Based Access Control (ABAC) Roles within a Workspace
 */
export const WORKSPACE_ROLES = Object.freeze({
  OWNER: "OWNER", // Full administrative control, billing management, and project deletion
  ADMIN: "ADMIN", // Can invite members, create projects, and manage settings
  MEMBER: "MEMBER", // Standard collaborative worker: can manage assigned tasks and comment
  GUEST: "GUEST", // Read-only or limited collaborator access to designated shared boards
});

export const WORKSPACE_CONSTANTS = Object.freeze({
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 60,
  DESCRIPTION_MAX_LENGTH: 250,

  // Slug must contain strictly lowercase letters, numbers, and hyphens without consecutive hyphens
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  DEFAULT_LOGO_URL: null,
  DEFAULT_MEMBER_ROLE: WORKSPACE_ROLES.MEMBER,
});
