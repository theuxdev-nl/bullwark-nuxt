import { useNuxtApp, useState } from '#app'
import type { BullwarkSdk, UserData } from '@theuxdev/bullwark-npm-sdk'
import { watch } from '@vue/reactivity'
import { computed } from 'vue'

export const useBullwark = () => {
  const { $bullwark } = useNuxtApp()
  const bullwark = $bullwark as BullwarkSdk

  // Variables ================================================================================

  const initialized = useState<boolean>('bullwark.initialized', () => false)
  const userData = useState<UserData | null | undefined>('bullwark.userData', () => undefined)
  const authenticated = useState<boolean>('bullwark.authenticated', () => false)
  const loading = useState<boolean>('bullwark.loading', () => false)

  const userUuid = computed(() => userData.value?.user?.uuid)
  const tenantUuid = computed(() => userData.value?.user?.tenantUuid)
  const customerUuid = computed(() => userData.value?.user?.customerUuid)

  // Listeners ================================================================================

  if (import.meta.client) {
    bullwark.on('userHydrated', (data: { user: UserData }) => {
      userData.value = data.user
      authenticated.value = true
    })
    bullwark.on('userLoggedIn', (data: { user: UserData }) => {
      userData.value = data.user
      authenticated.value = true
    })
    bullwark.on('userRefreshed', (data: { user: UserData }) => {
      userData.value = data.user
    })
    bullwark.on('userLoggedOut', () => {
      userData.value = null
      authenticated.value = false
    })
    bullwark.on('bullwarkLoaded', () => {
      initialized.value = true
    })

    if (bullwark.getAuthenticated()) {
      userData.value = bullwark.getUser()
      authenticated.value = true
    }
  }

  // Actions ================================================================================

  const waitForInitialization = (): Promise<void> => {
    return new Promise((resolve) => {
      if (initialized.value) {
        resolve()
        return
      }

      const unwatch = watch(initialized, (newValue) => {
        if (newValue) {
          unwatch()
          resolve()
        }
      })
    })
  }

  const login = async (email: string, password: string) => {
    if (import.meta.client) {
      loading.value = true
      try {
        const data = await bullwark.login(email, password)
        syncFromSDK()
        return data
      }
      finally {
        loading.value = false
      }
    }
  }

  const logout = async () => {
    if (import.meta.client) {
      try {
        await bullwark.logout()
        syncFromSDK()
      }
      catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    }
  }

  const userCan = (abilityUuid: string) => {
    if (!abilityUuid) {
      console.error('AbilityUuid missing')
      return false
    }
    if (import.meta.server) return false
    return bullwark.userCan(abilityUuid)
  }

  const userCanKey = (abilityKey: string) => {
    if (!abilityKey) {
      console.error('AbilityKey missing')
      return false
    }
    if (import.meta.server) return false
    return bullwark.userCanKey(abilityKey)
  }

  const userHasRole = (roleUuid: string) => {
    if (!roleUuid) {
      console.error('RoleUuid missing')
      return false
    }
    if (import.meta.server) return false // No role check on server
    return bullwark.userHasRole(roleUuid)
  }

  const userHasRoleKey = (roleKey: string) => {
    if (!roleKey) {
      console.error('RoleKey missing')
      return false
    }
    if (import.meta.server) return false // No role check on server
    return bullwark.userHasRoleKey(roleKey)
  }

  // Returns ================================================================================

  return {
    bullwark,
    initialized,
    userData,
    authenticated,
    userUuid,
    tenantUuid,
    customerUuid,

    waitForInitialization,
    login,
    logout,
    userCan,
    userCanKey,
    userHasRole,
    userHasRoleKey,
  }
}
