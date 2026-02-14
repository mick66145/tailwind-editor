<script setup>
import { ref, computed, h, defineComponent } from 'vue'
import { useDesignAnalyzer } from '../../composables/useDesignAnalyzer'
import { useEditor } from '../../composables/useEditor'
import { useNotification } from '../../composables/useNotification'
import {
  PhX,
  PhUploadSimple,
  PhSpinner,
  PhEye,
  PhEyeSlash,
  PhGear,
  PhTreeStructure,
  PhArrowRight,
  PhWarning,
  PhCheckCircle,
  PhArrowCounterClockwise,
  PhDownloadSimple
} from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const {
  apiKey, apiBaseUrl, apiModel,
  isAnalyzing, analysisResult, analysisError, progressText,
  analyzeDesignImage, resetAnalysis, countNodes
} = useDesignAnalyzer()

const { importComponents } = useEditor()
const { addToast } = useNotification()

// 本地狀態
const imageFile = ref(null)
const imagePreview = ref('')
const showApiKey = ref(false)
const showSettings = ref(false)
const showJsonPreview = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)

// 步驟控制
const currentStep = computed(() => {
  if (analysisResult.value) return 'result'
  if (isAnalyzing.value) return 'analyzing'
  return 'upload'
})

const nodeCount = computed(() => {
  return analysisResult.value ? countNodes(analysisResult.value) : 0
})

const containerCount = computed(() => {
  if (!analysisResult.value) return 0
  const count = (nodes) => nodes.reduce((acc, n) => {
    return acc + (n.type === 'container' ? 1 : 0) + (n.children ? count(n.children) : 0)
  }, 0)
  return count(analysisResult.value)
})

const close = () => {
  emit('update:modelValue', false)
  setTimeout(() => {
    resetAnalysis()
    imageFile.value = null
    imagePreview.value = ''
    showJsonPreview.value = false
  }, 300)
}

const onFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) setFile(file)
}

const setFile = (file) => {
  if (!file.type.startsWith('image/')) {
    addToast('請上傳圖片檔案', 'error')
    return
  }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { imagePreview.value = e.target.result }
  reader.readAsDataURL(file)
  resetAnalysis()
}

const onDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}
const onDragLeave = () => { isDragging.value = false }
const onDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) setFile(file)
}

const startAnalysis = async () => {
  if (!imageFile.value) {
    addToast('請先上傳設計圖', 'error')
    return
  }
  if (!apiKey.value) {
    showSettings.value = true
    addToast('請先設定 API Key', 'error')
    return
  }
  await analyzeDesignImage(imageFile.value)
}

const handleImport = () => {
  if (!analysisResult.value) return
  const count = importComponents(analysisResult.value)
  addToast(`成功匯入 ${count} 個元件到畫布！`, 'success')
  close()
}

const handleRetry = () => {
  resetAnalysis()
  if (imageFile.value) {
    startAnalysis()
  }
}

const formattedJson = computed(() => {
  if (!analysisResult.value) return ''
  return JSON.stringify(analysisResult.value, null, 2)
})

