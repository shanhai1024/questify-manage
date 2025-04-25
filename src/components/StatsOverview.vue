<template>
  <el-row :gutter="20" class="stats-overview">
    <el-col
        v-for="stat in stats"
        :key="stat.label"
        :xs="24"
        :sm="12"
        :lg="6"
    >
      <el-card shadow="hover" class="stat-card">
        <div class="icon-wrapper">
          <component :is="stat.icon" class="stat-icon" />
        </div>
        <div class="stat-value">{{ stat.animated }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'
import axios from 'axios'
import {
  Document as DocumentIcon,
  User as UserIcon,
  DataLine as VisitsIcon,
  Menu as CategoryIcon,
} from '@element-plus/icons-vue'

// 定义原始值
const questionCount    = ref(0)
const userCount        = ref(0)
const visitCount       = ref(0)
const categoryCount    = ref(0)

// 用 useTransition 做数字滚动动画
const stats = [
  { label: '题目总数',     raw: questionCount, icon: DocumentIcon },
  { label: '用户总数',     raw: userCount,     icon: UserIcon },
  { label: '今日访问量',   raw: visitCount,    icon: VisitsIcon },
  { label: '分类总数',     raw: categoryCount, icon: CategoryIcon },
].map(s => ({
  label: s.label,
  icon: s.icon,
  animated: useTransition(s.raw, { duration: 1200 }),
}))

// 页面挂载后拉取数据
onMounted(async () => {
  try {
    const { data } = await axios.get('/api/v1/admin/dashboard')
    questionCount.value = data.totalQuestions
    userCount.value     = data.totalUsers
    visitCount.value    = data.todayVisits
    categoryCount.value = data.totalCategories
  } catch (e) {
    console.error('统计数据获取失败', e)
  }
})
</script>

<style scoped>
.stats-overview {
  margin-top: 24px;
}

/* 卡片整体 */
.stat-card {
  text-align: center;
  border-radius: 12px;
  padding: 20px 10px;
  background: var(--el-bg-color-container);
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-shadow-5);
}

/* 图标外壳 */
.icon-wrapper {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图标 */
.stat-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

/* 数字 */
.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

/* 标签 */
.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 响应式：窄屏调整间距 */
@media (max-width: 600px) {
  .stat-card {
    margin-bottom: 16px;
  }
}
</style>
