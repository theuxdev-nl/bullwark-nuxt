import type { BullwarkSdk, User } from '@theuxdev/bullwark-npm-sdk'
import { watch } from '@vue/reactivity'
import { computed } from 'vue'
import { useNuxtApp, useState } from '#app'

export const useBullwark = () => {
  const nuxtApp = useNuxtApp()
  const bullwark = nuxtApp.$bullwark as BullwarkSdk

  // Variables ================================================================================

  const initialized = useState<boolean>('bullwark.initialized', () => bullwark.getIsInitialized())
  const user = useState<User | null>('bullwark.user', () => null)
  const authenticated = useState<boolean>('bullwark.authenticated', () => bullwark.getAuthenticated())
  const loading = useState<boolean>('bullwark.loading', () => false)
  const jwt = useState<string | null | undefined>('bullwark.jwt', () => undefined)

  const userUuid = computed(() => user.value?.uuid)
  const tenantUuid = computed(() => user.value?.tenantUuid)
  const customerUuid = computed(() => user.value?.customerUuid)

  // Listeners ================================================================================

  if (import.meta.client && bullwark) {
    bullwark.on('userHydrated', () => {
      user.value = bullwark.getUser()
      jwt.value = bullwark.getJwt()
      authenticated.value = true
    })

    bullwark.on('userLoggedIn', () => {
      user.value = bullwark.getUser()
      jwt.value = bullwark.getJwt()
      authenticated.value = true
    })

    bullwark.on('userRefreshed', () => {
      user.value = bullwark.getUser()
      jwt.value = bullwark.getJwt()
      authenticated.value = true
    })

    bullwark.on('userLoggedOut', () => {
      user.value = null
      jwt.value = undefined
      authenticated.value = false
    })

    bullwark.on('bullwarkLoaded', () => {
      initialized.value = true
    })

    if (bullwark.getAuthenticated()) {
      user.value = bullwark.getUser()
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
    if (import.meta.client && bullwark) {
      loading.value = true
      try {
        return await bullwark.login(email, password)
      }
      finally {
        loading.value = false
      }
    }
  }

  const logout = async () => {
    if (import.meta.client && bullwark) {
      try {
        await bullwark.logout()
      }
      catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    }
  }

  const setTenantUuid = (uid: string) => {
    if (bullwark) {
      bullwark.setTenantUuid(uid)
    }
  }

  const setCustomerUuid = (uid: string) => {
    if (bullwark) {
      bullwark.setCustomerUuid(uid)
    }
  }

  const userCan = (abilityKey: string) => {
    if (!abilityKey) {
      console.error('abilityKey missing')
      return false
    }
    const u = user.value
    if (!u) return false

    return u.abilities?.includes(abilityKey) ?? false
  }

  const userHasRole = (roleUuid: string) => {
    if (!roleUuid) {
      console.error('roleUuid missing')
      return false
    }
    const u = user.value
    if (!u) return false

    return u.roles?.includes(roleUuid) ?? false
  }

  const refresh = async () => {
    if (bullwark) await bullwark.refresh()
  }

  const getUser = () => user.value

  // Returns ================================================================================

  return {
    bullwark,
    initialized,
    user,
    authenticated,
    userUuid,
    tenantUuid,
    customerUuid,
    jwt,

    waitForInitialization,
    login,
    logout,
    refresh,
    setTenantUuid,
    setCustomerUuid,

    getUser,
    userCan,
    userHasRole,
  }
}
