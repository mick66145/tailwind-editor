<script setup>
import {
    PhTextT,
    PhTextAlignLeft,
    PhTextAlignCenter,
    PhTextAlignRight,
    PhTextAlignJustify,
    PhTextB,
    PhTextItalic,
    PhTextUnderline
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

// Options
const fontSizes = [
    { label: 'XS', value: 'text-xs' },
    { label: 'SM', value: 'text-sm' },
    { label: 'Base', value: 'text-base' },
    { label: 'LG', value: 'text-lg' },
    { label: 'XL', value: 'text-xl' },
    { label: '2XL', value: 'text-2xl' },
    { label: '3XL', value: 'text-3xl' },
    { label: '4XL', value: 'text-4xl' },
    { label: '6XL', value: 'text-6xl' },
]

const fontWeights = [
    { label: 'Light', value: 'font-light' },
    { label: 'Normal', value: 'font-normal' },
    { label: 'Medium', value: 'font-medium' },
    { label: 'SemiBold', value: 'font-semibold' },
    { label: 'Bold', value: 'font-bold' },
]

const aligns = [
    { icon: PhTextAlignLeft, value: 'text-left' },
    { icon: PhTextAlignCenter, value: 'text-center' },
    { icon: PhTextAlignRight, value: 'text-right' },
    { icon: PhTextAlignJustify, value: 'text-justify' },
]

</script>

<template>
    <div class="space-y-4 border-b border-editor-border pb-4 last:border-0">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2">
            <PhTextT class="text-editor-accent" />
            <span class="text-xs font-semibold text-editor-text uppercase tracking-wider">Typography</span>
        </div>

        <!-- Size & Weight Row -->
        <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
                <label class="text-[10px] text-editor-text-muted">Size</label>
                <select :value="modelValue.size" @change="e => e.target && updateClass('size', e.target.value)"
                    class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text rounded-sm px-2 py-1.5 focus:border-editor-accent outline-none">
                    <option value="">Default</option>
                    <option v-for="opt in fontSizes" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
            </div>
            <div class="space-y-1">
                <label class="text-[10px] text-editor-text-muted">Weight</label>
                <select :value="modelValue.weight" @change="e => e.target && updateClass('weight', e.target.value)"
                    class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text rounded-sm px-2 py-1.5 focus:border-editor-accent outline-none">
                    <option value="">Default</option>
                    <option v-for="opt in fontWeights" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
            </div>
        </div>

        <!-- Alignment -->
        <div class="space-y-1">
            <label class="text-[10px] text-editor-text-muted">Alignment</label>
            <div class="flex bg-editor-input-bg rounded-sm border border-editor-input-border p-0.5">
                <button v-for="align in aligns" :key="align.value" @click="updateClass('align', align.value)"
                    :class="['flex-1 p-1 flex justify-center rounded-sm transition-colors', modelValue.align === align.value ? 'bg-editor-accent text-white' : 'text-editor-text-muted hover:text-white hover:bg-editor-border']">
                    <component :is="align.icon" size="14" />
                </button>
            </div>
        </div>

        <!-- Decoration (Style) -->
        <div class="space-y-1">
            <label class="text-[10px] text-editor-text-muted">Style</label>
            <div class="flex gap-2">
                <button @click="updateClass('italic', modelValue.italic === 'italic' ? '' : 'italic')"
                    :class="['p-1.5 rounded-sm border border-editor-input-border transition-colors', modelValue.italic === 'italic' ? 'bg-editor-accent border-editor-accent text-white' : 'bg-editor-input-bg text-editor-text-muted hover:text-white']"
                    title="Italic">
                    <PhTextItalic size="14" />
                </button>
                <button @click="updateClass('decoration', modelValue.decoration === 'underline' ? '' : 'underline')"
                    :class="['p-1.5 rounded-sm border border-editor-input-border transition-colors', modelValue.decoration === 'underline' ? 'bg-editor-accent border-editor-accent text-white' : 'bg-editor-input-bg text-editor-text-muted hover:text-white']"
                    title="Underline">
                    <PhTextUnderline size="14" />
                </button>
                <button @click="updateClass('uppercase', modelValue.uppercase === 'uppercase' ? '' : 'uppercase')"
                    :class="['p-1.5 rounded-sm border border-editor-input-border transition-colors font-bold text-[10px] w-8', modelValue.uppercase === 'uppercase' ? 'bg-editor-accent border-editor-accent text-white' : 'bg-editor-input-bg text-editor-text-muted hover:text-white']"
                    title="Uppercase">
                    TT
                </button>
            </div>
        </div>

    </div>
</template>
