<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Bullwark Nuxt
- Package name: my-module
- Description: Bullwark Nuxt is a Nuxt module to quickly and easily connect your Nuxt install to Bullwark for authn and authz. 
-->

# Bullwark Nuxt

Nuxt module built for Bullwark. 

## Features

<!-- Highlight some of the features your module provide here -->
- 🔐 JWT signature validation included (through public JWTs) 
- 🔃 Auto refresh option includes when token is almost expired

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add bullwark-nuxt
```

That's it! You can now use Bullwark in your Nuxt app ✨


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>
