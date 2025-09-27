export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ['paulpc-1'],
    },
  },
  bullwark: {
    devMode: true,
    customerUuid: '0199881b-ca74-72bf-8169-d40a944c7946',
    tenantUuid: '0199881b-cb46-71e1-a33e-63793e82f0db',
  },
})
