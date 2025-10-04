import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir, addPlugin } from '@nuxt/kit'

export interface BullwarkOptions {
  devMode: boolean
  apiUrl: string
  jwkUrl: string
  customerUuid: string
  tenantUuid: string
  useCookie: boolean
  autoRefresh: boolean
  autoRefreshBuffer: number
}

export default defineNuxtModule<BullwarkOptions>({
  meta: {
    name: 'theuxdev/Bullwark Nuxt',
    configKey: 'bullwark',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    devMode: false,
    apiUrl: 'https://api.bullwark.io/api/auth/v1',
    jwkUrl: 'https://api.bullwark.io/.well-known/jwks',
    customerUuid: '',
    tenantUuid: '',
    useCookie: true,
    autoRefresh: true,
    autoRefreshBuffer: 120,
  },

  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)
    nuxt.options.runtimeConfig.public.bullwark = moduleOptions

    nuxt.hooks.hook('vite:extendConfig', (config) => {
      config.ssr = config.ssr || {}
      config.ssr.noExternal = [
        ...(Array.isArray(config.ssr.noExternal) ? config.ssr.noExternal : []),
        'local-storage-fallback',
      ]
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = [
        ...(config.optimizeDeps.include || []),
        'local-storage-fallback',
      ]
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
    })
    addPlugin({
      src: resolver.resolve('./runtime/plugins/bullwark.client'),
      mode: 'client',
    })
  },
})
