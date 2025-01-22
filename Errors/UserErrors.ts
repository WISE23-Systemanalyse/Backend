import { ApiError } from "../interfaces/apiError.ts";

export class UserNotFound extends ApiError {
  constructor() {
    super(404, "User not Found" );
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}