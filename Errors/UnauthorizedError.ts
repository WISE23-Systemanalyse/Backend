
import { ApiError } from "../interfaces/apiError.ts";

export default class UnauthorizedError extends ApiError {
  constructor() {
    super(401, 'Unauthorized access');
  }
}