import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const handleExceptions = (error: any) => {
  if (error instanceof HttpException)
    throw new RpcException({ message: error.message, status: error.getStatus() });
  if (error.code === '23505')
    throw new RpcException({
      message: error.detail,
      status: HttpStatus.BAD_REQUEST,
    });
  throw new RpcException({
    message: `Sometime went wrong: ${error}`,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  });
};
