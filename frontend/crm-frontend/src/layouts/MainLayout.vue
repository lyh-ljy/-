<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo" @click="$router.push('/dashboard')">
        <el-icon :size="24"><DataBoard /></el-icon>
        <span v-show="!isCollapse" class="logo-text">CRM 系统</span>
      </div>
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :collapse-transition="false" router background-color="#001529" text-color="#ffffffa6" active-text-color="#fff">
        <el-menu-item index="/dashboard"><el-icon><DataBoard /></el-icon><span>仪表盘</span></el-menu-item>
        <el-sub-menu index="customer-group"><template #title><el-icon><UserFilled /></el-icon><span>客户管理</span></template><el-menu-item index="/customer">客户列表</el-menu-item></el-sub-menu>
        <el-sub-menu index="business-group"><template #title><el-icon><Document /></el-icon><span>业务管理</span></template><el-menu-item index="/business">业务列表</el-menu-item></el-sub-menu>
        <el-sub-menu index="workorder-group"><template #title><el-icon><Tickets /></el-icon><span>工单管理</span></template><el-menu-item index="/workorder">工单列表</el-menu-item></el-sub-menu>
        <el-sub-menu index="user-group"><template #title><el-icon><Avatar /></el-icon><span>人员管理</span></template><el-menu-item index="/user">人员列表</el-menu-item></el-sub-menu>
        <el-sub-menu index="system-group"><template #title><el-icon><Setting /></el-icon><span>系统管理</span></template><el-menu-item index="/system/region">区域管理</el-menu-item><el-menu-item index="/system/dept">部门管理</el-menu-item></el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse" :size="20"><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
          <el-breadcrumb separator="/"><el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item><el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item></el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-info"><el-avatar :size="32" :icon="UserFilled" /><span class="user-name">{{ userStore.userName || '管理员' }}</span><el-icon><ArrowDown /></el-icon></div>
            <template #dropdown><el-dropdown-menu><el-dropdown-item><el-icon><User /></el-icon> 个人信息</el-dropdown-item><el-dropdown-item divided @click="handleLogout"><el-icon><SwitchButton /></el-icon> 退出登录</el-dropdown-item></el-dropdown-menu></template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content"><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserFilled } from '@element-plus/icons-vue'
const route = useRoute(); const router = useRouter(); const userStore = useUserStore()
const isCollapse = ref(false); const activeMenu = computed(() => route.path); const currentTitle = computed(() => route.meta?.title || '')
function handleLogout() { userStore.logout(); router.push('/login') }
</script>

<style scoped>
.layout-container{height:100vh}.sidebar{background:#001529;overflow:hidden}
.logo{height:60px;display:flex;align-items:center;justify-content:center;gap:10px;color:#fff;font-size:18px;font-weight:bold;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.1)}
.logo-text{white-space:nowrap}
.header{background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 20px;box-shadow:0 1px 4px rgba(0,0,0,0.08);z-index:10;height:60px}
.header-left{display:flex;align-items:center;gap:16px}.collapse-btn{cursor:pointer;color:#666}.collapse-btn:hover{color:#409eff}
.header-right{display:flex;align-items:center}.user-info{display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 8px;border-radius:4px;transition:background 0.2s}
.user-info:hover{background:#f5f7fa}.user-name{font-size:14px;color:#333}.main-content{background:#f0f2f5;min-height:calc(100vh - 60px)}
</style>
