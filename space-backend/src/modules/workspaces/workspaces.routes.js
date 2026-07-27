import { Router } from "express";
import workspaceController from "./workspace.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { verifyWorkspaceRole } from "../../middlewares/workspace.middleware.js";
import validateRequest from "../../middlewares/validateRequest.middleware.js";
import { WORKSPACE_ROLES } from "./workspace.constants.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceSlugParamSchema,
  workspaceIdParamSchema,
} from "./workspace.validation.js";

const router = Router();

// ============================================================================
// 🛡️ ZERO-TRUST ROUTER SHIELD: All workspace interaction demands valid Cookie Auth!
// ============================================================================
router.use(protect);

// ----------------------------------------------------------------------------
// Core Workspace Onboarding and Discovery Endpoints
// ----------------------------------------------------------------------------
router.post(
  "/",
  validateRequest(createWorkspaceSchema),
  workspaceController.createWorkspace,
);

router.get("/", workspaceController.getUserWorkspaces);

// ----------------------------------------------------------------------------
// Specific Tenant Metadata, Configuration, and Deletion Endpoints
// ----------------------------------------------------------------------------
router.get(
  "/:slug",
  validateRequest(workspaceSlugParamSchema),
  workspaceController.getWorkspaceBySlug,
);

// ----------------------------------------------------------------------------
// 🛡️ ABAC PROTECTED ADMINISTRATIVE ENDPOINTS: Strictly Owner or Admin access!
// ----------------------------------------------------------------------------

// Both OWNER and ADMIN can update general workspace configuration or logos
router.patch(
  "/:workspaceId",
  validateRequest(workspaceIdParamSchema),
  verifyWorkspaceRole(WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.ADMIN),
  validateRequest(updateWorkspaceSchema),
  workspaceController.updateWorkspace,
);

// ONLY the founding OWNER is allowed to archive or delete the corporate workspace!
router.delete(
  "/:workspaceId",
  validateRequest(workspaceIdParamSchema),
  verifyWorkspaceRole(WORKSPACE_ROLES.OWNER),
  workspaceController.deleteWorkspace,
);

export default router;
