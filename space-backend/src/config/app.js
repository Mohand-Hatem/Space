import env from "./env.js";

export default {
  name: env.APP_NAME,
  env: env.NODE_ENV,
  port: env.PORT,
};
