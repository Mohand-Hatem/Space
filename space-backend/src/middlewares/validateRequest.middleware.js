const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // 1. Reassign body if validated
      if (parsed.body) {
        req.body = parsed.body;
      }

      // 2. Safely merge params without breaking prototypes
      if (parsed.params && Object.keys(parsed.params).length > 0) {
        Object.assign(req.params, parsed.params);
      }

      // 3. Safely override query getters using Object.defineProperty
      if (parsed.query && Object.keys(parsed.query).length > 0) {
        Object.defineProperty(req, "query", {
          value: parsed.query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export default validateRequest;
