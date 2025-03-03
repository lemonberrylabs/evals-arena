'use server'

import { env } from './env'

export async function isConfigured(): Promise<boolean> {
  return env.isConfigured
}