// 取得樹節點標籤
const getNodeLabel = (node) => {
  if (node.type === 'text') return `📝 "${(node.props?.text || '').slice(0, 25)}${(node.props?.text || '').length > 25 ? '...' : ''}"`
  if (node.type === 'button') return `🔘 "${node.props?.text || 'Button'}"`
  if (node.type === 'image') return '🖼️ Image'
  if (node.type === 'container') return `📦 Container`
  if (node.type === 'divider') return '➖ Divider'
  if (node.type === 'icon') return '⭐ Icon'
  return `❓ ${node.type}`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue"
        class="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click.self="close">

        <div
          class="bg-[#1e1e2e] border border-[#313244] rounded-2xl shadow-2xl w-[95vw] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-modal-in">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#313244]">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <PhTreeStructure :size="22" class="text-white" />
              </div>
              <div>
                <h2 class="text-white font-bold text-lg">AI 設計圖分析</h2>
                <p class="text-[#a6adc8] text-xs">上傳設計圖 → AI 自動辨識 → 轉換為可編輯元件</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="showSettings = !showSettings"
                :class="['p-2 rounded-lg transition-all', showSettings ? 'bg-[#313244] text-purple-400' : 'text-[#6c7086] hover:text-white hover:bg-[#313244]']">
                <PhGear :size="20" />
              </button>
              <button @click="close"
                class="p-2 rounded-lg text-[#6c7086] hover:text-white hover:bg-[#313244] transition-colors">
                <PhX :size="20" />
              </button>
            </div>
          </div>

          <!-- Settings Panel -->
          <Transition name="slide">
            <div v-if="showSettings" class="px-6 py-4 bg-[#181825] border-b border-[#313244]">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-[#a6adc8] text-xs font-semibold mb-1.5">API Key</label>
                  <div class="relative">
                    <input :type="showApiKey ? 'text' : 'password'" v-model="apiKey"
                      placeholder="sk-..."
                      class="w-full bg-[#1e1e2e] border border-[#313244] text-white text-sm rounded-lg px-3 py-2 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none" />
                    <button @click="showApiKey = !showApiKey"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-[#6c7086] hover:text-white">
                      <component :is="showApiKey ? PhEyeSlash : PhEye" :size="16" />
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-[#a6adc8] text-xs font-semibold mb-1.5">API Base URL</label>
                  <input v-model="apiBaseUrl"
                    placeholder="https://api.openai.com/v1"
                    class="w-full bg-[#1e1e2e] border border-[#313244] text-white text-sm rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label class="block text-[#a6adc8] text-xs font-semibold mb-1.5">Model</label>
                  <input v-model="apiModel"
                    placeholder="gpt-4o"
                    class="w-full bg-[#1e1e2e] border border-[#313244] text-white text-sm rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none" />
                </div>
              </div>
            </div>
          </Transition>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6">

            <!-- STEP: Upload -->
            <div v-if="currentStep === 'upload'" class="flex flex-col gap-6">
              <div @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop"
                :class="['border-2 border-dashed rounded-2xl transition-all cursor-pointer relative overflow-hidden',
                  isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-[#313244] hover:border-[#45475a] bg-[#181825]',
                  imagePreview ? 'p-4' : 'p-12']"
                @click="fileInput.click()">

                <input ref="fileInput" type="file" accept="image/*" @change="onFileSelect" class="hidden" />

                <div v-if="imagePreview" class="flex gap-6">
                  <div class="shrink-0 w-72 h-52 rounded-xl overflow-hidden bg-[#11111b] border border-[#313244]">
                    <img :src="imagePreview" class="w-full h-full object-contain" />
                  </div>
                  <div class="flex flex-col justify-center gap-3">
                    <p class="text-white font-semibold">{{ imageFile?.name }}</p>
                    <p class="text-[#a6adc8] text-sm">{{ (imageFile?.size / 1024 / 1024).toFixed(2) }} MB</p>
                    <button @click.stop="imageFile = null; imagePreview = ''"
                      class="text-red-400 text-sm hover:text-red-300 self-start">
                      移除圖片
                    </button>
                  </div>
                </div>

                <div v-else class="flex flex-col items-center gap-4 text-center">
                  <div class="w-20 h-20 rounded-2xl bg-[#313244] flex items-center justify-center">
                    <PhUploadSimple :size="36" class="text-[#6c7086]" />
                  </div>
                  <div>
                    <p class="text-white font-semibold text-lg">拖拉圖片至此，或點擊上傳</p>
                    <p class="text-[#6c7086] text-sm mt-1">支援 PNG、JPG、WebP 等圖片格式</p>
                  </div>
                </div>
              </div>

              <div v-if="analysisError"
                class="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <PhWarning :size="20" class="text-red-400 shrink-0" />
                <p class="text-red-300 text-sm">{{ analysisError }}</p>
              </div>

              <div class="flex items-center justify-end gap-3">
                <button @click="close"
                  class="px-5 py-2.5 text-[#a6adc8] hover:text-white transition-colors text-sm font-medium">
                  取消
                </button>
                <button @click="startAnalysis"
                  :disabled="!imageFile"
                  :class="['px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg',
                    imageFile ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/25' : 'bg-[#313244] text-[#6c7086] cursor-not-allowed']">
                  <PhArrowRight :size="18" />
                  開始分析
                </button>
              </div>
            </div>

            <!-- STEP: Analyzing -->
            <div v-if="currentStep === 'analyzing'" class="flex flex-col items-center justify-center py-20 gap-6">
              <div class="relative">
                <div class="w-24 h-24 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <PhSpinner :size="48" class="text-purple-400 animate-spin" />
                </div>
                <div class="absolute inset-0 rounded-full bg-purple-500/10 animate-ping"></div>
              </div>
              <div class="text-center">
                <p class="text-white font-semibold text-lg">AI 正在分析設計圖...</p>
                <p class="text-[#a6adc8] text-sm mt-2">{{ progressText }}</p>
              </div>
              <p class="text-[#6c7086] text-xs">這可能需要 10~30 秒，取決於圖片複雜度</p>
            </div>

            <!-- STEP: Result -->
            <div v-if="currentStep === 'result'" class="flex flex-col gap-6">
              <div class="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <PhCheckCircle :size="24" class="text-green-400 shrink-0" />
                <div>
                  <p class="text-green-300 font-semibold">分析完成！</p>
                  <p class="text-green-300/70 text-sm">共辨識 {{ nodeCount }} 個元件，{{ containerCount }} 個容器區塊</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 原圖 -->
                <div class="bg-[#181825] border border-[#313244] rounded-xl p-3">
                  <p class="text-[#a6adc8] text-xs font-semibold mb-2">📷 原始設計圖</p>
                  <div class="rounded-lg overflow-hidden bg-[#11111b] border border-[#313244]">
                    <img :src="imagePreview" class="w-full h-auto max-h-80 object-contain" />
                  </div>
                </div>

                <!-- 元件樹：使用簡易縮排列表 -->
                <div class="bg-[#181825] border border-[#313244] rounded-xl p-3 max-h-[420px] overflow-y-auto custom-scrollbar">
                  <p class="text-[#a6adc8] text-xs font-semibold mb-2">🌳 元件結構樹</p>
                  <div class="text-sm font-mono space-y-0.5">
                    <template v-for="(node, i) in analysisResult" :key="i">
                      <div class="text-[#cdd6f4] text-xs py-0.5">
                        {{ getNodeLabel(node) }}
                        <span v-if="node.children?.length" class="text-[#6c7086]"> ({{ node.children.length }})</span>
                      </div>
                      <template v-for="(child, j) in (node.children || [])" :key="j">
                        <div class="text-[#cdd6f4] text-xs py-0.5" :style="{ paddingLeft: '16px' }">
                          {{ getNodeLabel(child) }}
                          <span v-if="child.children?.length" class="text-[#6c7086]"> ({{ child.children.length }})</span>
                        </div>
                        <template v-for="(grandchild, k) in (child.children || [])" :key="k">
                          <div class="text-[#cdd6f4] text-xs py-0.5" :style="{ paddingLeft: '32px' }">
                            {{ getNodeLabel(grandchild) }}
                            <span v-if="grandchild.children?.length" class="text-[#6c7086]"> ({{ grandchild.children.length }})</span>
                          </div>
                          <template v-for="(gc, l) in (grandchild.children || [])" :key="l">
                            <div class="text-[#89b4fa] text-xs py-0.5" :style="{ paddingLeft: '48px' }">
                              {{ getNodeLabel(gc) }}
                            </div>
                          </template>
                        </template>
                      </template>
                    </template>
                  </div>
                </div>
              </div>

              <!-- JSON 預覽 -->
              <div>
                <button @click="showJsonPreview = !showJsonPreview"
                  class="text-[#a6adc8] text-xs hover:text-white flex items-center gap-1 mb-2">
                  <span>{{ showJsonPreview ? '▼' : '▶' }}</span>
                  <span>{{ showJsonPreview ? '隱藏' : '查看' }} JSON 原始碼</span>
                </button>
                <Transition name="slide">
                  <div v-if="showJsonPreview"
                    class="bg-[#11111b] border border-[#313244] rounded-xl p-4 max-h-60 overflow-auto custom-scrollbar">
                    <pre class="text-[#cdd6f4] text-xs leading-relaxed whitespace-pre-wrap break-all">{{ formattedJson }}</pre>
                  </div>
                </Transition>
              </div>

              <div class="flex items-center justify-between">
                <button @click="handleRetry"
                  class="px-4 py-2.5 text-[#a6adc8] hover:text-white border border-[#313244] hover:border-[#45475a] rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                  <PhArrowCounterClockwise :size="16" />
                  重新分析
                </button>
                <button @click="handleImport"
                  class="px-6 py-2.5 rounded-xl font-semibold text-sm bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 flex items-center gap-2 transition-all">
                  <PhDownloadSimple :size="18" />
                  匯入到畫布 ({{ nodeCount }} 個元件)
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.animate-modal-in {
  animation: modalIn 0.3s ease-out;
}
@keyframes modalIn {
  from { transform: scale(0.95) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #45475a;
  border-radius: 4px;
}
</style>
