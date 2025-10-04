export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ['paulpc-1'],
    },
  },
})
