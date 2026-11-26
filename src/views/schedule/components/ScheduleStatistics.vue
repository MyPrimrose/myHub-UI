<script setup lang="ts">
import type { ScheduleStatistics } from '../types/schedule'

defineProps<{
  statistics: ScheduleStatistics | null
  loading?: boolean
}>()
</script>

<template>
  <section class="stats-card">
    <div class="head">
      <h3>本月节奏</h3>
      <span>按真实排期统计</span>
    </div>
    <div class="grid">
      <div class="stat">
        <strong>{{ statistics?.totalCount ?? '—' }}</strong>
        <span>计划总数</span>
      </div>
      <div class="stat high">
        <strong>{{ statistics?.highPriorityCount ?? '—' }}</strong>
        <span>高优先</span>
      </div>
      <div class="stat progress">
        <strong>{{ statistics?.inProgressCount ?? '—' }}</strong>
        <span>进行中</span>
      </div>
      <div class="stat remain">
        <strong>{{ statistics?.remainingDays ?? '—' }}</strong>
        <span>本月剩余天</span>
      </div>
    </div>
    <div class="tip">
      把跨天计划摊在时间轴上，比日历格子更适合看一段日子的节奏。已完成 {{ statistics?.completedCount ?? 0 }} 项。
    </div>
  </section>
</template>

<style scoped lang="scss">
.stats-card {
  padding: 18px;
  border: 1px solid #efeaf8;
  border-radius: 22px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 18px 36px -30px rgb(124 92 214 / 35%);
}
.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}
.head h3 {
  margin: 0;
  font-size: 15px;
}
.head span {
  color: #a49db9;
  font-size: 11px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.stat {
  padding: 14px 12px;
  border-radius: 16px;
  background: #f6f3fc;
  text-align: center;
}
.stat strong {
  display: block;
  font-size: 24px;
  letter-spacing: -0.04em;
  color: #3c3554;
}
.stat span {
  display: block;
  margin-top: 4px;
  color: #9a93b2;
  font-size: 11px;
}
.stat.high {
  background: #fff1f4;
}
.stat.high strong {
  color: #d56f8e;
}
.stat.progress {
  background: #f1ebff;
}
.stat.progress strong {
  color: #7b5fe3;
}
.stat.remain {
  background: #eef8f5;
}
.stat.remain strong {
  color: #3f9f8a;
}
.tip {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #fff7e8;
  color: #9a7a4a;
  font-size: 12px;
  line-height: 1.55;
}
:global(:root[data-theme='dark']) .stats-card {
  border-color: var(--border-color);
  background: rgb(45 41 59 / 88%);
}
:global(:root[data-theme='dark']) .stat {
  background: var(--bg-subtle);
}
:global(:root[data-theme='dark']) .stat strong {
  color: var(--text-primary);
}
:global(:root[data-theme='dark']) .tip {
  background: #3a3428;
  color: #d6bf93;
}
</style>
