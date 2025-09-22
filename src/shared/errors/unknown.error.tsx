import { AppError } from './app-error'

type UnknownErrorOptions = {
  message?: string
  description?: string
  suggestRetry?: false
  suggestGoBack?: false
  suggestGoHome?: false
}

export class UnknownError extends AppError {
  constructor(options?: UnknownErrorOptions) {
    super({
      description: options?.description ?? null,
      message: options?.message ?? 'Unknown error',
      suggestGoBack: options?.suggestGoBack ?? false,
      suggestGoHome: options?.suggestGoHome ?? false,
      suggestRetry: options?.suggestRetry ?? false,
    })
  }
}
