<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { Flame } from 'lucide-vue-next'
import AppCard from '@/components/common/AppCard.vue'

type Habit = { id: string; name: string; tone: 'butter' | 'lilac' | 'mint' }
type CheckIns = Record<string, Record<string, boolean>>

const STORAGE_KEY = 'myhub-habit-checkins-v1'
const habits: Habit[] = [
  { id: 'wake', name: '早起 6:30', tone: 'butter' },
  { id: 'read', name: '阅读 30 分钟', tone: 'lilac' },
  { id: 'water', name: '喝水 1.8L', tone: 'mint' },
]
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

function loadCheckIns(): CheckIns {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CheckIns) : {}
  } catch {
    return {}
  }
}

const checkIns = ref<CheckIns>(loadCheckIns())
const week = computed(() => {
  const monday = dayjs().startOf('week')
  return weekdays.map((label, index) => {
    const date = monday.add(index, 'day')
    return { label, iso: date.format('YYYY-MM-DD'), future: date.isAfter(dayjs(), 'day') }
  })
})
const completionRate = computed(() => {
  const slots = habits.length * week.value.length
  const done = habits.reduce(
    (sum, habit) => sum + week.value.filter((day) => checkIns.value[day.iso]?.[habit.id]).length,
    0,
  )
  return Math.round((done / slots) * 100)
})
const currentStreak = computed(() => {
  const today = dayjs().startOf('day')
  return Math.max(
    ...habits.map((habit) => {
      let date = today
      if (!checkIns.value[date.format('YYYY-MM-DD')]?.[habit.id]) date = date.subtract(1, 'day')
      let count = 0
      while (checkIns.value[date.format('YYYY-MM-DD')]?.[habit.id]) {
        count += 1
        date = date.subtract(1, 'day')
      }
      return count
    }),
  )
})

function isChecked(habitId: string, isoDate: string) {
  return Boolean(checkIns.value[isoDate]?.[habitId])
}

function toggleCheckIn(habitId: string, isoDate: string) {
  const next = { ...checkIns.value, [isoDate]: { ...checkIns.value[isoDate] } }
  if (next[isoDate][habitId]) delete next[isoDate][habitId]
  else next[isoDate][habitId] = true
  if (Object.keys(next[isoDate]).length === 0) delete next[isoDate]
  checkIns.value = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Keep the current session usable if browser storage is unavailable.
  }
}
</script>

<template>
  <AppCard class="habit-card">
    <div class="habit-header">
      <div>
        <span class="eyebrow">习惯打卡</span>
        <div class="streak-line">
          <strong>{{ currentStreak }}</strong><span>天连续记录</span>
        </div>
      </div>
      <span class="flame-icon"><Flame :size="19" /></span>
    </div>

    <div class="completion-box">
      <div class="completion-label">
        <span>本周完成率</span><strong>{{ completionRate }}%</strong>
      </div>
      <div class="completion-track"><span :style="{ width: `${completionRate}%` }"></span></div>
    </div>

    <div class="habit-list">
      <div v-for="habit in habits" :key="habit.id" class="habit-row">
        <span class="habit-dot" :class="habit.tone"></span>
        <span class="habit-name">{{ habit.name }}</span>
        <div class="week-checks">
          <button
            v-for="day in week"
            :key="day.iso"
            class="day-check"
            :class="[
              habit.tone,
              {
                checked: isChecked(habit.id, day.iso),
                today: day.iso === dayjs().format('YYYY-MM-DD'),
              },
            ]"
            type="button"
            :disabled="day.future"
            :aria-pressed="isChecked(habit.id, day.iso)"
            :aria-label="`${habit.name}，周${day.label}${isChecked(habit.id, day.iso) ? '已完成' : '未完成'}`"
            :title="`${day.iso} · ${isChecked(habit.id, day.iso) ? '已完成' : day.future ? '还没到这一天' : '点击打卡'}`"
            @click="toggleCheckIn(habit.id, day.iso)"
          >
            {{ day.label }}
          </button>
        </div>
      </div>
    </div>
    <p class="storage-hint">打卡记录保存在此浏览器</p>
  </AppCard>
