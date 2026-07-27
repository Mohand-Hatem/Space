import Workspace from "./workspace.model.js";
import WorkspaceMember from "./workspace-member.model.js";
import { WORKSPACE_STATUS } from "./workspace.constants.js";

/**
 * Create and persist a brand new organization workspace document in MongoDB
 */
const createWorkspace = async (workspaceData) => {
  const workspace = await Workspace.create(workspaceData);
  return findById(workspace._id, { populateOwner: true });
};

/**
 * Create a relational membership junction linking a User to a Workspace with an assigned team role
 */
const createMember = async (memberData) => {
  return await WorkspaceMember.create(memberData);
};

/**
 * Check whether an organization routing slug is already reserved in the database
 * Note: Checked across ALL documents to respect MongoDB's unique database index constraints!
 */
const slugExists = async (slug) => {
  const count = await Workspace.countDocuments({ slug: slug.toLowerCase() });
  return count > 0;
};

/**
 * Retrieve an active workspace by its ObjectId, with optional safe owner profile population
 */
const findById = async (workspaceId, options = {}) => {
  const query = Workspace.findOne({ _id: workspaceId, isDeleted: false });

  if (options.populateOwner) {
    // Explicitly select non-sensitive user attributes to avoid exposing hashes or OTPs
    query.populate("owner", "email firstName lastName status");
  }

  return await query.exec();
};

/**
 * Retrieve an active workspace via its URL routing slug
 */
const findBySlug = async (slug, options = {}) => {
  const query = Workspace.findOne({
    slug: slug.toLowerCase(),
    isDeleted: false,
  });

  if (options.populateOwner) {
    query.populate("owner", "email firstName lastName status");
  }

  return await query.exec();
};

/**
 * Retrieve all active workspaces where a specified user holds an authorized team membership
 */
const findUserWorkspaces = async (userId) => {
  const memberships = await WorkspaceMember.find({ userId })
    .populate({
      path: "workspaceId",
      match: { isDeleted: false, status: WORKSPACE_STATUS.ACTIVE },
      select: "name slug logoUrl description owner status settings createdAt",
    })
    .sort({ joinedAt: -1 })
    .exec();

  // Filter out orphaned memberships where the parent workspace was previously soft-deleted or suspended
  return memberships
    .filter((membership) => membership.workspaceId !== null)
    .map((membership) => ({
      ...membership.workspaceId.toObject(),
      userRole: membership.role,
      joinedAt: membership.joinedAt,
    }));
};

/**
 * Fast relational lookup: Check a specific User's membership role inside a target Workspace
 * Primarily used by ABAC Authorization Guards in Step 5!
 */
const findMember = async (workspaceId, userId) => {
  return await WorkspaceMember.findOne({ workspaceId, userId }).exec();
};

/**
 * Retrieve the complete team roster for a specific workspace with user profile metadata
 */
const findWorkspaceMembers = async (workspaceId) => {
  return await WorkspaceMember.find({ workspaceId })
    .populate("userId", "email firstName lastName status")
    .populate("invitedBy", "email firstName lastName")
    .sort({ joinedAt: 1 })
    .exec();
};

/**
 * Atomically update workspace attributes (such as name, logoUrl, or tenant settings)
 */
const updateWorkspace = async (workspaceId, updateData) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true },
  ).exec();
};

/**
 * Soft-delete an organization workspace without destroying historical activity tracking rows
 */
const softDeleteWorkspace = async (workspaceId) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: WORKSPACE_STATUS.DELETED,
      },
    },
    { new: true },
  ).exec();
};

// Exporting pure functional repository methods
export default {
  createWorkspace,
  createMember,
  slugExists,
  findById,
  findBySlug,
  findUserWorkspaces,
  findMember,
  findWorkspaceMembers,
  updateWorkspace,
  softDeleteWorkspace,
};
