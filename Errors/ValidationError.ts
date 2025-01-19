
import { ApiError } from "../interfaces/apiError.ts";

export default class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}