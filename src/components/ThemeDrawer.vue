
<template>
  <el-drawer v-model="visible" title="主题配置" size="280px" direction="rtl">
    <h4 class="mb8">暗/亮模式</h4>
    <el-switch v-model="isDark" :active-icon="Moon" :inactive-icon="Sunny"
               :active-text="'暗色'" :inactive-text="'亮色'" @change="toggleDark"/>
    <h4 class="mb8">主题色</h4>
    <el-color-picker v-model="app.primary" @change="app.setPrimary"/>
    <el-divider/>
    <el-button @click="reset">恢复默认</el-button>
  </el-drawer>
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import { useAppStore } from '@/stores/app'
const visible = defineModel<boolean>('modelValue')
const isDark = useDark({ selector:'html', attribute:'class', valueDark:'dark', valueLight:'', storageKey:'theme' })
const toggleDark = useToggle(isDark)
const app = useAppStore()
function reset(){
  app.setPrimary('#646cff')
  if(isDark.value) toggleDark()
}
</script>

<style scoped>
.mb8{margin-bottom:8px;}
</style>
