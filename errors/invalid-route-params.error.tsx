import { AppError } from "./app-error"

export type InvalidRouteParamsErrorParams = {
  message?: string
  description?: string
}

export class InvalidRouteParamsError extends AppError {
  constructor(options?: InvalidRouteParamsErrorParams) {
    super({
      message: options?.message ?? "Not found",
      description: options?.description ?? null,
      suggestRetry: false,
      suggestGoBack: true,
      suggestGoHome: true,
    })
  }
}
