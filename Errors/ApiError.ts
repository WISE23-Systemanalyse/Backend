
import { ApiError as ApiErrorInterface } from "../interfaces/apiError.ts";

export class ApiError extends Error implements ApiErrorInterface {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}