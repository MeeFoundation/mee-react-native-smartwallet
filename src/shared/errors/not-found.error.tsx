import { AppError } from "./app-error"

type NotFoundErrorOptions = {
  message?: string
  description?: string
}

export class NotFoundError extends AppError {
  constructor(options?: NotFoundErrorOptions) {
    super({
      message: options?.message ?? "Not found",
      description: options?.description ?? null,
      suggestRetry: false,
      suggestGoBack: false,
      suggestGoHome: false,
    })
  }
}
