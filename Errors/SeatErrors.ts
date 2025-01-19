import { ApiError } from "../interfaces/apiError.ts";

export class SeatNotAvailable extends ApiError {
  constructor() {
    super(400, 'Seat is not available');
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class SeatNotFound extends ApiError {
  constructor() {
    super(404, "Seat not Found" );
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}