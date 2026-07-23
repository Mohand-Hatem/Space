import HttpStatus from "../../constants/httpStatus.js";

class ApiResponse {
  static success(
    res,
    data = null,
    message = "Success",
    meta = null,
    statusCode = HttpStatus.OK,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static created(res, data = null, message = "Created Successfully") {
    return this.success(res, data, message, null, HttpStatus.CREATED);
  }

  static updated(res, data = null, message = "Updated Successfully") {
    return this.success(res, data, message);
  }

  static deleted(res, message = "Deleted Successfully") {
    return this.success(res, null, message);
  }

  static paginated(res, data, meta, message = "Data fetched successfully") {
    return this.success(res, data, message, meta);
  }

  static error(
    res,
    {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
      message = "Internal Server Error",
      code = "INTERNAL_SERVER_ERROR",
      details = [],
    },
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        code,
        details,
      },
    });
  }
}

export default ApiResponse;
