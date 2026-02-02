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

        <!-- Image URL -->
        <!-- Only show if needed or separate component? Let's add simple visual URL input -->
        <!-- Note: `bg-` classes in Tailwind usually expect utility. Custom URL needs inline style or specific config. 
         For now let's assume `src` prop handles image content for Image widgets, but for Background Images on Containers...
         That's harder with pure Tailwind classes without arbitrary values like `bg-[url(...)]`.
         Let's stick to color for now for Phase 7 MVP or simple arbitrary values.
    -->

    </div>
</template>
