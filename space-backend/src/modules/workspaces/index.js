import workspaceRoutes from "./workspace.routes.js";
import workspaceService from "./workspace.service.js";
import workspaceRepository from "./workspace.repository.js";
import Workspace from "./workspace.model.js";
import WorkspaceMember from "./workspace-member.model.js";
import { WORKSPACE_ROLES, WORKSPACE_STATUS } from "./workspace.constants.js";

export {
  workspaceRoutes,
  workspaceService,
  workspaceRepository,
  Workspace,
  WorkspaceMember,
  WORKSPACE_ROLES,
  WORKSPACE_STATUS,
};

export default {
  routes: workspaceRoutes,
  service: workspaceService,
  repository: workspaceRepository,
  models: { Workspace, WorkspaceMember },
  constants: { WORKSPACE_ROLES, WORKSPACE_STATUS },
};