</template>

<style scoped lang="scss">
.habit-card {
  min-height: 100%;
  padding: 21px 22px 14px;
}
.habit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.eyebrow {
  color: #5f5880;
  font-size: 12px;
  font-weight: 550;
}
.streak-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
}
.streak-line strong {
  color: var(--text-primary);
  font-size: 30px;
  font-weight: 650;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.streak-line > span {
  color: var(--text-secondary);
  font-size: 10px;
}
.flame-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 16px;
  color: #ed8b43;
  background: linear-gradient(145deg, #fff0df, #ffe5e4);
}
.completion-box {
  margin-top: 14px;
  padding: 12px 13px;
  border: 1px solid #f0eafb;
  border-radius: 17px;
  background: linear-gradient(135deg, #fbf8ff, #f8f5ff);
}
.completion-label {
  display: flex;
  justify-content: space-between;
  color: #a49db9;
  font-size: 10px;
}
.completion-label strong {
  color: #805fe0;
  font-size: 10px;
  font-weight: 650;
}
.completion-track {
  height: 6px;
  overflow: hidden;
  margin-top: 8px;
  border-radius: 99px;
  background: white;
}
.completion-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #56d9c3, #68caff);
  transition: width 180ms ease;
}
.habit-list {
  display: grid;
  gap: 11px;
  margin-top: 14px;
}
.habit-row {
  min-width: 0;
  display: grid;
  grid-template-columns: 7px minmax(80px, 1fr) auto;
  align-items: center;
  gap: 9px;
}
.habit-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.habit-dot.butter {
  background: #ffb66f;
}
.habit-dot.lilac {
  background: #bca4ff;
}
.habit-dot.mint {
  background: #54d9c1;
}
.habit-name {
  overflow: hidden;
  color: #5f5880;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.week-checks {
  display: grid;
  grid-template-columns: repeat(7, 23px);
  gap: 5px;
}
.day-check {
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  color: rgb(66 57 89 / 66%);
  font: inherit;
  font-size: 9px;
  cursor: pointer;
  transition:
    transform 130ms ease,
    opacity 130ms ease,
    box-shadow 130ms ease;
}
.day-check.butter {
  background: #ffe2ac;
}
.day-check.lilac {
  background: #e6ddff;
}
.day-check.mint {
  background: #a6f1db;
}
.day-check:not(.checked) {
  opacity: 0.58;
}
.day-check.checked {
  opacity: 1;
  box-shadow: 0 4px 10px -7px rgb(70 53 125 / 55%);
}
.day-check.today {
  border-color: #9f86ed;
}
.day-check:disabled {
  cursor: default;
  opacity: 0.34;
}
.day-check:not(:disabled):hover {
  transform: translateY(-1px);
}
.day-check:focus-visible {
  outline: 2px solid #8b6df0;
  outline-offset: 2px;
}
.storage-hint {
  margin: 10px 0 0;
  color: #aaa2bd;
  font-size: 9px;
  text-align: right;
}
:global(:root[data-theme='dark']) .eyebrow,
:global(:root[data-theme='dark']) .habit-name {
  color: var(--text-secondary);
}
:global(:root[data-theme='dark']) .completion-box {
  border-color: var(--app-border);
  background: #353047;
}
:global(:root[data-theme='dark']) .completion-track {
  background: #49435b;
}
@media (max-width: 1100px) {
  .habit-card {
    padding-inline: 16px;
  }
  .habit-row {
    grid-template-columns: 7px minmax(70px, 1fr) auto;
    gap: 7px;
  }
  .week-checks {
    grid-template-columns: repeat(7, 20px);
    gap: 4px;
  }
  .day-check {
    width: 20px;
    height: 21px;
  }
}
@media (max-width: 580px) {
  .habit-card {
    padding: 17px 14px 12px;
  }
  .habit-row {
    grid-template-columns: 7px minmax(90px, 1fr) auto;
    gap: 8px;
  }
  .week-checks {
    grid-template-columns: repeat(7, 23px);
    gap: 5px;
  }
  .day-check {
    width: 23px;
    height: 23px;
  }
}
</style>
