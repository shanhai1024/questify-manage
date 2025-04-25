
<template>
  <el-config-provider :theme-vars="themeVars">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
const app = useAppStore()
const themeVars = computed(()=>({ colorPrimary: app.primary }))
</script>
