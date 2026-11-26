<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import type {
  ScheduleCategory,
  ScheduleItem,
  ScheduleItemPayload,
  ScheduleItemType,
  SchedulePriority,
  ScheduleStatus,
} from '../types/schedule'

const props = defineProps<{
  visible: boolean
  saving?: boolean
  editing?: ScheduleItem | null
  defaultType?: ScheduleItemType
  categories: ScheduleCategory[]
  plans: ScheduleItem[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [payload: ScheduleItemPayload, id?: number]
}>()

const dirty = ref(false)

const form = reactive({
  itemType: 'TASK' as ScheduleItemType,
  title: '',
  description: '',
  status: 'TODO' as ScheduleStatus,
  priority: 'MEDIUM' as SchedulePriority,
  startAt: '',
  endAt: '',
  dueAt: '',
  allDay: false,
  categoryId: null as number | null,
  relatedPlanId: null as number | null,
  location: '',
})

const titleText = computed(() => (props.editing ? '编辑事项' : '新增事项'))

function toLocalInput(value?: string | null) {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DDTHH:mm')
}

function resetForm() {
  const source = props.editing
  form.itemType = source?.itemType || props.defaultType || 'TASK'
  form.title = source?.title || ''
  form.description = source?.description || ''
  form.status = source?.status || 'TODO'
  form.priority = source?.priority || 'MEDIUM'
  form.startAt = toLocalInput(source?.startAt)
  form.endAt = toLocalInput(source?.endAt)
  form.dueAt = toLocalInput(source?.dueAt)
  form.allDay = Boolean(source?.allDay)
  form.categoryId = source?.categoryId ?? null
  form.relatedPlanId = source?.relatedPlanId ?? null
  form.location = source?.location || ''
  dirty.value = false
}

watch(
  () => [props.visible, props.editing, props.defaultType] as const,
  ([visible]) => {
    if (visible) resetForm()
  },
)

function markDirty() {
  dirty.value = true
}

function toPayloadDate(value: string) {
  if (!value) return null
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm:ss') : null
}

async function tryClose() {
  if (dirty.value) {
    try {
      await ElMessageBox.confirm('有未保存的修改，确定关闭吗？', '提示', {
        type: 'warning',
        confirmButtonText: '关闭',
        cancelButtonText: '继续编辑',
      })
    } catch {
      return
    }
  }
  emit('update:visible', false)
}

function submit() {
  if (!form.title.trim()) {
    ElMessage.warning('请填写标题')
    return
  }
  const startAt = toPayloadDate(form.startAt)
  const endAt = toPayloadDate(form.endAt)
  const dueAt = form.itemType === 'TASK' ? toPayloadDate(form.dueAt) : null
  if (startAt && endAt && dayjs(endAt).isBefore(dayjs(startAt))) {
    ElMessage.warning('结束时间不能早于开始时间')
    return
  }
  if (form.itemType === 'PLAN' && (!startAt || !endAt)) {
    ElMessage.warning('计划必须设置开始时间和结束时间')
    return
  }

  const payload: ScheduleItemPayload = {
    title: form.title.trim(),
    itemType: form.itemType,
    description: form.description.trim() || null,
    status: form.status,
    priority: form.priority,
    startAt,
    endAt,
    dueAt,
    allDay: form.allDay,
    categoryId: form.categoryId,
    relatedPlanId: form.itemType === 'TASK' ? form.relatedPlanId : null,
    location: form.itemType === 'PLAN' ? form.location.trim() || null : null,
  }
  emit('submit', payload, props.editing?.id)
}
</script>

<template>
  <div v-if="visible" class="drawer-mask" @click.self="tryClose">
    <section class="drawer">
      <header>
        <div>
          <h2>{{ titleText }}</h2>
          <p>计划和任务共用一张排期表，按类型填写对应字段。</p>
        </div>
        <button type="button" class="ghost" @click="tryClose">关闭</button>
      </header>

      <div class="body">
        <label class="field">
          <span>事项类型</span>
          <div class="type-switch">
            <button
              type="button"
              :class="{ active: form.itemType === 'PLAN' }"
              :disabled="Boolean(editing)"
              @click="form.itemType = 'PLAN'; markDirty()"
            >
              计划
            </button>
            <button
              type="button"
              :class="{ active: form.itemType === 'TASK' }"
              :disabled="Boolean(editing)"
              @click="form.itemType = 'TASK'; markDirty()"
            >
              任务
            </button>
          </div>
        </label>

        <label class="field">
          <span>标题 *</span>
          <input v-model="form.title" type="text" maxlength="200" @input="markDirty" />
        </label>

        <label class="field">
          <span>描述</span>
          <textarea v-model="form.description" rows="4" @input="markDirty" />
        </label>

        <div class="grid-2">
          <label class="field">
            <span>优先级</span>
            <select v-model="form.priority" @change="markDirty">
              <option value="LOW">低</option>
              <option value="MEDIUM">普通</option>
              <option value="HIGH">高</option>
            </select>
          </label>
          <label class="field">
            <span>状态</span>
            <select v-model="form.status" @change="markDirty">
              <option value="TODO">待办</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="COMPLETED">已完成</option>
              <option value="CANCELLED">已取消</option>
            </select>
          </label>
        </div>

        <label class="field">
          <span>分类</span>
          <select
            :value="form.categoryId ?? ''"
            @change="
              form.categoryId = ($event.target as HTMLSelectElement).value
                ? Number(($event.target as HTMLSelectElement).value)
                : null;
              markDirty()
            "
          >
            <option value="">未分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </label>

        <label class="check">
          <input v-model="form.allDay" type="checkbox" @change="markDirty" />
          全天事项
        </label>

        <div class="grid-2">
          <label class="field">
            <span>开始时间{{ form.itemType === 'PLAN' ? ' *' : '' }}</span>
            <input v-model="form.startAt" type="datetime-local" @change="markDirty" />
          </label>
          <label class="field">
            <span>结束时间{{ form.itemType === 'PLAN' ? ' *' : '' }}</span>
            <input v-model="form.endAt" type="datetime-local" @change="markDirty" />
          </label>
        </div>

        <template v-if="form.itemType === 'TASK'">
          <label class="field">
            <span>截止时间</span>
            <input v-model="form.dueAt" type="datetime-local" @change="markDirty" />
          </label>
          <label class="field">
            <span>关联计划</span>
            <select
              :value="form.relatedPlanId ?? ''"
              @change="
                form.relatedPlanId = ($event.target as HTMLSelectElement).value
                  ? Number(($event.target as HTMLSelectElement).value)
                  : null;
                markDirty()
              "
            >
              <option value="">不关联计划</option>
              <option v-for="plan in plans" :key="plan.id" :value="plan.id">{{ plan.title }}</option>
            </select>
          </label>
          <p class="hint">不填写开始、结束和截止时间时，任务会进入收集箱。</p>
        </template>

        <label v-if="form.itemType === 'PLAN'" class="field">
          <span>地点</span>
          <input v-model="form.location" type="text" maxlength="255" @input="markDirty" />
        </label>
      </div>

      <footer>
        <button type="button" class="ghost" @click="tryClose">取消</button>
        <button type="button" class="primary" :disabled="saving" @click="submit">
          {{ saving ? '保存中…' : '保存' }}
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped lang="scss">
.drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  justify-content: flex-end;
  background: rgb(34 28 52 / 28%);
}
.drawer {
  width: min(440px, 100vw);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  box-shadow: -18px 0 40px -28px rgb(80 50 140 / 45%);
}
header,
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
}
footer {
  border-bottom: 0;
  border-top: 1px solid var(--border-color);
  justify-content: flex-end;
}
header h2 {
  margin: 0;
  font-size: 18px;
}
header p,
.hint {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.body {
  flex: 1;
  overflow: auto;
  padding: 18px 20px 28px;
  display: grid;
  gap: 14px;
}
.field {
  display: grid;
  gap: 6px;
}
.field span {
  color: var(--text-tertiary);
  font-size: 12px;
}
.field input,
.field textarea,
.field select {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text-primary);
  background: var(--bg-subtle);
  font: inherit;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.type-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.type-switch button,
.ghost,
.primary {
  border: 0;
  cursor: pointer;
}
.type-switch button {
  height: 36px;
  border-radius: 11px;
  background: var(--bg-subtle);
  color: var(--text-secondary);
}
.type-switch button.active {
  color: var(--primary-color);
  background: var(--primary-soft);
}
.check {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}
.ghost,
.primary {
  height: 36px;
  padding: 0 14px;
  border-radius: 11px;
  font-size: 13px;
}
.ghost {
  background: var(--bg-subtle);
  color: var(--text-secondary);
}
.primary {
  color: white;
  background: var(--primary-color);
}
.primary:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
