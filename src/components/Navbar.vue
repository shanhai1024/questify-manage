<template>
  <div class="navbar">
    <!-- 折叠 / 展开 -->
    <el-tooltip :content="app.sidebarCollapse ? '展开菜单' : '折叠菜单'" placement="bottom">
      <el-button link class="icon-btn" @click="toggleCollapse">
        <el-icon>
          <component :is="app.sidebarCollapse ? Expand : Fold" />
        </el-icon>
      </el-button>
    </el-tooltip>

    <!-- 面包屑 -->
    <Breadcrumb class="bread" />

    <div class="flex-1"></div>

    <!-- 暗 / 亮（圆形涟漪过渡） -->
    <el-button link class="icon-btn" @click="toggleDark">
      <el-icon>
        <component :is="isDark ? Sunny : Moon" />
      </el-icon>
    </el-button>

    <!-- 主题抽屉 -->
    <el-button link class="icon-btn" @click="drawer = true">
      <el-icon><Setting /></el-icon>
    </el-button>
    <ThemeDrawer v-model="drawer" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDark } from '@vueuse/core'
import { useAppStore } from '@/stores/app'
import Breadcrumb from './Breadcrumb.vue'
import ThemeDrawer from './ThemeDrawer.vue'
import { rippleTheme } from '@/utils/theme'

/* Icons */
import { Fold, Expand, Moon, Sunny, Setting } from '@element-plus/icons-vue'

/* 侧边折叠状态 */
const app = useAppStore()
const toggleCollapse = () => (app.sidebarCollapse = !app.sidebarCollapse)

/* 暗色状态（VueUse 持久化） */
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  storageKey: 'theme'
})

/* 圆形涟漪切换 */
function toggleDark (e: MouseEvent) {
  rippleTheme(e.currentTarget as HTMLElement, !isDark.value) // 动画
  isDark.value = !isDark.value                              // 状态
}

/* 主题抽屉 */
const drawer = ref(false)
</script>

<style scoped>
.navbar {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: var(--el-bg-color);
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}
.flex-1 {
  flex: 1;
}
.icon-btn {
  font-size: 18px;
  margin: 0 4px;
}
.bread {
  margin-left: 16px;
}
</style>
