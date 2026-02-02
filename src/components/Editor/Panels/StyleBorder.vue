<script setup>
import {
    PhCornersIn,
    PhBoundingBox
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
    if (category === 'borderWidth') {
        // If adding border width, ensure we have a color default if none
        if (value && !newTw.borderColor) {
            newTw.borderColor = 'border-gray-300' // Default color
        }
        if (!value) {
            // If removing border, maybe clear color? Optional.
        }
    }
    emit('update:modelValue', newTw)
}

const radii = [
    { label: 'None', value: '' },
    { label: 'S', value: 'rounded-sm' },
    { label: 'M', value: 'rounded-md' },
    { label: 'L', value: 'rounded-lg' },
    { label: 'XL', value: 'rounded-xl' },
    { label: 'Full', value: 'rounded-full' },
]

const borderWidths = [
    { label: '0', value: '' },
    { label: '1', value: 'border' },
    { label: '2', value: 'border-2' },
    { label: '4', value: 'border-4' },
    { label: '8', value: 'border-8' },
]

const borderColors = [
    { label: 'Gray', value: 'border-gray-200' },
    { label: 'Dark', value: 'border-gray-800' },
    { label: 'Blue', value: 'border-blue-500' },
    { label: 'Red', value: 'border-red-500' },
]
</script>

<template>
    <div class="space-y-4 border-b border-editor-border pb-4 last:border-0">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2">
            <PhCornersIn class="text-editor-accent" />
            <span class="text-xs font-semibold text-editor-text uppercase tracking-wider">Border</span>
        </div>

        <!-- Radius -->
        <div class="space-y-1">
            <label class="text-[10px] text-editor-text-muted">Radius</label>
            <div class="flex flex-wrap gap-1">
                <button v-for="r in radii" :key="r.value" @click="updateClass('rounded', r.value)"
                    :class="['text-[10px] px-2 py-1 rounded-sm border transition-colors', props.modelValue.rounded === r.value ? 'bg-editor-accent border-editor-accent text-white' : 'bg-editor-input-bg border-editor-input-border text-editor-text-muted hover:text-white']">
                    {{ r.label }}
                </button>
            </div>
        </div>

        <!-- Warning/Tip: Border needs 'border' property to show up -->
        <div class="grid grid-cols-2 gap-2">
            <!-- Width -->
            <div class="space-y-1">
                <label class="text-[10px] text-editor-text-muted">Width</label>
                <select :value="modelValue.borderWidth"
                    @change="e => e.target && updateClass('borderWidth', e.target.value)"
                    class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text rounded-sm px-2 py-1.5 focus:border-editor-accent outline-none">
                    <option v-for="w in borderWidths" :key="w.value" :value="w.value">{{ w.label }}px</option>
                </select>
            </div>

            <!-- Color -->
            <div class="space-y-1" v-if="modelValue.borderWidth">
                <label class="text-[10px] text-editor-text-muted">Color</label>
                <div class="flex gap-1">
                    <button v-for="c in borderColors" :key="c.value" @click="updateClass('borderColor', c.value)"
                        :class="['w-5 h-5 rounded-full border shadow-sm', c.value.replace('border-', 'bg-'), modelValue.borderColor === c.value ? 'ring-1 ring-white' : 'border-transparent']"></button>
                </div>
            </div>
        </div>

        <!-- Shadow ?? -->
        <div class="space-y-1 mt-2">
            <label class="text-[10px] text-editor-text-muted">Shadow</label>
            <div class="flex gap-2">
                <button @click="updateClass('shadow', modelValue.shadow ? '' : 'shadow-lg')"
                    :class="['text-xs px-3 py-1 border rounded-sm transition-colors', modelValue.shadow ? 'bg-editor-accent border-editor-accent text-white' : 'bg-editor-input-bg border-editor-input-border text-editor-text-muted']">
                    {{ modelValue.shadow ? 'On' : 'Off' }}
                </button>
            </div>
        </div>

    </div>
</template>
