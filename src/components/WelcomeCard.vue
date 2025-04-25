<!-- src/components/WelcomeCard.vue -->
<template>
  <el-card
      class="welcome-card"
      shadow="never"
      :body-style="bodyStyle"
  >
    <!-- 左侧：头像 + 文本 -->
    <div class="welcome-left">
      <img
          class="avatar"
          src="http://shanhai10241.test.upcdn.net/null/56210461.jpeg"
          alt="头像"
      />
      <div class="welcome-text">
        <div class="greeting">
          {{ greeting }}，{{ userName }}，{{ message }}
        </div>
        <!-- 这里不再是 weather，而改成 dateTime -->
        <div class="sub">{{ dateTime }}</div>
      </div>
    </div>

    <!-- 右侧：统计 -->
    <div class="stats">
      <div class="stat-item">
        <div class="label">项目数</div>
        <div class="num">{{ projectCount }}</div>
      </div>
      <div class="stat-item">
        <div class="label">待办</div>
        <div class="num">{{ todoDone }}/{{ todoTotal }}</div>
      </div>
      <div class="stat-item">
        <div class="label">消息</div>
        <div class="num">{{ messageCount }}</div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// —— 基本数据不变 ——
const userName = 'Super'
const message = '今天又是充满活力的一天！'
const projectCount = 25
const todoDone = 4
const todoTotal = 16
const messageCount = 12

// —— body-style 保持 flex 布局 ——
const bodyStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px'
}

// —— 动态问候 ——
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '早安'
  if (h < 14) return '午安'
  if (h < 18) return '下午好'
  return '晚上好'
})

// —— 用 dateTime 代替 weather ——
const dateTime = ref('')
let timer: number
onMounted(() => {
  const update = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    dateTime.value = `${y}年${m}月${day}日 ${hh}:${mm}`
  }
  update()
  timer = window.setInterval(update, 60 * 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.welcome-card {
  border-radius: 12px;
  background: var(--el-bg-color-container);
  box-shadow: var(--el-box-shadow-2);
}

/* 左侧 */
.welcome-left {
  display: flex;
  align-items: center;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
}
.welcome-text .greeting {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.welcome-text .sub {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-top: 6px;
}

/* 右侧统计 */
.stats {
  display: flex;
  gap: 32px;
}
.stat-item {
  text-align: center;
}
.stat-item .label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.stat-item .num {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-top: 4px;
}

/* 响应式 */
@media (max-width: 600px) {
  .welcome-card >>> .el-card__body {
    flex-direction: column;
    align-items: flex-start;
  }
  .stats {
    width: 100%;
    justify-content: space-between;
    margin-top: 16px;
  }
}
</style>
