<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Plus,
  Sparkles,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import AppCard from '@/components/common/AppCard.vue'

dayjs.locale('zh-cn')
const today = dayjs()
const dateLabel = today.format('M月D日 dddd')
const plans = [
  { time: '09:30', title: '梳理本周优先事项', type: '工作', color: 'blue' },
  { time: '13:00', title: '专注时间 · 项目推进', type: '专注', color: 'violet' },
  { time: '16:30', title: '回顾与整理', type: '个人', color: 'green' },
]
const recent = [
  { name: '产品灵感收集', detail: '个人资料库', icon: FileText },
  { name: '每周复盘模板', detail: '个人资料库', icon: BookOpen },
]
</script>

<template>
  <div class="dashboard">
    <section class="welcome">
      <div>
        <div class="eyebrow"><Sparkles :size="14" /> 让今天更有条理</div>
        <h1>早上好，今天从这里开始。</h1>
        <p>{{ dateLabel }} <span class="dot">·</span> 把注意力留给重要的事</p>
      </div>
      <div class="demo-note">静态演示数据</div>
    </section>

    <section class="overview-grid">
      <AppCard class="focus-card"
        ><div class="card-heading">
          <div>
            <span class="eyebrow muted">今日重点</span>
            <h2>先完成一件重要的事</h2>
          </div>
          <span class="round-icon"><Check :size="17" /></span>
        </div>
        <div class="focus-task">
          <span class="task-check"></span>
          <div>
            <strong>整理项目第一阶段的工作清单</strong
            ><small>高优先级 <span>·</span> 预计 45 分钟</small>
          </div>
        </div>
        <div class="progress-row">
          <div class="progress-track"><span></span></div>
          <span>0 / 1 完成</span>
        </div>
      </AppCard>
      <AppCard class="todo-card"
        ><div class="card-heading">
          <div>
            <span class="eyebrow muted">任务概览</span>
            <h2>给待办留出一点空间</h2>
          </div>
          <span class="round-icon amber"><Check :size="17" /></span>
        </div>
        <div class="todo-summary">
          <div><strong>4</strong><span>待处理</span></div>
          <div><strong>2</strong><span>今天到期</span></div>
          <div><strong>1</strong><span>已完成</span></div>
        </div>
        <RouterLink to="/todos" class="text-link"
          >查看任务中心 <ArrowRight :size="15"
        /></RouterLink>
      </AppCard>
    </section>

    <section class="content-grid">
      <AppCard class="schedule-card"
        ><div class="section-heading">
          <div>
            <span class="eyebrow muted">今天的节奏</span>
            <h2>计划时间轴</h2>
          </div>
          <RouterLink to="/plans" class="text-link">全部计划 <ArrowRight :size="15" /></RouterLink>
        </div>
        <div class="timeline">
          <div v-for="(plan, index) in plans" :key="plan.time" class="timeline-row">
            <div class="time">{{ plan.time }}</div>
            <div class="timeline-mark" :class="plan.color">
              <span></span><i v-if="index < plans.length - 1"></i>
            </div>
            <div class="plan-content">
              <strong>{{ plan.title }}</strong><span class="tag" :class="plan.color">{{
                plan.type
              }}</span>
            </div>
          </div>
        </div>
        <button class="add-plan" type="button"><Plus :size="15" /> 添加一个计划</button>
      </AppCard>
      <div class="right-stack">
        <AppCard class="shortcuts-card"
          ><div class="section-heading">
            <div>
              <span class="eyebrow muted">常用入口</span>
              <h2>快捷入口</h2>
            </div>
            <ArrowUpRight :size="17" class="subtle-icon" />
          </div>
          <RouterLink to="/plans" class="shortcut-row"
            ><span class="shortcut-icon blue"><CalendarDays :size="17" /></span
            ><span><strong>新建计划</strong><small>安排接下来的一步</small></span
            ><ArrowRight :size="15"
          /></RouterLink>
          <RouterLink to="/library" class="shortcut-row"
            ><span class="shortcut-icon violet"><BookOpen :size="17" /></span
            ><span><strong>打开资料库</strong><small>回到收藏的内容</small></span
            ><ArrowRight :size="15"
          /></RouterLink>
        </AppCard>
        <AppCard class="recent-card"
          ><div class="section-heading">
            <div>
              <span class="eyebrow muted">继续上次的思路</span>
              <h2>最近访问</h2>
            </div>
            <Clock3 :size="17" class="subtle-icon" />
          </div>
          <RouterLink v-for="item in recent" :key="item.name" to="/library" class="recent-row"
            ><component :is="item.icon" :size="16" /><span
              ><strong>{{ item.name }}</strong
              ><small>{{ item.detail }}</small></span
            ><ArrowUpRight :size="14"
          /></RouterLink>
        </AppCard>
      </div>
    </section>
    <footer class="dashboard-footer">
      <span>给今天留一点余地。</span
      ><RouterLink to="/settings">调整你的工作台 <ArrowRight :size="14" /></RouterLink>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: grid;
  gap: 22px;
}
.welcome {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 5px 2px 3px;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 600;
}
.eyebrow.muted {
  color: var(--text-secondary);
}
h1 {
  margin: 11px 0 7px;
  font-size: clamp(24px, 3vw, 31px);
  line-height: 1.25;
  letter-spacing: -0.8px;
  font-weight: 650;
}
.welcome p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}
.dot {
  padding: 0 5px;
  color: var(--text-tertiary);
}
.demo-note {
  padding: 5px 9px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-tertiary);
  font-size: 11px;
  white-space: nowrap;
}
.overview-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}
.focus-card,
.todo-card,
.schedule-card,
.shortcuts-card,
.recent-card {
  padding: 20px;
}
.card-heading,
.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
h2 {
  margin: 5px 0 0;
  font-size: 16px;
  font-weight: 620;
  letter-spacing: -0.2px;
}
.round-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  color: var(--success-color);
  background: color-mix(in srgb, var(--success-color) 12%, transparent);
}
.round-icon.amber {
  color: var(--warning-color);
  background: color-mix(in srgb, var(--warning-color) 13%, transparent);
}
.focus-task {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin: 21px 0 17px;
}
.task-check {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  margin-top: 2px;
  border: 1.5px solid var(--border-color);
  border-radius: 50%;
}
.focus-task strong,
.shortcut-row strong,
.recent-row strong {
  display: block;
  font-size: 13px;
  font-weight: 550;
}
.focus-task small,
.shortcut-row small,
.recent-row small {
  display: block;
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 11px;
}
.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-tertiary);
  font-size: 11px;
}
.progress-track {
  height: 4px;
  flex: 1;
  overflow: hidden;
  border-radius: 3px;
  background: var(--bg-subtle);
}
.progress-track span {
  display: block;
  width: 4%;
  height: 100%;
  background: var(--primary-color);
}
.todo-summary {
  display: flex;
  gap: 30px;
  padding: 17px 0 14px;
}
.todo-summary div {
  display: grid;
  gap: 2px;
}
.todo-summary strong {
  font-size: 21px;
  font-weight: 620;
}
.todo-summary span {
  color: var(--text-secondary);
  font-size: 11px;
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 550;
}
.text-link:hover {
  gap: 9px;
}
.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: start;
  gap: 16px;
}
.section-heading {
  align-items: center;
  margin-bottom: 15px;
}
.section-heading .text-link {
  color: var(--text-secondary);
  font-weight: 450;
}
.subtle-icon {
  color: var(--text-tertiary);
}
.timeline {
  display: grid;
}
.timeline-row {
  min-height: 62px;
  display: grid;
  grid-template-columns: 48px 18px minmax(0, 1fr);
  gap: 12px;
}
.time {
  padding-top: 1px;
  color: var(--text-secondary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.timeline-mark {
  position: relative;
  display: flex;
  justify-content: center;
}
.timeline-mark span {
  z-index: 1;
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  background: var(--bg-card);
}
.timeline-mark i {
  position: absolute;
  top: 13px;
  bottom: 0;
  width: 1px;
  background: var(--border-color);
}
.timeline-mark.violet span {
  border-color: #8a70d6;
}
.timeline-mark.green span {
  border-color: var(--success-color);
}
.plan-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.plan-content strong {
  font-size: 12px;
  font-weight: 550;
}
.tag {
  padding: 2px 7px;
  border-radius: 5px;
  color: var(--primary-color);
  background: var(--primary-soft);
  font-size: 10px;
  white-space: nowrap;
}
.tag.violet {
  color: #8063cb;
  background: color-mix(in srgb, #8063cb 12%, transparent);
}
.tag.green {
  color: var(--success-color);
  background: color-mix(in srgb, var(--success-color) 12%, transparent);
}
.add-plan {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 2px;
  padding: 10px 0 0 60px;
  border: 0;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  background: transparent;
  font-size: 11px;
  text-align: left;
  cursor: pointer;
}
.add-plan:hover {
  color: var(--primary-color);
}
.right-stack {
  display: grid;
  gap: 16px;
}
.shortcuts-card,
.recent-card {
  padding: 18px 20px;
}
.shortcut-row,
.recent-row {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 58px;
  border-top: 1px solid var(--border-color);
}
.shortcut-row > span:nth-child(2),
.recent-row > span {
  flex: 1;
}
.shortcut-row > svg:last-child,
.recent-row > svg:last-child {
  color: var(--text-tertiary);
}
.shortcut-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}
.shortcut-icon.blue {
  color: var(--primary-color);
  background: var(--primary-soft);
}
.shortcut-icon.violet {
  color: #8063cb;
  background: color-mix(in srgb, #8063cb 12%, transparent);
}
.recent-row {
  min-height: 49px;
  color: var(--text-secondary);
}
.recent-row > svg:first-child {
  color: var(--primary-color);
}
.recent-row strong {
  color: var(--text-primary);
}
.dashboard-footer {
  display: flex;
  justify-content: space-between;
  padding: 3px 2px 0;
  color: var(--text-tertiary);
  font-size: 11px;
}
.dashboard-footer a {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
}
@media (max-width: 900px) {
  .overview-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
  .right-stack {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 580px) {
  .welcome {
    align-items: flex-start;
    gap: 12px;
  }
  .demo-note {
    margin-top: 3px;
  }
  .right-stack {
    grid-template-columns: 1fr;
  }
  .focus-card,
  .todo-card,
  .schedule-card {
    padding: 16px;
  }
  .todo-summary {
    justify-content: space-between;
    gap: 8px;
  }
  .dashboard-footer {
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
