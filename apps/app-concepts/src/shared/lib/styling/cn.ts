import { cx } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

export const cn: typeof cx = (...inputs) => twMerge(cx(inputs))
