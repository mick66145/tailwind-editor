<script setup>
import { computed, ref } from 'vue'
import { useEditor } from '../../composables/useEditor'
import { useNotification } from '../../composables/useNotification'
import { PhX, PhCopy, PhCode } from '@phosphor-icons/vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const { generateHtml } = useEditor()
const { addToast } = useNotification()

const htmlCode = computed(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Page</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body class="bg-white text-gray-900 font-sans antialiased">
${generateHtml()}
</body>
</html>`
})

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(htmlCode.value)
        addToast('Code copied to clipboard!', 'success')
    } catch (err) {
        addToast('Failed to copy code.', 'error')
    }
}

const close = () => {
    emit('update:modelValue', false)
}
</script>

<template>
    <div v-if="modelValue"
        class="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
        <div
            class="bg-editor-bg border border-editor-border rounded-lg shadow-2xl w-[800px] h-[600px] flex flex-col overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-editor-border bg-editor-bg-lighter">
                <div class="flex items-center gap-2">
                    <PhCode class="text-editor-accent" size="20" />
                    <h3 class="font-semibold text-editor-text">Export HTML</h3>
                </div>
                <button @click="close" class="text-editor-text-muted hover:text-white transition-colors">
                    <PhX size="20" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 p-0 relative">
                <textarea readonly
                    class="w-full h-full bg-editor-bg text-gray-300 font-mono text-sm p-4 outline-none resize-none selection:bg-editor-accent/30"
                    :value="htmlCode"></textarea>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-editor-border flex justify-end gap-3 bg-editor-bg-lighter">
                <button @click="close"
                    class="px-4 py-2 rounded text-editor-text hover:bg-editor-bg transition-colors text-sm">Close</button>
                <button @click="copyToClipboard"
                    class="px-4 py-2 rounded bg-editor-accent text-white hover:bg-editor-accent-hover transition-colors text-sm font-medium flex items-center gap-2">
                    <PhCopy size="16" /> Copy Code
                </button>
            </div>

        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
