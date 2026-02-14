<script setup>
import { ref, onMounted } from 'vue'
import { useEditor } from '../../composables/useEditor'
import { useNotification } from '../../composables/useNotification'
import ExportModal from './ExportModal.vue'
import DesignAnalyzerModal from './DesignAnalyzerModal.vue'
import {
    PhEye,
    PhEyeSlash,
    PhExport,
    PhFloppyDisk,
    PhFolderOpen,
    PhList,
    PhDesktop,
    PhDeviceTablet,
    PhDeviceMobile,
    PhTrash,
    PhMagicWand
} from '@phosphor-icons/vue'

const { isPreview, deviceMode, saveToLocalStorage, loadFromLocalStorage, clearCanvas } = useEditor()
const { addToast } = useNotification()

const showExportModal = ref(false)
const showAnalyzerModal = ref(false)

// Actions
const handleSave = () => {
    if (saveToLocalStorage()) {
        addToast('Layout saved successfully!', 'success')
    } else {
        addToast('Failed to save layout.', 'error')
    }
}

const handleLoad = () => {
    if (confirm('Load saved layout? Current changes will be lost.')) {
        if (loadFromLocalStorage()) {
            addToast('Layout loaded!', 'success')
        } else {
            addToast('No saved layout found.', 'info')
        }
    }
}

const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
        clearCanvas()
        addToast('Canvas cleared.', 'info')
    }
}

const handleExport = () => {
    showExportModal.value = true
}

// Auto load on mount?
onMounted(() => {
    // Optional: Auto load or prompt? Let's leave it manual for now.
})
</script>

<template>
    <div
        class="h-12 bg-editor-bg border-b border-editor-border flex items-center justify-between px-4 z-50 relative shadow-sm select-none">

        <!-- Left: Branding -->
        <div class="flex items-center gap-4">
            <button class="text-editor-text-muted hover:text-white transition-colors">
                <PhList :size="20" />
            </button>
            <div class="flex items-center gap-2">
                <div
                    class="w-7 h-7 bg-editor-accent rounded-sm flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    T
                </div>
                <h1 class="font-semibold text-editor-text text-sm hidden md:block tracking-wide">Tailwind Editor</h1>
            </div>
        </div>

        <!-- Center: Responsive Controls -->
        <div
            class="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-editor-bg-lighter rounded-sm border border-editor-border p-0.5">
            <button @click="deviceMode = 'desktop'"
                :class="['p-1.5 rounded-sm transition-colors', deviceMode === 'desktop' ? 'bg-editor-border text-editor-text shadow-sm' : 'text-editor-text-muted hover:text-editor-text hover:bg-editor-border']"
                title="Desktop">
                <PhDesktop :size="18" />
            </button>
            <button @click="deviceMode = 'tablet'"
                :class="['p-1.5 rounded-sm transition-colors', deviceMode === 'tablet' ? 'bg-editor-border text-editor-text shadow-sm' : 'text-editor-text-muted hover:text-editor-text hover:bg-editor-border']"
                title="Tablet">
                <PhDeviceTablet :size="18" />
            </button>
            <button @click="deviceMode = 'mobile'"
                :class="['p-1.5 rounded-sm transition-colors', deviceMode === 'mobile' ? 'bg-editor-border text-editor-text shadow-sm' : 'text-editor-text-muted hover:text-editor-text hover:bg-editor-border']"
                title="Mobile">
                <PhDeviceMobile :size="18" />
            </button>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 border-r border-editor-border pr-3">
                <button @click="handleClear"
                    class="p-2 text-editor-text-muted hover:text-red-400 transition-colors tooltip-btn"
                    title="Clear Canvas">
                    <PhTrash :size="18" />
                </button>
                <div class="w-px h-4 bg-editor-border mx-1"></div>
                <button @click="handleSave"
                    class="p-2 text-editor-text-muted hover:text-editor-accent transition-colors tooltip-btn"
                    title="Save">
                    <PhFloppyDisk :size="18" />
                </button>
                <button @click="handleLoad"
                    class="p-2 text-editor-text-muted hover:text-editor-accent transition-colors tooltip-btn"
                    title="Load">
                    <PhFolderOpen :size="18" />
                </button>
            </div>

            <button @click="isPreview = !isPreview"
                :class="['h-8 px-3 rounded-sm flex items-center gap-2 text-xs font-medium transition-all', isPreview ? 'bg-editor-accent text-white' : 'bg-transparent text-editor-accent border border-editor-accent hover:bg-editor-accent hover:text-white']">
                <component :is="isPreview ? PhEyeSlash : PhEye" :size="16" />
                <span>{{ isPreview ? 'Edit' : 'Preview' }}</span>
            </button>

            <button @click="showAnalyzerModal = true"
                class="h-8 px-3 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-sm hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-sm"
                title="AI 設計圖分析">
                <PhMagicWand :size="16" />
                <span>AI 分析</span>
            </button>

            <button @click="handleExport"
                class="h-8 px-3 bg-white text-editor-bg text-xs font-semibold rounded-sm hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-sm">
                <PhExport :size="16" />
                <span>Publish</span>
            </button>
        </div>

        <!-- Design Analyzer Modal -->
        <DesignAnalyzerModal v-model="showAnalyzerModal" />

        <!-- Export Modal Component -->
        <ExportModal v-model="showExportModal" />

    </div>
</template>
