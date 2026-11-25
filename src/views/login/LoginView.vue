<script setup lang="ts">
import { ref } from 'vue'
import { isAxiosError } from 'axios'
import {
  ArrowRight,
  CalendarCheck2,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  Quote,
  Sparkles,
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import loginIllustration from '@/assets/images/login-illustration.webp'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const busy = ref(false)
const error = ref('')
const route = useRoute()
const router = useRouter()
const user = useUserStore()
const perks = [
  { icon: CalendarCheck2, label: '计划与排期' },
  { icon: Leaf, label: '今日任务' },
  { icon: Sparkles, label: '个人资料库' },
]

async function submit() {
  if (busy.value) return
  error.value = ''
  busy.value = true
  try {
    await user.signIn(username.value.trim(), password.value)
    const destination =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.replace(destination.startsWith('/') ? destination : '/dashboard')
  } catch (cause: unknown) {
    error.value =
      (isAxiosError<{ message?: string }>(cause) ? cause.response?.data?.message : undefined) ||
      '登录失败，请检查账号和密码后重试。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="ambient ambient-rose"></div>
    <div class="ambient ambient-lilac"></div>
    <div class="login-content">
      <section class="login-form-panel">
        <RouterLink class="brand" to="/login" aria-label="MyHub 登录页">
          <span class="brand-mark"><Sparkles :size="20" /></span>
          <span><b>MyHub</b><small>PERSONAL PLAN SPACE</small></span>
        </RouterLink>

        <header class="welcome-copy">
          <h1>欢迎回来，<br />今天也慢慢来。</h1>
          <p>登录后继续你的计划、任务与收藏的资料。未完成的事，都会在这里等你。</p>
        </header>

        <form class="login-form" @submit.prevent="submit">
          <label class="field-label" for="username">邮箱 / 账号</label>
          <div class="input-wrap">
            <Mail :size="17" />
            <input
              id="username"
              v-model="username"
              autocomplete="username"
              placeholder="输入用户名或邮箱"
              required
              maxlength="64"
            />
          </div>

          <label class="field-label password-label" for="password">密码</label>
          <div class="input-wrap">
            <LockKeyhole :size="17" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="请输入密码"
              required
              maxlength="128"
            />
            <button
              class="visibility-button"
              type="button"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="17" /><Eye v-else :size="17" />
            </button>
          </div>

          <p v-if="error" class="error-message" role="alert">{{ error }}</p>

          <button class="submit-button" type="submit" :disabled="busy">
            <span>{{ busy ? '正在登录…' : '登录我的工作台' }}</span>
            <ArrowRight v-if="!busy" :size="17" />
            <span v-else class="spinner"></span>
          </button>
        </form>

        <p class="privacy-note"><span></span>仅授权用户可访问此工作空间</p>
      </section>

      <section class="illustration-panel" aria-label="MyHub 个人计划空间介绍">
        <img :src="loginIllustration" alt="柔和黏土风插画：在书桌前规划日程" />
        <div class="image-wash"></div>
        <div class="feature-pills">
          <span>计划与排期</span><span>今日任务</span><span>个人资料库</span>
        </div>
        <div class="quote-card">
          <Quote :size="20" />
          <p>计划不是为了把每天塞满，<br class="wide-break" />而是给重要的事情留出位置。</p>
          <div class="perks">
            <span v-for="perk in perks" :key="perk.label"
              ><i><component :is="perk.icon" :size="14" /></i>{{ perk.label }}</span
            >
          </div>
        </div>
      </section>
    </div>
    <footer class="login-footer">
      <span>© 2026 MyHub · 一个安静的个人工作空间</span><span>计划 · 任务 · 资料</span>
    </footer>
  </main>
</template>

<style scoped lang="scss">
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 32px clamp(24px, 5vw, 76px) 18px;
  color: var(--text-primary);
  background: linear-gradient(120deg, #fdf3fb 0%, #f6f2ff 42%, #eaf3ff 100%);
}
.ambient {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  filter: blur(54px);
  pointer-events: none;
}
.ambient-rose {
  top: 4%;
  left: -100px;
  background: rgb(251 205 222 / 35%);
}
.ambient-lilac {
  bottom: -140px;
  left: 36%;
  background: rgb(191 172 252 / 34%);
}
.login-content {
  position: relative;
  z-index: 1;
  width: min(100%, 1240px);
  flex: 1;
  display: grid;
  grid-template-columns: minmax(340px, 0.92fr) minmax(440px, 1.08fr);
  align-items: center;
  gap: clamp(42px, 7vw, 100px);
  margin: 0 auto;
  padding: 12px 0 32px;
}
.login-form-panel {
  width: min(100%, 430px);
  justify-self: center;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: inherit;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 17px;
  color: white;
  background: linear-gradient(135deg, #a88af5, #9b9ff3 58%, #8bd4db);
  box-shadow: 0 14px 26px -16px rgb(124 92 214 / 90%);
}
.brand b,
.brand small {
  display: block;
}
.brand b {
  color: #2b2540;
  font-size: 17px;
  line-height: 1.1;
}
.brand small {
  margin-top: 4px;
  color: #a49db9;
  font-size: 9px;
  letter-spacing: 0.16em;
}
.welcome-copy {
  margin-top: 38px;
}
.welcome-copy h1 {
  margin: 0;
  color: #241f38;
  font-size: clamp(30px, 3vw, 38px);
  font-weight: 680;
  letter-spacing: -0.045em;
  line-height: 1.2;
}
.welcome-copy p {
  margin: 14px 0 0;
  color: #7d7794;
  font-size: 13px;
  line-height: 1.8;
}
.login-form {
  margin-top: 28px;
}
.field-label {
  display: block;
  margin: 0 0 8px;
  color: #5f5880;
  font-size: 12px;
  font-weight: 550;
}
.password-label {
  margin-top: 19px;
}
.input-wrap {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 14px;
  border: 1px solid #e9e2f6;
  border-radius: 15px;
  color: #aaa1c0;
  background: rgb(255 255 255 / 86%);
  box-shadow: 0 6px 18px -16px rgb(88 66 150 / 35%);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}
.input-wrap:focus-within {
  border-color: #b6a1f4;
  box-shadow: 0 0 0 3px rgb(167 139 250 / 14%);
}
.input-wrap input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: #3a3355;
  background: transparent;
  font: inherit;
  font-size: 13px;
}
.input-wrap input::placeholder {
  color: #b6afc8;
}
.visibility-button {
  display: grid;
  place-items: center;
  padding: 5px;
  border: 0;
  color: #aaa1c0;
  background: transparent;
  cursor: pointer;
}
.visibility-button:hover {
  color: #8b6df0;
}
.error-message {
  margin: 12px 0 0;
  padding: 10px 13px;
  border: 1px solid #f8dbe5;
  border-radius: 13px;
  color: #ad4968;
  background: #fff4f7;
  font-size: 12px;
  line-height: 1.6;
}
.submit-button {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  padding: 0 18px;
  border: 0;
  border-radius: 16px;
  color: white;
  background: linear-gradient(110deg, #8b6df0, #8f8cf0 58%, #78c9cf);
  box-shadow: 0 14px 24px -16px rgb(124 92 214 / 75%);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}
.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 17px 27px -16px rgb(124 92 214 / 85%);
}
.submit-button:disabled {
  opacity: 0.72;
  cursor: wait;
}
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgb(255 255 255 / 40%);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 20px 0 0;
  color: #a49db9;
  font-size: 11px;
}
.privacy-note span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #65c7a6;
}
.illustration-panel {
  position: relative;
  min-height: min(68vh, 620px);
  overflow: hidden;
  align-self: stretch;
  border: 1px solid rgb(255 255 255 / 75%);
  border-radius: 36px;
  background: #ece6fb;
  box-shadow: 0 30px 70px -48px rgb(67 48 119 / 55%);
}
.illustration-panel > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 43%;
}
.image-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(255 255 255 / 6%) 30%,
    rgb(45 34 75 / 6%) 55%,
    rgb(46 35 76 / 18%) 100%
  );
}
.feature-pills {
  position: absolute;
  top: 22px;
  left: 22px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.feature-pills span {
  padding: 7px 12px;
  border: 1px solid rgb(255 255 255 / 75%);
  border-radius: 99px;
  color: #5f5880;
  background: rgb(255 255 255 / 86%);
  box-shadow: 0 8px 20px -17px rgb(52 38 102 / 60%);
  backdrop-filter: blur(12px);
  font-size: 10px;
  font-weight: 550;
}
.quote-card {
  position: absolute;
  right: 22px;
  bottom: 22px;
  left: 22px;
  padding: 18px 20px 15px;
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 24px;
  color: #3a3355;
  background: rgb(255 255 255 / 78%);
  box-shadow: 0 26px 60px -34px rgb(52 38 102 / 60%);
  backdrop-filter: blur(18px);
}
.quote-card > svg {
  color: #aa94ef;
}
.quote-card p {
  margin: 7px 0 0;
  font-size: 13px;
  font-weight: 550;
  line-height: 1.8;
}
.perks {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f0ebfa;
}
.perks span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #6b6485;
  font-size: 10px;
}
.perks i {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 9px;
  color: #8063dc;
  background: linear-gradient(135deg, #f0eaff, #eaf3ff);
  font-style: normal;
}
.login-footer {
  position: relative;
  z-index: 1;
  width: min(100%, 1400px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: auto;
  color: #a49db9;
  font-size: 10px;
}
.login-footer span:last-child {
  color: #8b84a3;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
  .submit-button {
    transition: none;
  }
}
@media (max-width: 900px) {
  .login-content {
    grid-template-columns: minmax(0, 440px);
    justify-content: center;
  }
  .illustration-panel {
    display: none;
  }
  .login-page {
    padding-inline: 24px;
  }
}
@media (max-width: 520px) {
  .login-page {
    padding: 24px 20px 14px;
  }
  .login-content {
    align-items: start;
    padding: 30px 0;
  }
  .welcome-copy {
    margin-top: 32px;
  }
  .welcome-copy h1 {
    font-size: 32px;
  }
  .login-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
