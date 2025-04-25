
<template>
  <el-row :gutter="20">
    <el-col v-for="card in cards" :key="card.title" :span="6">
      <el-card class="stat" :style="{background:card.color}">
        <div class="small">{{card.title}}</div>
        <div class="big">{{card.value}}</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const cards=[
  {title:'访问量',value:'9,725',color:'linear-gradient(135deg,#ff9a9e 0%,#fad0c4 100%)'},
  {title:'成交额',value:'$1,026',color:'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)'},
  {title:'下载量',value:'970,925',color:'linear-gradient(135deg,#8fd3f4 0%,#84fab0 100%)'},
  {title:'成交量',value:'9,527',color:'linear-gradient(135deg,#ff4e50 0%,#f9d423 100%)'}
]
</script>

<style scoped>
.stat{border:none;border-radius:12px;padding:22px 20px;color:#fff;cursor:pointer;transition:transform .2s;}
.stat:hover{transform:translateY(-4px);}
.small{font-size:14px;opacity:.85;}
.big{font-size:26px;font-weight:600;margin-top:6px;}
</style>
