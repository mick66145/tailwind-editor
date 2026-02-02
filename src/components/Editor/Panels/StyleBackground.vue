<script setup>
import {
    PhPaintBucket,
    PhImage
} from '@phosphor-icons/vue'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const updateClass = (category, value) => {
    const newTw = { ...props.modelValue, [category]: value }
    emit('update:modelValue', newTw)
}


const colors = [
    { label: 'None', value: '' },
    { label: 'White', value: 'bg-white' },
    { label: 'Slate', value: 'bg-slate-100' },
    { label: 'Format Dark', value: 'bg-editor-bg', preview: '#1e1e1e' }, // Custom
    { label: 'Zinc', value: 'bg-zinc-800' },
    { label: 'Red', value: 'bg-red-500' },
    { label: 'Orange', value: 'bg-orange-500' },
    { label: 'Amber', value: 'bg-amber-500' },
    { label: 'Green', value: 'bg-green-500' },
    { label: 'Blue', value: 'bg-blue-600' },
    { label: 'Indigo', value: 'bg-indigo-600' },
    { label: 'Violet', value: 'bg-violet-600' },
    { label: 'Pink', value: 'bg-pink-500' },
]

// Extract URL from bg-[url('...')]
const getBgImage = (bgClass) => {
    if (!bgClass || !bgClass.includes('bg-[url')) return ''
    const match = bgClass.match(/bg-\[url\('?(.*?)'?\)\]/)
    return match ? match[1] : ''
}

const updateBgImage = (url) => {
    const newTw = { ...props.modelValue }

    if (!url) {
        // Clear bg image class but keep color if any? 
        // Current logic puts everything in 'bg'. 
        // If we want mixed color + image, we need separate keys or handling.
        // For now, assume BG is either Color OR Image for this simple input.
        newTw.bg = ''
        newTw.bgSize = ''
        newTw.bgPosition = ''
    } else {
        // Tailwind arbitrary value format
        newTw.bg = `bg-[url('${url}')]`
        // Default to cover/center if new image
        if (!newTw.bgSize) newTw.bgSize = 'bg-cover'
        if (!newTw.bgPosition) newTw.bgPosition = 'bg-center'
    }
    emit('update:modelValue', newTw)
}
</script>

<template>
    <div class="space-y-4 border-b border-editor-border pb-4 last:border-0">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2">
            <PhPaintBucket class="text-editor-accent" />
            <span class="text-xs font-semibold text-editor-text uppercase tracking-wider">Background</span>
        </div>

        <!-- Color Grid -->
        <div class="space-y-2">
            <label class="text-[10px] text-editor-text-muted">Color</label>
            <div class="flex flex-wrap gap-2">
                <button v-for="c in colors" :key="c.label" @click="updateClass('bg', c.value)"
                    :class="['w-6 h-6 rounded-full border border-editor-input-border hover:scale-110 transition-transform relative', c.value.replace('bg-', 'bg-')]"
                    :title="c.label" :style="{ backgroundColor: c.label === 'None' ? 'transparent' : '' }">
                    <div v-if="c.label === 'None'" class="absolute inset-0 border-r border-red-500 transform rotate-45">
                    </div>
                </button>
            </div>
        </div>

        <!-- Background Image -->
        <div class="pt-2 border-t border-editor-border mt-2">
            <label class="text-[10px] text-editor-text-muted mb-1 block">Image URL</label>
            <input type="text" :value="getBgImage(modelValue.bg)" @input="e => updateBgImage(e.target.value)"
                placeholder="https://..."
                class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text rounded-sm px-2 py-1.5 focus:border-editor-accent outline-none" />
            <div class="mt-2 flex gap-2">
                <label class="flex items-center gap-1 text-[10px] text-editor-text-muted cursor-pointer">
                    <input type="checkbox" :checked="modelValue.bgSize === 'bg-cover'"
                        @change="e => updateClass('bgSize', e.target.checked ? 'bg-cover' : '')"
                        class="accent-editor-accent"> Cover
                </label>
                <label class="flex items-center gap-1 text-[10px] text-editor-text-muted cursor-pointer">
                    <input type="checkbox" :checked="modelValue.bgPosition === 'bg-center'"
                        @change="e => updateClass('bgPosition', e.target.checked ? 'bg-center' : '')"
                        class="accent-editor-accent"> Center
                </label>
            </div>
        </div>

    </div>
</template>
