import { ApiError } from "../interfaces/apiError.ts";

export class UserNotFound extends ApiError {
  constructor() {
    super(404, "User not Found" );
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}


export class InvalidPassword extends ApiError {
  constructor() {
    super(400, "Invalid Password");
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class InvalidVerificationCode extends ApiError {
  constructor() {
    super(400, "Invalid Verification Code");
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class UserAllreadyExists extends ApiError {
  constructor() {
    super(400, "User Allready Exists");
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class UserNotVerified extends ApiError {
  constructor() {
    super(400, "User Not Verified");
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}