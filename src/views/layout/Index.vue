<template>
  <el-container class="layout">
    <!-- 侧边栏宽度完全由 Pinia 状态控制 -->
    <el-aside :width="app.sidebarCollapse ? '60px' : '200px'" class="aside">

      <div class="logo">
        <img src="@/assets/svg/logo.svg" class="icon" />
        <!-- 折叠时文字渐隐 -->
        <transition name="fade">
          <span v-if="!app.sidebarCollapse" class="name">题灵 AI</span>
        </transition>
      </div>

      <Menu />
    </el-aside>

    <el-container>
      <el-header class="header">
        <!-- Navbar 会在内部切换 app.sidebarCollapse -->
        <Navbar />
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Menu from '@/components/Menu.vue'
import { useAppStore } from '@/stores/app'

/* 直接使用 Pinia 状态，不再自建 collapse 变量 */
const app = useAppStore()
</script>

<style scoped>
.layout {
  height: 100vh;
}

.aside {
  background: var(--el-backtop-bg-color);
  transition: width 0.25s cubic-bezier(.4, 0, .2, 1);
  display: flex;
  flex-direction: column;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 24px;
}

.name {
  margin-left: 8px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.header {
  padding: 0;
}
</style>
