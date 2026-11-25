<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

const props = withDefaults(
  defineProps<{ title?: string; message: string; confirmText?: string }>(),
  {
    title: '请确认',
    confirmText: '确认',
  },
)
const emit = defineEmits<{ confirmed: [] }>()

async function open() {
  try {
    await ElMessageBox.confirm(props.message, props.title, {
      confirmButtonText: props.confirmText,
      cancelButtonText: '取消',
      type: 'warning',
    })
    emit('confirmed')
  } catch {
    /* The user dismissed the dialog. */
  }
}

defineExpose({ open })
</script>

<template><slot :open="open" /></template>
