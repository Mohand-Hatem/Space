import authRoutes from "./auth.routes.js";
import authService from "./auth.service.js";
import authController from "./auth.controller.js";
import authRepository from "./auth.repository.js";
import * as authConstants from "./auth.constants.js";
import * as authValidation from "./auth.validation.js";

export {
  authRoutes,
  authService,
  authController,
  authRepository,
  authConstants,
  authValidation,
};

export default {
  routes: authRoutes,
  service: authService,
  controller: authController,
  repository: authRepository,
  constants: authConstants,
  validation: authValidation,
};
