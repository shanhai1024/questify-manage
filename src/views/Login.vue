<template>
  <div class="login-page">
    <main class="card" :class="{ 'card--register': isRegister }">
      <!-- Brand / Marketing side (hidden on mobile) -->
      <aside class="card__aside">
        <h1 class="brand">题灵<span>AI</span></h1>
        <p class="tagline">
          覆盖多语言题库 · 分模块刷题与模拟面试<br />助你快速突破技术难关
        </p>
      </aside>

      <!-- Form side -->
      <section class="card__form">
        <!-- Login -->
        <form v-if="!isRegister" @submit.prevent="handleLogin" novalidate aria-label="登录表单">
          <h2 class="title">登录</h2>

          <!-- 手机号 -->
          <div class="field" :class="{ 'field--error': !isPhoneValid }">
            <label for="login-phone">手机号</label>
            <input
                id="login-phone"
                v-model="formLogin.username"
                type="tel"
                pattern="[0-9]{11}"
                placeholder="请输入 11 位手机号"
                required
            />
            <small v-if="!isPhoneValid" class="msg-error">手机号格式不正确</small>
          </div>

          <!-- 密码 -->
          <div class="field">
            <label for="login-pwd">密码</label>
            <div class="field__password">
              <input
                  id="login-pwd"
                  v-model="formLogin.password"
                  :type="showPwd ? 'text' : 'password'"
                  placeholder="请输入密码"
                  required
              />
              <button type="button" class="toggle" @click="showPwd = !showPwd" :aria-label="showPwd ? '隐藏密码' : '显示密码'">
                <i :class="showPwd ? 'bx bx-hide' : 'bx bx-show'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="row between">
            <label class="checkbox">
              <input type="checkbox" v-model="rememberMe" />记住账号
            </label>
            <RouterLink to="/forgot" class="link">忘记密码?</RouterLink>
          </div>

          <button class="btn-primary" type="submit">登录</button>
          <p class="switch">没有账号? <a href="#" @click.prevent="toggleForm">注册</a></p>
        </form>

        <!-- Register -->
        <form v-else @submit.prevent="handleRegister" novalidate aria-label="注册表单">
          <h2 class="title">注册</h2>

          <div class="field">
            <label for="reg-name">用户名</label>
            <input id="reg-name" v-model="formRegister.username" required placeholder="昵称" />
          </div>

          <div class="field" :class="{ 'field--error': !isPhoneValid }">
            <label for="reg-phone">手机号</label>
            <input
                id="reg-phone"
                v-model="formRegister.phone"
                type="tel"
                pattern="[0-9]{11}"
                required
                placeholder="请输入 11 位手机号"
            />
            <small v-if="!isPhoneValid" class="msg-error">手机号格式不正确</small>
          </div>

          <div class="field">
            <label for="reg-pwd">密码</label>
            <div class="field__password">
              <input
                  id="reg-pwd"
                  v-model="formRegister.password"
                  :type="showPwd ? 'text' : 'password'"
                  required
                  placeholder="请输入密码"
              />
              <button type="button" class="toggle" @click="showPwd = !showPwd" :aria-label="showPwd ? '隐藏密码' : '显示密码'">
                <i :class="showPwd ? 'bx bx-hide' : 'bx bx-show'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="row between">
            <label class="checkbox">
              <input type="checkbox" v-model="agree" required />我已阅读并同意服务条款
            </label>
          </div>

          <button class="btn-primary" type="submit">注册</button>
          <p class="switch">已有账号? <a href="#" @click.prevent="toggleForm">登录</a></p>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import userApi from '@/api/user'

/* ------------------ 状态 ------------------ */
const formLogin = reactive({ username: '', password: '' })
const formRegister = reactive({ username: '', phone: '', password: '' })
const isRegister = ref(false)
const isPhoneValid = ref(true)
const showPwd = ref(false)
const rememberMe = ref(false)
const agree = ref(false)

/* ------------------ 路由 / store ------------------ */
const router = useRouter()
const userStore = useUserStore()

/* ------------------ 方法 ------------------ */
const toggleForm = () => (isRegister.value = !isRegister.value)

const phoneOk = phone => /^[0-9]{11}$/.test(phone)

async function handleLogin() {
  isPhoneValid.value = phoneOk(formLogin.username)
  if (!isPhoneValid.value) return

  try {
    const res = await userApi.loginUser({ phoneNumber: formLogin.username, password: formLogin.password })
    if (res.code === 200) {
      const { tokenValue } = res.data.tokenInfo
      localStorage.setItem('token', tokenValue)
      userStore.setUserInfo(tokenValue, res.data.user.nickName, res.data.user.avatar, res.data.user.email, res.data.user.phoneNumber)
      await nextTick()
      router.push({ name: 'home' })
    }
  } catch (e) {
    console.error('登录失败', e)
  }
}

async function handleRegister() {
  isPhoneValid.value = phoneOk(formRegister.phone)
  if (!isPhoneValid.value || !agree.value) return
  try {
    const res = await userApi.registerUser({ userName: formRegister.username, phoneNumber: formRegister.phone, password: formRegister.password })
    if (res.code === 200) {
      toggleForm()
      alert('注册成功，请登录')
    }
  } catch (e) {
    console.error('注册失败', e)
  }
}
</script>

<style scoped>
/************ 设计 Token ************/
:root {
  --c-bg: #f6f7fb;
  --c-surface: #ffffff;
  --c-on-surface: #1d1e20;
  --c-primary: #ff2c8c;
  --c-error: #e03131;
}
@media (prefers-color-scheme: dark) {
  :root {
    --c-bg: #121212;
    --c-surface: #1e1f24;
    --c-on-surface: #f1f3f5;
  }
}

/************ 基本布局 ************/
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--c-bg);
  padding: 1rem;
}

.card {
  display: flex;
  background: var(--c-surface);
  color: var(--c-on-surface);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
}
.card__aside {
  flex: 1 1 40%;
  padding: 3rem 2.5rem;
  background: linear-gradient(135deg, #ff6a95 0%, #ff2c8c 100%);
  color: #fff;
}
.brand {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.brand span {
  font-weight: 400;
}
.tagline {
  margin-top: 2rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.card__form {
  flex: 1 1 60%;
  padding: 3rem 2.5rem;
}
.title {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
}

/************ 表单字段 ************/
.field {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}
.field label {
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}
.field input {
  padding: 0.75rem 0.9rem;
  border: 1px solid #ced4da;
  border-radius: 0.5rem;
  background: transparent;
  color: inherit;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.field input:focus {
  border-color: var(--c-primary);
}
.field--error input {
  border-color: var(--c-error);
}
.msg-error {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--c-error);
}

/************ 密码 Toggle ************/
.field__password {
  position: relative;
}
.toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #6c757d;
}

/************ 行内元素 ************/
.row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.between {
  justify-content: space-between;
}
.checkbox input {
  margin-right: 0.4rem;
  accent-color: var(--c-primary);
}
.link {
  font-size: 0.9rem;
  color: var(--c-primary);
  text-decoration: none;
}

/************ 按钮 ************/
.btn-primary {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #ff2c8c;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover {
  opacity: 0.9;
}

.switch {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}
.switch a {
  color: var(--c-primary);
  text-decoration: none;
}

/************ 响应式 ************/
@media (max-width: 768px) {
  .card {
    flex-direction: column;
  }
  .card__aside {
    display: none;
  }
}
</style>
