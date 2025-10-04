<template>
  <div>
    <p>Nuxt module playground!</p>
    <button @click="handleLogin()">
      Login Test
    </button>
    {{ user }}
  </div>
</template>

<script setup lang="ts">
import { useBullwark } from '../src/runtime/composables/useBullwark'

const { user, login } = useBullwark()
const handleLogin = async () => {
  await login('paul@test.nl', 'test')
}
</script>
