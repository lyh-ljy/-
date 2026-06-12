<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header"><el-icon :size="48" color="#409eff"><DataBoard /></el-icon><h2>CRM 客户关系管理系统</h2><p>Customer Relationship Management</p></div>
      <el-form ref="formRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="username"><el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" /></el-form-item>
        <el-form-item prop="password"><el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password @keyup.enter="handleLogin" /></el-form-item>
        <el-form-item><el-button type="primary" style="width:100%" :loading="loading" @click="handleLogin">登 录</el-button></el-form-item>
        <div class="login-tips"><span>演示账号: admin / admin123</span></div>
      </el-form>
    </div>
    <div class="login-footer">CRM System © 2026</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'; import { useRouter } from 'vue-router'; import { useUserStore } from '@/stores/user'; import { ElMessage } from 'element-plus'; import { initMockData } from '@/api'
const router = useRouter(); const userStore = useUserStore(); const loading = ref(false); const formRef = ref(null)
const form = reactive({ username: 'admin', password: 'admin123' })
const rules = { username: [{ required: true, message: '请输入用户名', trigger: 'blur' }], password: [{ required: true, message: '请输入密码', trigger: 'blur' }] }
async function handleLogin() { const v = await formRef.value.validate().catch(() => false); if (!v) return; loading.value = true; try { initMockData(); await userStore.login(form.username, form.password); ElMessage.success('登录成功'); router.push('/dashboard') } catch (e) { ElMessage.error(e.message || '登录失败') } finally { loading.value = false } }
</script>

<style scoped>
.login-page{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
.login-card{width:420px;background:#fff;border-radius:12px;padding:48px 40px 32px;box-shadow:0 20px 60px rgba(0,0,0,0.15)}
.login-header{text-align:center;margin-bottom:36px}.login-header h2{margin:16px 0 8px;font-size:22px;color:#303133}.login-header p{color:#909399;font-size:13px}
.login-tips{text-align:center;color:#909399;font-size:12px}.login-footer{margin-top:40px;color:rgba(255,255,255,0.7);font-size:13px}
</style>
