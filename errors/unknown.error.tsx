import { AppError } from "./app-error"

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
      message: options?.message ?? "Unknown error",
      description: options?.description ?? null,
      suggestRetry: options?.suggestRetry ?? false,
      suggestGoBack: options?.suggestGoBack ?? false,
      suggestGoHome: options?.suggestGoHome ?? false,
    })
  }
}
