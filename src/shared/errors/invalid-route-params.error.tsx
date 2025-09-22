import { AppError } from './app-error'

export type InvalidRouteParamsErrorParams = {
  message?: string
  description?: string
}

export class InvalidRouteParamsError extends AppError {
  constructor(options?: InvalidRouteParamsErrorParams) {
    super({
      description: options?.description ?? null,
      message: options?.message ?? 'Not found',
      suggestGoBack: true,
      suggestGoHome: true,
      suggestRetry: false,
    })
  }
}
