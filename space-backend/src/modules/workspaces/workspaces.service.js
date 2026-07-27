import workspaceRepository from "./workspace.repository.js";
import AppError from "../../shared/AppError.js";
import { ErrorCode } from "../../shared/ErrorCodes.js";
import { WORKSPACE_ROLES } from "./workspace.constants.js";
import logger from "../../shared/logger/logger.js";

/**
 * Utility: Convert a human readable brand string into a hygienic URL routing slug
 * e.g., "DevOps Studio 2026! @Space" -> "devops-studio-2026-space"
 */
const generateSlug = (name) => {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Convert all spaces, non-word chars, and duplicate hyphens into a single hyphen
    .replace(/^-+|-+$/g, ""); // Strip off any trailing or leading hyphens
};

/**
 * Tenant Onboarding: Launch a brand new collaborative workspace and assign creator as OWNER
 */
const createWorkspace = async (userId, payload) => {
  // 1. Derive or utilize provided URL routing slug
  const targetSlug = payload.slug || generateSlug(payload.name);

  // 2. Defensive check: Validate whether this slug is already claimed by another organization
  const isSlugClaimed = await workspaceRepository.slugExists(targetSlug);
  if (isSlugClaimed) {
    logger.warn(
      `Workspace onboarding rejected: slug collision detected for [${targetSlug}]`,
      { userId },
    );
    throw AppError.conflict(
      ErrorCode.RESOURCE_CONFLICT,
      "A collaborative workspace utilizing this exact name or URL slug already exists. Please choose a distinct name or explicit slug.",
    );
  }

  // 3. Persist the parent Workspace tenant organization
  const newWorkspace = await workspaceRepository.createWorkspace({
    ...payload,
    slug: targetSlug,
    owner: userId,
  });

  // 4. CRITICAL RELATIONAL BINDING: Simultaneously enroll the creator as the founding OWNER!
  await workspaceRepository.createMember({
    workspaceId: newWorkspace._id,
    userId,
    role: WORKSPACE_ROLES.OWNER,
    invitedBy: null, // Null proves this member is the original founding founder!
  });

  logger.info(
    `New collaborative workspace instantiated successfully: [${newWorkspace.name}] (${targetSlug})`,
    {
      workspaceId: newWorkspace._id,
      founderId: userId,
    },
  );

  return newWorkspace;
};

/**
 * Fetch all collaborative team workspaces where the authenticated user holds an active seat
 */
const getUserWorkspaces = async (userId) => {
  return await workspaceRepository.findUserWorkspaces(userId);
};

/**
 * Retrieve deep organization metadata via routing slug while enforcing tenant boundary checks
 */
const getWorkspaceBySlug = async (slug, userId) => {
  // 1. Attempt to locate the target active organization
  const workspace = await workspaceRepository.findBySlug(slug, {
    populateOwner: true,
  });
  if (!workspace) {
    throw AppError.notFound(
      ErrorCode.RESOURCE_NOT_FOUND,
      "The requested workspace organization could not be located or has been archived.",
    );
  }

  // 2. TENANT SECURITY SHIELD: Check if the logged-in user holds an active membership row
  const membership = await workspaceRepository.findMember(
    workspace._id,
    userId,
  );
  if (!membership) {
    logger.warn(
      `Unauthorized workspace query attempt on tenant [${slug}] by user [${userId}]`,
    );
    throw AppError.forbidden(
      ErrorCode.ACCESS_DENIED,
      "Access Restricted: You do not hold an active collaborative seat within this workspace organization.",
    );
  }

  // Return full tenant parameters seamlessly bundled with the requesting user's authorization level!
  return {
    ...workspace.toObject(),
    userRole: membership.role,
  };
};

/**
 * Update tenant branding or administrative configuration preferences
 * Note: Role authorization (confirming caller is OWNER/ADMIN) is governed in Step 5 Middleware!
 */
const updateWorkspace = async (workspaceId, updateData) => {
  const updatedWorkspace = await workspaceRepository.updateWorkspace(
    workspaceId,
    updateData,
  );
  if (!updatedWorkspace) {
    throw AppError.notFound(
      ErrorCode.RESOURCE_NOT_FOUND,
      "Workspace target could not be found for administrative update.",
    );
  }

  logger.info(`Workspace attributes updated cleanly: [${workspaceId}]`);
  return updatedWorkspace;
};

/**
 * Soft-delete an entire collaborative organization workspace
 */
const deleteWorkspace = async (workspaceId) => {
  const deletedWorkspace =
    await workspaceRepository.softDeleteWorkspace(workspaceId);
  if (!deletedWorkspace) {
    throw AppError.notFound(
      ErrorCode.RESOURCE_NOT_FOUND,
      "Workspace organization could not be located for soft deletion.",
    );
  }

  logger.info(`Workspace soft-deleted successfully: [${workspaceId}]`);
  return { message: "Workspace organization has been deleted successfully." };
};

// Exporting pure functional service capabilities
export default {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceBySlug,
  updateWorkspace,
  deleteWorkspace,
};
