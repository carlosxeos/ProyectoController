/* eslint-disable prettier/prettier */
export class ResponsePost<T> {
  status: number;
  error: string;
  sucess: boolean;
  data: T;
  constructor(status: number, error: string, success: boolean) {
    this.error = error;
    this.status = status;
    this.sucess = success;
  }
}
