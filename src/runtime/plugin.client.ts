// modules/idaas/runtime/plugin.ts
import { defineNuxtPlugin } from '#imports'
import { BullwarkSdk } from '@theuxdev/bullwark-npm-sdk'
import { useRuntimeConfig } from '#app'

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

  // // Set up global event listeners at the plugin level
  // bullwarkSdk.on('userLoggedIn', (data) => {
  //   console.log('🔐 Bullwark userLoggedIn event', data);
  // });
  //
  // bullwarkSdk.on('userLoggedOut', () => {
  //   console.log('🔐 Bullwark userLoggedOut event');
  // });
  //
  // bullwarkSdk.on('userRefreshed', (data) => {
  //   console.log('🔐 Bullwark userRefreshed event:', data);
  // });
  //
  // bullwarkSdk.on('userHydrated', (data) => {
  //   console.log('🔐 Bullwark userHydrated event:', data);
  // });

  return {
    provide: {
      bullwark: bullwarkSdk,
    },
  }
})
