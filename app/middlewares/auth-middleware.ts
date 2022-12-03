import ApiError from "../services/error";
import Token from "../services/token";

const AuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader, "authHeader");
    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authHeader.split(" ")[1];
    console.log(accessToken, "accessToken");
    if (!accessToken || accessToken === "null") {
      console.log("this");
      return next(ApiError.UnauthorizedError());
    }
    console.log(accessToken);
    const userData = Token.validateAccessToken(accessToken);
    console.log(userData, "userData");
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};

export default AuthMiddleware;
