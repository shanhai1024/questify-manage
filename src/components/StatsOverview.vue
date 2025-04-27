<template>
  <div class="stats-wrapper">
    <div
        v-for="(stat, idx) in stats"
        :key="stat.label"
        class="stats-card"
        :style="{ background: getGradient(idx) }"
    >
      <div class="icon-container">
        <component :is="stat.icon" class="stats-icon" />
      </div>
      <div class="stat-value">{{ stat.animated }}</div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'
import  statsApi from "@/api/stats"
import { useGradient } from '@/theme/useGradient'
import {
  Document as DocumentIcon,
  User as UserIcon,
  DataLine as VisitsIcon,
  Menu as CategoryIcon,
} from '@element-plus/icons-vue'

const { getGradient } = useGradient()

const questionCount = ref(0)
const userCount     = ref(0)
const visitCount    = ref(0)
const categoryCount = ref(0)

const stats = [
  { label: '题目总数',   raw: questionCount, icon: DocumentIcon },
  { label: '用户总数',   raw: userCount,     icon: UserIcon     },
  { label: '今日访问量', raw: visitCount,    icon: VisitsIcon   },
  { label: '分类总数',   raw: categoryCount, icon: CategoryIcon },
].map(s => ({
  label: s.label,
  icon: s.icon,
  animated: useTransition(s.raw, { duration: 800 }),
}))

onMounted(async () => {
  try {
    statsApi.getStatsData().then(res=>{
      console.log("=-=-=-=-=-=-")
      console.log(res.data)
      questionCount.value = res.data.totalQuestions
      userCount.value     = res.data.totalUsers
      visitCount.value    = res.data.todayVisits
      categoryCount.value = res.data.totalCategories

    })
  } catch (e) {
    console.error('统计数据获取失败', e)
  }
})
</script>

<style scoped lang="scss">
.stats-wrapper {
  display: grid;
  /* 四列自动撑开；超宽时均分；窄屏时自动换行 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  padding: 16px 0;
}

.stats-card {
  height: 220px;
  border-radius: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform .2s, box-shadow .2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  cursor: default;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
}

.icon-container {
  width: 80px;
  height: 80px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.25);
  border-radius: 50%;
  transition: background .3s;
}

.stats-icon {
  width: 100%;
  height: 100%;
  color: #fff;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

/* 超窄屏时收敛尺寸 */
@media (max-width: 400px) {
  .stats-card {
    height: 200px;
  }
  .icon-container {
    width: 64px;
    height: 64px;
    padding: 12px;
  }
  .stat-value {
    font-size: 28px;
  }
}
</style>
