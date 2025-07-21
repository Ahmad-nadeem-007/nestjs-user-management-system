import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const tryCatch = async <T>(
  passedFunction: () => Promise<T>,
  extra_info?: string,
): Promise<T> => {
  try {
    return await passedFunction();
  } catch (error) {
    if (error instanceof HttpException) throw error;
    console.log(extra_info ? extra_info : error);
    throw new InternalServerErrorException();
  }
};
