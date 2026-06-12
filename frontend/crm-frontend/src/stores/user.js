import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, getCurrentUser, logoutApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(getCurrentUser())
  const token = ref(localStorage.getItem('crm_token') || '')
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.real_name || '')
  async function login(username, password) {
    const res = await loginApi(username, password)
    const info = res.userInfo || res.user_info
    token.value = res.token; userInfo.value = info
    localStorage.setItem('crm_token', res.token)
    if (info) localStorage.setItem('crm_current_user', JSON.stringify(info))
    return res
  }
  function logout() {
    logoutApi(); token.value = ''; userInfo.value = null
    localStorage.removeItem('crm_token')
  }
  return { userInfo, token, isLoggedIn, userName, login, logout }
})
