export type AppErrorOptions = {
  message: string
  suggestRetry: boolean
  suggestGoBack: boolean
  suggestGoHome: boolean
  description: string | null
}

export abstract class AppError extends Error {
  constructor(public options: AppErrorOptions) {
    super(options.message)
  }
}
