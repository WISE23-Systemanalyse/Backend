
import { ApiError } from "../interfaces/apiError.ts";

export class ShowNotFound extends ApiError {
  constructor() {
    super(404, "Show not Found" );
  }
}


export class ShowNotAvailable extends ApiError {
  constructor() {
    super(404, "Show not Available" );
  }
}
