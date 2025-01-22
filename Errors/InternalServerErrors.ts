import { ApiError } from "../interfaces/apiError.ts";

export class InternalServerError extends ApiError {
  constructor() {
    super(500, 'Internal Server Error');
  }
}