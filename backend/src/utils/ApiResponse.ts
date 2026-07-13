import { Response } from 'express';

interface ApiResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode = 200,
    pagination?: ApiResponseData<T>['pagination']
  ): Response {
    const response: ApiResponseData<T> = {
      success: true,
      message,
    };

    if (data !== undefined) response.data = data;
    if (pagination) response.pagination = pagination;

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: unknown
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static paginate<T>(
    res: Response,
    message: string,
    data: T[],
    page: number,
    limit: number,
    totalItems: number
  ): Response {
    const totalPages = Math.ceil(totalItems / limit);
    return ApiResponse.success(res, message, data, 200, {
      page,
      limit,
      totalPages,
      totalItems,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  }
}
