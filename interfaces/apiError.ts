

export class ApiError extends Error implements Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}