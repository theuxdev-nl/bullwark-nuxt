import { useNuxtApp, useState } from '#app'
import type { BullwarkSdk, LoginCredentials, User } from '@theuxdev/bullwark-npm-sdk'
import { readonly } from '@vue/reactivity'

export const useBullwark = () => {
  const { $bullwark } = useNuxtApp()

  const bullwark = $bullwark as BullwarkSdk

  if (import.meta.client) {
    bullwark.on('userHydrated', data => user.value = data.user)
    bullwark.on('userLoggedIn', data => user.value = data.user)
    bullwark.on('userRefreshed', data => user.value = data.user)
    bullwark.on('userLoggedOut', () => user.value = null)
  }

  const user = useState<User | null>('bullwark.user', () => {
    if (import.meta.client) {
      return bullwark.state?.user || null
    }
    return null
  })

  const isLoggedIn = useState<boolean>('bullwark.isLoggedIn', () => false)
  const loading = useState<boolean>('bullwark.loading', () => false)

  const isInitialized = useState<boolean>('bullwark.initialized', () => false)

  if (import.meta.client && !isInitialized.value) {
    const sdkUser = bullwark.state?.user || null
    if (sdkUser && !user.value) {
      user.value = sdkUser
    }
    isInitialized.value = true
  }

  const syncFromSDK = () => {
    if (import.meta.client) {
      const sdkUser = bullwark.state?.user || null
      user.value = sdkUser
    }
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    try {
      const data = await bullwark.login(credentials)
      syncFromSDK()
      return data
    }
    finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await bullwark.logout()
      syncFromSDK()
    }
    catch (error) {
      console.error('Logout error:', error)
      throw error
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
    loading: readonly(loading),
    user: readonly(user),
    userCan,
    userCanKey,
    userHasRole,
    userHasRoleKey,
    syncFromSDK,
    isInitialized: readonly(isInitialized),
  }
}
