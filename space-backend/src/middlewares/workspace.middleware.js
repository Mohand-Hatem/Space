import workspaceRepository from "../modules/workspaces/workspace.repository.js";
import AppError from "../shared/AppError.js";
import { ErrorCode } from "../shared/ErrorCodes.js";
import asyncHandler from "../shared/asyncHandler.js";
import logger from "../shared/logger/logger.js";

/**
 * Domain-Scoped ABAC Role Security Guard Middleware
 * Evaluates whether the logged-in User holds an authorized team role within the target Workspace.
 *
 * @param {...string} allowedRoles - Allowed team permission roles (e.g., 'OWNER', 'ADMIN')
 * @returns {Function} Pure asynchronous Express middleware guard
 */
export const verifyWorkspaceRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    // 1. DYNAMIC ID EXTRACTION: Intelligently discover target Workspace ID across request locations
    const targetWorkspaceId =
      req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;

    if (!targetWorkspaceId) {
      logger.warn(
        "Workspace ABAC guard failed: no target workspaceId provided in request parameters or payload.",
      );
      throw AppError.badRequest(
        ErrorCode.MISSING_PARAMETERS,
        "Target Workspace ID parameter is strictly required to verify team authorization.",
      );
    }

    // 2. DEFENSIVE MEMBERSHIP INQUIRY: Fast lookup utilizing our Step 1 Compound Unique Index!
    const membership = await workspaceRepository.findMember(
      targetWorkspaceId,
      req.user._id,
    );

    if (!membership) {
      logger.warn(
        `Unauthorized domain interception attempt on Workspace [${targetWorkspaceId}] by User [${req.user._id}]`,
      );
      throw AppError.forbidden(
        ErrorCode.ACCESS_DENIED,
        "Access Restricted: You do not hold an active collaborative seat within this workspace organization.",
      );
    }

    // 3. ABAC ROLE PRIVILEGE EVALUATION: Verify if caller's team role matches allowed action tiers
    if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
      logger.warn(
        `Insufficient privileges: User [${req.user._id}] attempted restricted action on Workspace [${targetWorkspaceId}]. Held Role: [${membership.role}], Required: [${allowedRoles.join(" or ")}]`,
      );
      throw AppError.forbidden(
        ErrorCode.INSUFFICIENT_PERMISSIONS,
        `Your team permission level (${membership.role}) lacks sufficient authority for this administrative action. Required Role: ${allowedRoles.join(" or ")}.`,
      );
    }

    // 4. CONTEXT ENRICHMENT: Inject verified team credentials straight into HTTP request object!
    req.workspaceMember = membership;
    req.workspaceRole = membership.role;
    req.currentWorkspaceId = targetWorkspaceId;

    next();
  });
};

export default { verifyWorkspaceRole };
