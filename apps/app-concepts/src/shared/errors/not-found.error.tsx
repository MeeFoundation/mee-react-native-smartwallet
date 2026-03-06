import { AppError } from './app-error'

type NotFoundErrorOptions = {
  message?: string
  description?: string
}

export class NotFoundError extends AppError {
  constructor(options?: NotFoundErrorOptions) {
    super({
      description: options?.description ?? null,
      message: options?.message ?? 'Not found',
      suggestGoBack: false,
      suggestGoHome: false,
      suggestRetry: false,
    })
  }
}
