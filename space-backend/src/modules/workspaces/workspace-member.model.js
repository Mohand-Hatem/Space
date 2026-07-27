import mongoose from "mongoose";
import { WORKSPACE_ROLES } from "./workspace.constants.js";

const workspaceMemberSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Target Workspace ID is strictly required"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Target User ID is strictly required"],
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(WORKSPACE_ROLES),
      default: WORKSPACE_ROLES.MEMBER,
      required: [true, "Team ABAC permission role is strictly required"],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Null indicates the member is the original founding creator/owner!
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// CRITICAL COMPOUND INDEX: Guarantee that a User can never be duplicated within the same Workspace!
workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

// Optimize query performance for dashboard lookups ("Fetch all workspaces where Mohand is a team member")
workspaceMemberSchema.index({ userId: 1, role: 1 });

const WorkspaceMember = mongoose.model(
  "WorkspaceMember",
  workspaceMemberSchema,
);
export default WorkspaceMember;
