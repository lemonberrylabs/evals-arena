'use server'

import { providers } from './models'

export async function isConfigured(): Promise<boolean> {
  return providers.isConfigured()
}
