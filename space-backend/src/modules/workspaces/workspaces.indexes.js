import Workspace from "./workspace.model.js";
import WorkspaceMember from "./workspace-member.model.js";
import logger from "../../shared/logger/logger.js";

export const syncWorkspaceIndexes = async () => {
  try {
    await Workspace.syncIndexes();
    await WorkspaceMember.syncIndexes();
    logger.info(
      "MongoDB Indexes synchronized for Workspaces Domain successfully",
    );
  } catch (error) {
    logger.error(
      "Failed to synchronize MongoDB Indexes for Workspaces Domain",
      { error: error.message },
    );
  }
};

export default { syncWorkspaceIndexes };
