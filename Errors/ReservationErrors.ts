
import { ApiError } from "../interfaces/apiError.ts";

export class ReservationNotFound extends ApiError {
  constructor() {
    super(404, 'Reservation not found');
  }
}