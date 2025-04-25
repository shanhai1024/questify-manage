<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, i) in breadcrumb" :key="i">
      <span v-if="i === breadcrumb.length - 1" class="current">
        {{ item.meta?.title || item.name }}
      </span>
      <router-link v-else :to="item.path">
        {{ item.meta?.title || item.name }}
      </router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
/* 过滤掉没有 meta.title 的路由，避免首页空白 */
const breadcrumb = computed(() =>
    route.matched.filter(r => r.meta && r.meta.title)
)
</script>

<style scoped>
.current {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
