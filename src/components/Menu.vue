<template>
  <el-menu
      :default-active="$route.path"
      class="sidebar-menu"
      :collapse="app.sidebarCollapse"
      router
      @open="handleOpen"
      @close="handleClose"
  >
    <template v-for="item in menuData" :key="item.route">
      <el-sub-menu
          v-if="item.children"
          :index="item.route"
      >
        <template #title>
          <!-- 直接渲染 SVG 组件 -->
          <component :is="item.icon" class="sidebar-svg-icon" />
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item
            v-for="child in item.children"
            :key="child.route"
            :index="child.route"
        >
          <component :is="child.icon" class="sidebar-svg-icon" />
          <template #title>{{ child.label }}</template>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item v-else :index="item.route">
        <component :is="item.icon" class="sidebar-svg-icon" />
        <template #title>{{ item.label }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { Component } from 'vue'
import {
  Document,
  UserFilled,
  Setting,
  CircleCheck,
  Check,
  ChatLineSquare
} from '@element-plus/icons-vue'
// 直接导入 SVG 组件，不要带 ?component
import HomeSvg from '@/assets/icons/Home.svg'
import SystemManger from '@/assets/icons/SystemManger.svg'
import UserManger from '@/assets/icons/UserManger.svg'
import RoleManger from '@/assets/icons/RoleManger.svg'
import Permissions from '@/assets/icons/Permissions.svg'
import subject from '@/assets/icons/subject.svg'
import singleChoiceQuestion from '@/assets/icons/singleChoiceQuestion.svg'
import multipleChoiceQuestions from '@/assets/icons/multipleChoiceQuestions.svg'
import judgmentQuestion from '@/assets/icons/judgmentQuestion.svg'
import shortAnswerQuestions from '@/assets/icons/shortAnswerQuestions.svg'

const app = useAppStore()
const router = useRouter()

const handleOpen = (key: string) => console.log('open', key)
const handleClose = (key: string) => console.log('close', key)

interface MenuItem {
  label: string
  icon: Component
  route: string
  children?: MenuItem[]
}

const menuData: MenuItem[] = [
  { label: '主页',       icon: HomeSvg,      route: '/' },
  {
    label: '系统管理',   icon: SystemManger,     route: 'sys',
    children: [
      { label: '用户管理', icon: UserManger,    route: '/sys/user' },
      { label: '角色管理', icon: RoleManger,       route: '/sys/role' },
      { label: '权限管理', icon: Permissions,route: '/sys/perm' }
    ]
  },
  {
    label: '题目管理',   icon: subject,     route: 'quiz',
    children: [
      { label: '单选题',   icon: singleChoiceQuestion,  route: '/quiz/single' },
      { label: '多选题',   icon: multipleChoiceQuestions,        route: '/quiz/multiple' },
      { label: '判断题',   icon: judgmentQuestion,  route: '/quiz/judge' },
      { label: '解答题',   icon: shortAnswerQuestions,     route: '/quiz/essay' }
    ]
  },
  { label: '系统设置',   icon: Setting,      route: '/setting' }
]
</script>

<style scoped>
.sidebar-menu {
  width: 200px;
}

/* 图标尺寸 */
.sidebar-svg-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  fill: currentColor;
}



/* 当前激活 */
.sidebar-menu .el-menu-item.is-active,
.sidebar-menu .el-sub-menu.is-active > .el-sub-menu__title {
  /* 文字高亮：primary 色 */
  color: var(--el-color-primary) !important;
}
</style>

