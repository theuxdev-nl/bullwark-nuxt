import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir, addPlugin } from '@nuxt/kit'

export interface BullwarkOptions {
  devMode: boolean
  apiUrl: string
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
    apiUrl: 'http://paulpc-1',
    customerUuid: '',
    tenantUuid: '',
    useCookie: true,
    autoRefresh: true,
    autoRefreshBuffer: 120,
  },
  hooks: {},

  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)
    nuxt.options.runtimeConfig.public.bullwark = moduleOptions
    addImportsDir(resolver.resolve('./runtime/composables'))
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
    })
    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'client',
    })
  },
})
