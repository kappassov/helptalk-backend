class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static UnauthorizedError() {
    return new ApiError(401, "Not Authorized");
  }
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}

export default ApiError;
