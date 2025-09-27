// modules/idaas/runtime/plugin.ts
import { defineNuxtPlugin } from '#imports'
import { useRuntimeConfig } from '#app'
import { BullwarkSdk } from '@dutchbull95/bullwark-sdk'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const bullwarkConfig = config.public.bullwark
  const bullwarkSdk = new BullwarkSdk({
    devMode: bullwarkConfig.devMode,
    apiUrl: bullwarkConfig.apiUrl,
    customerUuid: bullwarkConfig.customerUuid,
    tenantUuid: bullwarkConfig.tenantUuid,
    useCookie: bullwarkConfig.useCookie,
    autoRefresh: bullwarkConfig.autoRefresh,
    autoRefreshBuffer: bullwarkConfig.autoRefreshBuffer,
  })

  return {
    provide: {
      bullwark: bullwarkSdk,
    },
  }
})
