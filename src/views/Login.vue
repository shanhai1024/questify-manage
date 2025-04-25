
<template>
  <div class="login-bg">
    <el-card class="card">
      <div class="title"><img src="@/assets/svg/logo.svg" class="logo"/>题灵 AI</div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username"><el-input v-model="form.username" placeholder="用户名" /></el-form-item>
        <el-form-item prop="password"><el-input v-model="form.password" type="password" placeholder="密码" show-password/></el-form-item>
        <el-button type="primary" class="w100" @click="login">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
const router = useRouter()
const formRef = ref<FormInstance>()
const form = reactive({username:'',password:''})
const rules = { username:[{required:true,message:'必填',trigger:'blur'}], password:[{required:true,message:'必填',trigger:'blur'}] }
function login(){
  formRef.value?.validate(valid=>{
    if(valid){ localStorage.setItem('token','mock'); router.push('/') }
    else ElMessage.warning('请完善信息')
  })
}
</script>

<style scoped>
.login-bg{height:100vh;background: radial-gradient(circle at 25% 75%,#6a78ff 0%,#d8d4ff 70%);display:flex;align-items:center;justify-content:center;}
.card{width:340px;border-radius:16px;}
.title{display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;margin-bottom:16px;gap:8px;}
.logo{width:32px;}
.w100{width:100%;}
</style>
