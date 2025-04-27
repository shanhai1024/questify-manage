<template>
  <div class="navbar">
    <div class="nav-left">
      <el-tooltip
          :content="app.sidebarCollapse ? '展开菜单' : '折叠菜单'"
          placement="bottom"
      >
        <el-button circle class="icon-btn" @click="toggleCollapse">
          <el-icon>
            <component :is="app.sidebarCollapse ? Expand : Fold" />
          </el-icon>
        </el-button>
      </el-tooltip>

      <Breadcrumb class="bread" />
    </div>

    <div class="nav-right">
      <el-tooltip :content="isDark ? '切换亮色' : '切换暗色'" placement="bottom">
        <el-button circle class="icon-btn" @click="toggleDark">
          <el-icon>
            <component :is="isDark ? Sunny : Moon" />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="主题设置" placement="bottom">
        <el-button circle class="icon-btn" @click="drawer = true">
          <el-icon><Setting /></el-icon>
        </el-button>
      </el-tooltip>
      <ThemeDrawer v-model="drawer" />

      <el-dropdown @command="handleUserCommand" placement="bottom-end">
        <span class="user-trigger">
          <el-icon><User /></el-icon>
          <span class="user-name">{{ userName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="user-menu">
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon> 个人中心
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><ArrowLeft /></el-icon> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'
import { useAppStore } from '@/stores/app'
import Breadcrumb from './Breadcrumb.vue'
import ThemeDrawer from './ThemeDrawer.vue'
import { rippleTheme } from '@/utils/theme'

import {
  Fold,
  Expand,
  Moon,
  Sunny,
  Setting,
  User,
  ArrowDown,
  ArrowLeft
} from '@element-plus/icons-vue'

const app = useAppStore()
const router = useRouter()

const toggleCollapse = () => (app.sidebarCollapse = !app.sidebarCollapse)

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  storageKey: 'theme'
})
function toggleDark(e: MouseEvent) {
  rippleTheme(e.currentTarget as HTMLElement, !isDark.value)
  isDark.value = !isDark.value
}

const drawer = ref(false)
const userName = ref('Super')
function handleUserCommand(command: string) {
  if (command === 'profile') router.push('/profile')
  else if (command === 'logout') {
    localStorage.removeItem('token')
    router.push('/login')
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  /* 纯色背景，无阴影无边框 */
  background: var(--el-bg-color);
}

html.dark .navbar {
  background: var(--el-bg-color);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
}

.nav-left {
  gap: 12px;
}

.bread {
  margin-left: 8px;
  /* 高亮当前面包屑 */
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: var(--el-text-color);
  font-weight: 500;
}

.nav-right {
  margin-left: auto;
  gap: 12px;
}

/* 圆形按钮 */
.icon-btn {
  width: 32px;
  height: 32px;
  color: var(--el-color-primary);
}

/* hover 只改变背景 */
.icon-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

/* 用户触发 */
.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 20px;
  color: var(--el-color-primary);
}

/* hover */
.user-trigger:hover {
  background-color: var(--el-color-primary-light-9);
}

/* 下拉菜单图标间距 */
.user-menu .el-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
