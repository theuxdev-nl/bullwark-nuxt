<template>
  <template v-if="shouldShow && !loading && user">
    <slot />
  </template>
</template>

<script lang="ts" setup>
import { useBullwark } from '#imports'
import { computed } from 'vue'

interface Props {
  abilityUuids?: undefined | string | string[]
  abilityKeys?: undefined | string | string[]
  roleUuids?: undefined | string | string[]
  roleKeys?: undefined | string | string[]
  mode?: 'ALL' | 'SOME'
}

const { userCan, userCanKey, userHasRole, userHasRoleKey, loading, user } = useBullwark()

const props = withDefaults(defineProps<Props>(), {
  abilityUuids: undefined,
  abilityKeys: undefined,
  roleUuids: undefined,
  roleKeys: undefined,
  mode: 'ALL',
})
const shouldShow = computed(() => {
  const checks = [
    ...(props.abilityUuids ? [].concat(props.abilityUuids).map(id => userCan(id)) : []),
    ...(props.abilityKeys ? [].concat(props.abilityKeys).map(key => userCanKey(key)) : []),
    ...(props.roleUuids ? [].concat(props.roleUuids).map(id => userHasRole(id)) : []),
    ...(props.roleKeys ? [].concat(props.roleKeys).map(key => userHasRoleKey(key)) : []),
  ]

  return props.mode === 'SOME' ? checks.some(Boolean) : checks.every(Boolean)
})
</script>
