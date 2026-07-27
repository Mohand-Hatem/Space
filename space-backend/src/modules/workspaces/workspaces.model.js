import mongoose from "mongoose";
import {
  WORKSPACE_STATUS,
  WORKSPACE_CONSTANTS,
  WORKSPACE_ROLES,
} from "./workspace.constants.js";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is strictly required"],
      trim: true,
      minlength: [
        WORKSPACE_CONSTANTS.NAME_MIN_LENGTH,
        `Workspace name must be at least ${WORKSPACE_CONSTANTS.NAME_MIN_LENGTH} characters`,
      ],
      maxlength: [
        WORKSPACE_CONSTANTS.NAME_MAX_LENGTH,
        `Workspace name cannot exceed ${WORKSPACE_CONSTANTS.NAME_MAX_LENGTH} characters`,
      ],
    },
    slug: {
      type: String,
      required: [true, "Workspace URL slug is strictly required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        WORKSPACE_CONSTANTS.SLUG_REGEX,
        "Slug must contain strictly lowercase characters, numbers, and hyphens",
      ],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        WORKSPACE_CONSTANTS.DESCRIPTION_MAX_LENGTH,
        `Description cannot exceed ${WORKSPACE_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
      ],
      default: "",
    },
    logoUrl: {
      type: String,
      default: WORKSPACE_CONSTANTS.DEFAULT_LOGO_URL,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Workspace must have a recognized User owner"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(WORKSPACE_STATUS),
      default: WORKSPACE_STATUS.ACTIVE,
      index: true,
    },
    settings: {
      allowMemberInvites: { type: Boolean, default: true },
      defaultInviteRole: {
        type: String,
        enum: Object.values(WORKSPACE_ROLES),
        default: WORKSPACE_ROLES.MEMBER,
      },
      requireAdminApproval: { type: Boolean, default: false },
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Auto-manages createdAt & updatedAt metrics
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.isDeleted;
        delete ret.deletedAt;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.isDeleted;
        delete ret.deletedAt;
        return ret;
      },
    },
  },
);

// Optimize tenant lookup efficiency by combining ownership and active status indexes
workspaceSchema.index({ owner: 1, isDeleted: 1 });

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
