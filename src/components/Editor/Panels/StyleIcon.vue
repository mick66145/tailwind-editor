<script setup>
import { computed } from 'vue'
import * as PhosphorIcons from '@phosphor-icons/vue'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    elementProps: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'update:elementProps'])

const updateClass = (category, value) => {
    const newTw = { ...props.modelValue, [category]: value }
    emit('update:modelValue', newTw)
}

const updateProp = (key, value) => {
    const newProps = { ...props.elementProps, [key]: value }
    emit('update:elementProps', newProps)
}

// Curated list of useful icons for this project
const iconList = [
    'PhStar', 'PhHeart', 'PhCheck', 'PhX', 'PhWarning', 'PhInfo',
    'PhHouse', 'PhUser', 'PhUsers', 'PhGear', 'PhEnvelope', 'PhPhone',
    'PhMapPin', 'PhGlobe', 'PhShoppingCart', 'PhTag', 'PhTrophy',
    'PhMedal', 'PhTarget', 'PhRocket', 'PhLightning', 'PhFire',
    'PhDrop', 'PhPawPrint', 'PhBaseball', 'PhBasketball', 'PhSoccerBall',
    'PhTruck', 'PhFactory', 'PhHandshake', 'PhPresentationChart', 'PhChartBar',
    'PhShieldCheck', 'PhLock', 'PhKey', 'PhCreditCard', 'PhCurrencyDollar',
    'PhFacebookLogo', 'PhInstagramLogo', 'PhLinkedinLogo', 'PhYoutubeLogo',
    'PhTwitterLogo', 'PhPaperPlaneRight', 'PhArrowRight', 'PhCaretDown'
]

const sizes = [
    { label: 'XS', value: 'text-xs' },
    { label: 'SM', value: 'text-sm' },
    { label: 'Base', value: 'text-base' },
    { label: 'LG', value: 'text-lg' },
    { label: 'XL', value: 'text-xl' },
    { label: '2XL', value: 'text-2xl' },
    { label: '3XL', value: 'text-3xl' },
    { label: '4XL', value: 'text-4xl' },
    { label: '5XL', value: 'text-5xl' },
    { label: '6XL', value: 'text-6xl' },
    { label: '7XL', value: 'text-7xl' },
    { label: '8XL', value: 'text-8xl' },
    { label: '9XL', value: 'text-9xl' },
]

const colors = [
    { label: 'Dark', value: 'text-gray-900' },
    { label: 'Light', value: 'text-white' },
    { label: 'Gray', value: 'text-gray-500' },
    { label: 'Accent', value: 'text-editor-accent' }, // Maps to site primary if configured
    { label: 'Red', value: 'text-red-600' },
    { label: 'Blue', value: 'text-blue-600' },
    { label: 'Green', value: 'text-green-600' },
    { label: 'Orange', value: 'text-orange-500' },
]

</script>

<template>
    <div class="space-y-4 border-b border-editor-border pb-4 last:border-0">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2">
            <component :is="PhosphorIcons.PhStar" class="text-editor-accent" />
            <span class="text-xs font-semibold text-editor-text uppercase tracking-wider">Icon Settings</span>
        </div>

        <!-- Icon Picker -->
        <div class="space-y-1">
            <label class="text-[10px] text-editor-text-muted">Select Icon</label>
            <div
                class="grid grid-cols-6 gap-2 bg-editor-bg-lighter p-2 rounded max-h-40 overflow-y-auto custom-scrollbar">
                <button v-for="iconName in iconList" :key="iconName" @click="updateProp('icon', iconName)"
                    :class="['p-1.5 rounded hover:bg-white/10 flex items-center justify-center transition-colors', props.elementProps.icon === iconName ? 'bg-editor-accent text-white hover:bg-editor-accent' : 'text-editor-text-muted']"
                    :title="iconName">
                    <component :is="PhosphorIcons[iconName]" size="18" />
                </button>
            </div>
        </div>

        <!-- Colors -->
        <div class="space-y-1">
            <label class="text-[10px] text-editor-text-muted">Color</label>
            <div class="flex flex-wrap gap-2">
                <button v-for="c in colors" :key="c.label" @click="updateClass('color', c.value)"
                    :class="['w-6 h-6 rounded-full border border-editor-input-border hover:scale-110 transition-transform shadow-sm', c.value.replace('text-', 'bg-')]"
                    :title="c.label">
                </button>
            </div>
        </div>

        <!-- Size -->
        <div class="space-y-1">
            <label class="text-[10px] text-editor-text-muted">Size</label>
            <select :value="modelValue.size" @change="e => e.target && updateClass('size', e.target.value)"
                class="w-full bg-editor-input-bg border border-editor-input-border text-xs text-editor-text rounded-sm px-2 py-1.5 focus:border-editor-accent outline-none">
                <option value="">Default</option>
                <option v-for="s in sizes" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
        </div>

    </div>
</template>

<style scoped>
@reference "../../../style.css";

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-editor-border rounded-full hover:bg-editor-text-muted transition-colors;
}
</style>
