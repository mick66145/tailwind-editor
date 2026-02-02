<script setup>
import { ref } from 'vue'
import {
    PhCornersOut,
    PhLink,
    PhLinkBreak
} from '@phosphor-icons/vue'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const isLinked = ref(true)

// Mapping simpler padding keys for the UI if we were parsing individual values
// But since we are using Tailwind classes, we need to map a "spacing preset" or try to handle individual sides?
// FOR PHASE 7 MVP: Let's upgrade to specific sides capability but map them to classes like 'pt-4', 'pr-4'.
// BUT Tailwind class string manipulation is hard. 
// A better approach for this editor is to store specific properties in the `tw` object like `pt`, `pr`, `pb`, `pl` and verify they are joined.
// RecursiveBlock.vue joins Object.values(props.element.props.tw).
// So we can just add keys `pt`, `pr`, `pb`, `pl` to the tw object.

const spacingSizes = [
    { label: '0', value: '0' },
    { label: 'XS', value: '2' }, // p-2 g-2
    { label: 'S', value: '4' },
    { label: 'M', value: '8' },
    { label: 'L', value: '12' },
    { label: 'XL', value: '16' },
]

const updateSide = (type, side, size) => {
    // type: 'm' or 'p'
    // side: 't', 'r', 'b', 'l', or 'all'
    // size: '0', '2', '4', etc.

    // Construct class key and value
    // If 'all', update the main padding/margin key (e.g. 'padding')
    // If side, update 'pt', 'pr' etc.

    // NOTE: This assumes the `tw` object structure supports these keys. 
    // We should probably clear the 'all' key if setting specific sides, or utilize specificity.
    // Tailwind utility: `p-4` vs `pt-2`. `pt-2` wins if later? Or depending on order.

    // Let's stick to updating specific keys in the `tw` object.

    const newTw = { ...props.modelValue }

    if (isLinked.value) {
        // Update all sides
        const className = `${type}-${size}` // e.g. p-4
        // Use a generic key or specific keys? 
        // Let's use generic 'padding' or 'margin' key for all-around
        if (type === 'p') newTw['padding'] = className
        if (type === 'm') newTw['margin'] = className

        // Clear specific sides to avoid conflict?
        // ['t','r','b','l'].forEach(s => delete newTw[`${type}${s}`]) 
        // Actually, let's keep it simple. If linked, we set the main `padding` prop.
    } else {
        // Update specific side
        const className = `${type}${side}-${size}` // e.g. pt-4
        const key = `${type}${side}` // pt
        newTw[key] = className
    }

    emit('update:modelValue', newTw)
}

// For UI, we need to try to reverse properties to show current state.
// This is tricky without parsing. We will try to read the values.

</script>

<template>
    <div class="space-y-4 border-b border-editor-border pb-4 last:border-0">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2">
            <PhCornersOut class="text-editor-accent" />
            <span class="text-xs font-semibold text-editor-text uppercase tracking-wider">Spacing</span>
        </div>

        <!-- Padding Control -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <label class="text-[10px] text-editor-text-muted">Padding</label>
                <button @click="isLinked = !isLinked" class="text-editor-text-muted hover:text-white transition-colors">
                    <component :is="isLinked ? PhLink : PhLinkBreak" size="14" />
                </button>
            </div>

            <!-- Visual Box Model Inputs -->
            <div class="grid grid-cols-2 gap-2 bg-editor-bg-lighter p-2 rounded-sm border border-editor-input-border">
                <!-- Top / Bottom / Left / Right placeholders -->
                <!-- Simplified: Just a label and a select for each side if unlinked -->

                <template v-if="!isLinked">
                    <div v-for="side in ['t', 'r', 'b', 'l']" :key="side" class="space-y-1">
                        <span class="text-[9px] text-editor-text-muted uppercase text-center block">
                            {{ side === 't' ? 'Top' : side === 'r' ? 'Right' : side === 'b' ? 'Bottom' : 'Left' }}
                        </span>
                        <select @change="e => e.target && updateSide('p', side, e.target.value)"
                            class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text px-1 py-1 outline-none">
                            <option value="0">0</option>
                            <option v-for="s in spacingSizes" :key="s.value" :value="s.value">{{ s.label }}</option>
                        </select>
                    </div>
                </template>

                <template v-else>
                    <div class="col-span-2">
                        <select @change="e => e.target && updateSide('p', 'all', e.target.value)"
                            class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text px-2 py-1.5 outline-none">
                            <option value="0">0 (None)</option>
                            <option v-for="s in spacingSizes" :key="s.value" :value="s.value">{{ s.label }} ({{
                                parseInt(s.value) * 4 }}px)</option>
                        </select>
                    </div>
                </template>
            </div>
        </div>

        <!-- Margin Control (Similar Structure) -->
        <!-- For MVP let's just do Padding first as requested by design often -->

    </div>
</template>
