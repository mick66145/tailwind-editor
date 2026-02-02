<script setup>
import {
    PhLayout,
    PhAlignLeft,
    PhAlignCenterHorizontal,
    PhAlignRight,
    PhArrowsOutLineHorizontal,
    PhRows,
    PhColumns
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
    // Ensure 'flex' display is implied or added?
    // Current 'RecursiveBlock' logic joins all classes.
    // Ideally if user sets 'justify-center', we should ensure 'flex' is present if not 'grid'.
    // But let's assume the user selects a "Layout Mode" first.
    emit('update:modelValue', newTw)
}

const displayModes = [
    { label: 'Block', value: 'block' },
    { label: 'Flex', value: 'flex' },
    { label: 'Grid', value: 'grid' },
]

// Flex Logic
const directions = [
    { label: 'Row', value: 'flex-row', icon: PhColumns },
    { label: 'Col', value: 'flex-col', icon: PhRows },
]

const justifies = [
    { label: 'Start', value: 'justify-start', icon: PhAlignLeft },
    { label: 'Center', value: 'justify-center', icon: PhAlignCenterHorizontal },
    { label: 'End', value: 'justify-end', icon: PhAlignRight },
    { label: 'Between', value: 'justify-between', icon: PhArrowsOutLineHorizontal },
]

const items = [
    { label: 'Start', value: 'items-start', icon: PhAlignLeft }, // Icons aren't perfect match but ok
    { label: 'Center', value: 'items-center', icon: PhAlignCenterHorizontal },
    { label: 'End', value: 'items-end', icon: PhAlignRight },
]

</script>

<template>
    <div class="space-y-4 border-b border-editor-border pb-4 last:border-0">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2">
            <PhLayout class="text-editor-accent" />
            <span class="text-xs font-semibold text-editor-text uppercase tracking-wider">Layout</span>
        </div>

        <!-- Display Mode -->
        <div class="space-y-1">
            <label class="text-[10px] text-editor-text-muted">Display</label>
            <div class="flex bg-editor-input-bg rounded-sm border border-editor-input-border p-0.5">
                <button v-for="d in displayModes" :key="d.value" @click="updateClass('display', d.value)"
                    :class="['flex-1 text-[10px] py-1 rounded-sm transition-colors uppercase font-medium', props.modelValue.display === d.value ? 'bg-editor-accent text-white' : 'text-editor-text-muted hover:text-white hover:bg-editor-border']">
                    {{ d.label }}
                </button>
            </div>
        </div>

        <!-- Flex Controls -->
        <div v-if="props.modelValue.display === 'flex' || props.modelValue.display?.includes('flex')"
            class="space-y-3 pt-2 animate-fade-in">

            <!-- Direction -->
            <div class="space-y-1">
                <label class="text-[10px] text-editor-text-muted">Direction</label>
                <div class="flex gap-2">
                    <button v-for="dir in directions" :key="dir.value" @click="updateClass('flexDirection', dir.value)"
                        :class="['p-1.5 rounded-sm border border-editor-input-border transition-colors', props.modelValue.flexDirection === dir.value ? 'bg-editor-accent border-editor-accent text-white' : 'bg-editor-input-bg text-editor-text-muted hover:text-white']"
                        :title="dir.label">
                        <component :is="dir.icon" size="16" />
                    </button>
                </div>
            </div>

            <!-- Justify Content -->
            <div class="space-y-1">
                <label class="text-[10px] text-editor-text-muted">Justify Content</label>
                <div class="flex bg-editor-input-bg rounded-sm border border-editor-input-border p-0.5">
                    <button v-for="j in justifies" :key="j.value" @click="updateClass('justify', j.value)"
                        :class="['flex-1 p-1 flex justify-center rounded-sm transition-colors', props.modelValue.justify === j.value ? 'bg-editor-accent text-white' : 'text-editor-text-muted hover:text-white hover:bg-editor-border']"
                        :title="j.label">
                        <component :is="j.icon" size="14" />
                    </button>
                </div>
            </div>

            <!-- Align Items -->
            <div class="space-y-1">
                <label class="text-[10px] text-editor-text-muted">Align Items</label>
                <div class="flex bg-editor-input-bg rounded-sm border border-editor-input-border p-0.5">
                    <button v-for="i in items" :key="i.value" @click="updateClass('items', i.value)"
                        :class="['flex-1 p-1 flex justify-center rounded-sm transition-colors', props.modelValue.items === i.value ? 'bg-editor-accent text-white' : 'text-editor-text-muted hover:text-white hover:bg-editor-border']"
                        :title="i.label">
                        <component :is="i.icon" size="14" />
                    </button>
                </div>
            </div>

        </div>

        <!-- Grid Controls (MVP: Just basic cols) -->
        <div v-if="props.modelValue.display === 'grid'" class="space-y-1 pt-2 animate-fade-in">
            <label class="text-[10px] text-editor-text-muted">Columns</label>
            <select :value="modelValue.gridCols" @change="e => e.target && updateClass('gridCols', e.target.value)"
                class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text rounded-sm px-2 py-1.5 focus:border-editor-accent outline-none">
                <option value="grid-cols-1">1 Column</option>
                <option value="grid-cols-2">2 Columns</option>
                <option value="grid-cols-3">3 Columns</option>
                <option value="grid-cols-4">4 Columns</option>
            </select>

            <label class="text-[10px] text-editor-text-muted mt-2 block">Gap</label>
            <select :value="modelValue.gap" @change="e => e.target && updateClass('gap', e.target.value)"
                class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text rounded-sm px-2 py-1.5 focus:border-editor-accent outline-none">
                <option value="gap-0">0</option>
                <option value="gap-2">Small (8px)</option>
                <option value="gap-4">Medium (16px)</option>
                <option value="gap-8">Large (32px)</option>
            </select>
        </div>

    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-2px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
