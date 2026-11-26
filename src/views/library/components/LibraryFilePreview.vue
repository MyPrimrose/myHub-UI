<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Maximize2, RefreshCw, Shield, X } from 'lucide-vue-next'
import type { LibraryPreview } from '../types/library'
import { formatBytes, formatDate } from '../composables/useLibrary'

const props = defineProps<{
  preview: LibraryPreview | null
  loading?: boolean
  updateTime?: string | null
  error?: string | null
}>()

const emit = defineEmits<{
  close: []
  reload: []
}>()

const fullscreenHost = ref<HTMLElement | null>(null)
const frameHtml = ref('')
const frameKey = ref(0)
const compatMode = ref(false)
const frameError = ref<string | null>(null)

const PREVIEW_SHIM =
  '<scr' +
  'ipt>(function(){try{var m={},fake={getItem:function(k){return Object.prototype.hasOwnProperty.call(m,k)?m[k]:null},setItem:function(k,v){m[k]=String(v)},removeItem:function(k){delete m[k]},clear:function(){m={}},key:function(i){return Object.keys(m)[i]||null},get length(){return Object.keys(m).length}};try{window.localStorage.getItem("__t")}catch(e){try{Object.defineProperty(window,"localStorage",{configurable:true,value:fake});Object.defineProperty(window,"sessionStorage",{configurable:true,value:fake})}catch(_e){}}}catch(e){}})();</scr' +
  'ipt>'

const PREVIEW_CSS =
  '<style id="myhub-preview-adapt">html{scroll-behavior:auto!important}body{overflow:auto!important}@media (max-width:900px){.side{position:static!important;width:auto!important;inset:auto!important}.top,.wrap{margin-left:0!important}}</style>'

function stripScripts(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
}

/** External sync scripts in <head> block first paint (e.g. Mermaid CDN). */
function deferExternalScripts(html: string) {
  return html.replace(/<script\b([^>]*)>/gi, (full, attrs: string) => {
    if (!/\bsrc\s*=/i.test(attrs)) return full
    if (/\b(?:defer|async)\b/i.test(attrs)) return full
    return `<script${attrs} defer>`
  })
}

function injectHead(html: string, snippet: string) {
  if (/<head[\s>]/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${snippet}`)
  }
  if (/<html[\s>]/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${snippet}</head>`)
  }
  return `<!DOCTYPE html><html><head>${snippet}<meta charset="utf-8"></head><body>${html}</body></html>`
}

function prepareHtml(raw: string, stripJs: boolean) {
  let body = stripJs ? stripScripts(raw) : deferExternalScripts(raw)
  if (!/<html[\s>]/i.test(body)) {
    body = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${body}</body></html>`
  }
  body = injectHead(body, PREVIEW_CSS + (stripJs ? '' : PREVIEW_SHIM))
  return body
}

function applyPreview() {
  frameError.value = null
  frameHtml.value = ''
  if (!props.preview?.content) {
    if (props.preview) frameError.value = '预览内容为空，文件可能损坏或编码无法识别。'
    return
  }
  try {
    frameHtml.value = prepareHtml(props.preview.content, compatMode.value)
    frameKey.value += 1
  } catch {
    frameError.value = '无法生成预览，请尝试兼容模式或重新上传。'
  }
}

watch(
  () => props.preview?.id,
  () => {
    compatMode.value = false
  },
)

watch(
  () => [props.preview?.id, props.preview?.content, compatMode.value] as const,
  () => applyPreview(),
  { immediate: true },
)

async function toggleFullscreen() {
  const host = fullscreenHost.value
  if (!host) return
  if (document.fullscreenElement) await document.exitFullscreen()
  else await host.requestFullscreen()
}

const statusLabel = computed(() => (compatMode.value ? '兼容预览' : '安全预览'))

onBeforeUnmount(() => {
  if (document.fullscreenElement) void document.exitFullscreen()
})
</script>

<template>
  <section ref="fullscreenHost" class="preview-panel">
    <template v-if="preview || loading || error">
      <div class="preview-head">
        <div>
          <h3>{{ preview?.name || '预览' }}</h3>
          <p v-if="preview">
            {{ formatBytes(preview.fileSize) }} · 更新 {{ formatDate(updateTime) }}
            <span class="ok">{{ statusLabel }}</span>
          </p>
        </div>
        <div class="ops">
          <button
            type="button"
            :class="{ active: compatMode }"
            title="兼容模式：禁用脚本，适合空白页"
            @click="compatMode = !compatMode"
          >
            <Shield :size="15" />
          </button>
          <button type="button" title="重新加载" @click="emit('reload')">
            <RefreshCw :size="15" />
          </button>
          <button type="button" title="全屏" @click="toggleFullscreen">
            <Maximize2 :size="15" />
          </button>
          <button type="button" title="关闭预览" @click="emit('close')">
            <X :size="15" />
          </button>
        </div>
      </div>
      <div v-if="loading" class="state">正在加载预览…</div>
      <div v-else-if="error || frameError" class="state">
        <h3>预览失败</h3>
        <p>{{ error || frameError }}</p>
        <button type="button" class="retry" @click="compatMode = true">启用兼容模式</button>
      </div>
      <iframe
        v-else-if="frameHtml"
        :key="frameKey"
        class="frame"
        title="HTML 预览"
        sandbox="allow-scripts allow-forms allow-modals allow-popups"
        referrerpolicy="no-referrer"
        :srcdoc="frameHtml"
      ></iframe>
      <p class="hint">
        外链脚本已改为延迟加载，避免 CDN 卡住白屏。若仍空白，点盾牌开启兼容模式（禁用脚本）。
      </p>
    </template>
    <div v-else class="state empty">
      <h3>选择一个 HTML 页面</h3>
      <p>从左侧目录或中间列表打开页面后，将在这里安全预览。</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.preview-panel {
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 14px;
  border: 1px solid #efeaf8;
  border-radius: 20px;
  background: white;
}
.preview-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.preview-head h3 {
  margin: 0;
  font-size: 15px;
}
.preview-head p {
  margin: 6px 0 0;
  color: #9a93b2;
  font-size: 12px;
}
.ok {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  color: #3f9f8a;
  background: #e8f8f2;
  font-size: 11px;
}
.ops {
  display: flex;
  gap: 6px;
}
.ops button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid #efeaf8;
  border-radius: 10px;
  background: #faf8ff;
  color: #7d7696;
  cursor: pointer;
}
.ops button.active {
  color: #8b6df0;
  background: #efe8ff;
  border-color: #ddd4f5;
}
.frame {
  flex: 1;
  min-height: 360px;
  width: 100%;
  border: 1px solid #efeaf8;
  border-radius: 16px;
  background: #fff;
}
.hint {
  margin: 10px 0 0;
  color: #b1aac6;
  font-size: 11px;
  line-height: 1.5;
}
.state {
  flex: 1;
  display: grid;
  place-content: center;
  text-align: center;
  color: #9a93b2;
  min-height: 320px;
  gap: 8px;
}
.state h3 {
  margin: 0;
  color: #3c3554;
}
.state p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}
.retry {
  justify-self: center;
  height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: 11px;
  color: white;
  background: #8b6df0;
  cursor: pointer;
}
:global(:root[data-theme='dark']) .preview-panel {
  background: rgb(45 41 59 / 88%);
  border-color: var(--border-color);
}
</style>
