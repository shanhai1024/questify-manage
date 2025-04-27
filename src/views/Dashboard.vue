<template>
  <div>
    <!-- 1️⃣ 把欢迎卡片放在最上面 -->
    <WelcomeCard />


    <!-- 2️⃣ 统计卡片 -->
    <stats-overview/>
    <!-- 3️⃣可视化卡片 -->
    <charts/>


  </div>
</template>

<script setup lang="ts">
import WelcomeCard from '@/components/WelcomeCard.vue'
import StatsOverview from "@/components/StatsOverview.vue";
import Charts from "@/components/Charts.vue";  // 👈 引入你的欢迎卡片组件

</script>

<style scoped>

</style>
