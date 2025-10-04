import { useNuxtApp, useState } from '#app'
import type { BullwarkSdk, User } from '@theuxdev/bullwark-npm-sdk'
import { readonly, watch } from '@vue/reactivity'

export const useBullwark = () => {
  const { $bullwark } = useNuxtApp()

  const bullwark = $bullwark as BullwarkSdk

  if (import.meta.client) {
    bullwark.on('userHydrated', (data: User) => {
      user.value = data
    })
    bullwark.on('userLoggedIn', (data: User) => {
      user.value = data
    })
    bullwark.on('userRefreshed', (data: User) => {
      user.value = data
    })
    bullwark.on('userLoggedOut', () => {
      user.value = null
      isLoggedIn.value = false
    })
    bullwark.on('bullwarkLoaded', () => {
      isLoggedIn.value = true
      isInitialized.value = true
    })
  }

  const user = useState<User | null>('bullwark.user', () => {
    if (import.meta.client) {
      return bullwark.getUser() || null
    }
    return null
  })

  const isLoggedIn = useState<boolean>('bullwark.isLoggedIn', () => false)
  const loading = useState<boolean>('bullwark.loading', () => false)

  const isInitialized = useState<boolean>('bullwark.initialized', () => false)
  const waitForInitialization = (): Promise<void> => {
    return new Promise((resolve) => {
      if (isInitialized.value) {
        resolve()
        return
      }

      const unwatch = watch(isInitialized, (newValue) => {
        if (newValue) {
          unwatch()
          resolve()
        }
      })
    })
  }

  if (import.meta.client && !isInitialized.value) {
    const sdkUser = bullwark.getUser() || null
    if (sdkUser && !user.value) {
      user.value = sdkUser
    }
  }

  const syncFromSDK = () => {
    if (import.meta.client) {
      user.value = bullwark.getUser() || null
    }
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

  return {
    bullwark,
    login,
    logout,
    isLoggedIn: readonly(isLoggedIn),
    isInitialized: readonly(isInitialized),
    loading: readonly(loading),
    user: readonly(user),
    userCan,
    userCanKey,
    userHasRole,
    userHasRoleKey,
    syncFromSDK,
    waitForInitialization: waitForInitialization(),
  }
}
