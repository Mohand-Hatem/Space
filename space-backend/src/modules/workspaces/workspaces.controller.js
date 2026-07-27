import workspaceService from "./workspace.service.js";
import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";

/**
 * @desc    Launch a brand new multi-tenant organization workspace
 * @route   POST /api/v1/workspaces
 * @access  Private (Requires valid HTTP-Only Session Cookie)
 */
const createWorkspace = asyncHandler(async (req, res) => {
  // req.user._id is securely injected by our Phase 2 'protect' cookie shield
  const workspace = await workspaceService.createWorkspace(
    req.user._id,
    req.body,
  );

  return ApiResponse.success(
    res,
    201, // Return explicit 201 CREATED status code for successful onboarding!
    "Collaborative workspace organization launched successfully!",
    workspace,
  );
});

/**
 * @desc    Fetch all workspaces where the logged-in user holds an active membership seat
 * @route   GET /api/v1/workspaces
 * @access  Private
 */
const getUserWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await workspaceService.getUserWorkspaces(req.user._id);

  return ApiResponse.success(
    res,
    200,
    "Authorized workspace organizations retrieved successfully",
    {
      count: workspaces.length,
      workspaces,
    },
  );
});

/**
 * @desc    Retrieve full organization configuration and branding via unique routing slug
 * @route   GET /api/v1/workspaces/:slug
 * @access  Private (Requires verified membership row within target workspace)
 */
const getWorkspaceBySlug = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.getWorkspaceBySlug(
    req.params.slug,
    req.user._id,
  );

  return ApiResponse.success(
    res,
    200,
    "Workspace configuration loaded successfully",
    workspace,
  );
});

/**
 * @desc    Modify team settings, description, or branding logo URLs
 * @route   PATCH /api/v1/workspaces/:workspaceId
 * @access  Private (Will be guarded by Step 5 ABAC Role Shield!)
 */
const updateWorkspace = asyncHandler(async (req, res) => {
  const updatedWorkspace = await workspaceService.updateWorkspace(
    req.params.workspaceId,
    req.body,
  );

  return ApiResponse.success(
    res,
    200,
    "Workspace organization settings updated successfully",
    updatedWorkspace,
  );
});

/**
 * @desc    Soft-delete an organization workspace without erasing historical analytics
 * @route   DELETE /api/v1/workspaces/:workspaceId
 * @access  Private (Will be guarded by Step 5 ABAC Role Shield!)
 */
const deleteWorkspace = asyncHandler(async (req, res) => {
  const result = await workspaceService.deleteWorkspace(req.params.workspaceId);

  return ApiResponse.success(
    res,
    200,
    "Workspace organization archived successfully",
    result,
  );
});

// Exporting pure functional controller capabilities
export default {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceBySlug,
  updateWorkspace,
  deleteWorkspace,
};
