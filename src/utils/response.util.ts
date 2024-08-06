import { HttpException, HttpStatus } from "@nestjs/common";

export const response = (
  status: 'success' | 'error' | string,
  title: string,
  message: string,
  code?: number,
  data?: any,
  meta?: any,
) => {
  return {
    status,
    title,
    message,
    // code,
    data,
    meta,
  };
};

export const success = (data: any, title?: string, message?: string, meta?: any) => {
  return response('success', title, message, HttpStatus.OK, data, meta);
};

export const error = (title: string, message: string, code = HttpStatus.BAD_REQUEST) => {
  const res = response('error', title, message, code, null);
  throw new HttpException(res, code);
};
