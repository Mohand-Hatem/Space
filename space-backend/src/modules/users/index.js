import usersService from "./users.service.js";
import usersRepository from "./users.repository.js";
import * as userConstants from "./users.constants.js";

// Explicit named exports for internal module communication
export { usersService, usersRepository, userConstants };

// Unified module namespace export
export default {
  service: usersService,
  repository: usersRepository,
  constants: userConstants,
};
