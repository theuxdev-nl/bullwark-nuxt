<template>
  <div>
    <p>Nuxt module playground!</p>
    {{user}}
    {{isLoggedIn}}

  </div>
</template>

<script setup lang="ts">
const {user, isLoggedIn} = useBullwark();

</script>
