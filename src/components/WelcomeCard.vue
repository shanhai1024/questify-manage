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
        <!-- 问候语 -->
        <div class="greeting">
          {{ greeting }}，{{ userName }}，{{ message }}
        </div>

        <!-- 一言 + 悬浮按钮 -->
        <div
            class="hitokoto-wrapper"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
        >
          <span class="hitokoto">
            {{ hitokoto }} <span class="from">—— {{ from }}</span>
          </span>

          <!-- 悬浮按钮：复制 + 刷新 -->
          <div class="btn-group" :class="{ show: hover }">
            <el-icon @click="copySentence"><CopyDocument /></el-icon>
            <el-icon @click="reload"><Refresh /></el-icon>
          </div>
        </div>
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
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { CopyDocument, Refresh } from '@element-plus/icons-vue'

/* —— 静态数据 —— */
const userName = 'Super'
const message = '今天又是充满活力的一天！'
const projectCount = 25
const todoDone = 4
const todoTotal = 16
const messageCount = 12

/* —— 样式 —— */
const bodyStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px'
}

/* —— 动态问候 —— */
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '早安'
  if (h < 14) return '午安'
  if (h < 18) return '下午好'
  return '晚上好'
})

/* —— 一言 —— */
const hitokoto = ref('加载中...')
const from = ref('')
const hover = ref(false)
let timer: number | undefined

const fetchSentence = async () => {
  try {
    const { data } = await axios.get('https://v1.hitokoto.cn/?encode=json')
    hitokoto.value = data.hitokoto
    // 组合出处：作品名 + 作者（如果有）
    from.value = data.from
        ? data.from + (data.from_who ? ` · ${data.from_who}` : '')
        : ''
  } catch (e) {
    hitokoto.value = '获取一言失败'
    console.error(e)
  }
}

const reload = () => fetchSentence()

const copySentence = async () => {
  await navigator.clipboard.writeText(`${hitokoto.value} —— ${from.value}`)
  ElMessage.success('已复制到剪贴板')
}

onMounted(() => {
  fetchSentence()
  timer = window.setInterval(fetchSentence, 60 * 1000) // 每分钟刷新
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.welcome-card {
  border-radius: 12px;
  background: var(--el-bg-color);
  box-shadow: var(--el-box-shadow);
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

/* 一言 */
.hitokoto-wrapper {
  position: relative;
  display: inline-block;
  margin-top: 6px;
}
.hitokoto {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.hitokoto .from {
  margin-left: 4px;
}

/* 悬浮按钮 */
.btn-group {
  position: absolute;
  right: -48px;                /* 根据需要微调 */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}
.btn-group.show {
  opacity: 1;
}
.btn-group .el-icon {
  cursor: pointer;
  color: var(--el-color-primary-light-8);
  font-size: 18px;
}
.btn-group .el-icon:hover {
  color: var(--el-color-primary);
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
