<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import {
  PhTextT,
  PhCursorClick,
  PhImage,
  PhMinus,
  PhYoutubeLogo,
  PhSquare,
  PhColumns,
  PhMagnifyingGlass,
  PhSquaresFour,
  PhUser,
  PhChartBar,
  PhGlobe,
  PhRows,
  PhHeart,
  PhStar,
  PhArrowRight
} from '@phosphor-icons/vue'

const searchQuery = ref('')

const widgets = ref([
  // Basic Elements
  { type: 'text', label: 'Text', icon: PhTextT, category: 'basic' },
  { type: 'image', label: 'Image', icon: PhImage, category: 'basic' },
  { type: 'button', label: 'Button', icon: PhCursorClick, category: 'basic' },
  { type: 'icon', label: 'Icon', icon: PhStar, category: 'basic' },
  { type: 'video', label: 'Video', icon: PhYoutubeLogo, category: 'basic' },
  { type: 'divider', label: 'Divider', icon: PhMinus, category: 'basic' },
  { type: 'input', label: 'Input', icon: PhCursorClick, category: 'basic' },
  { type: 'textarea', label: 'Textarea', icon: PhTextT, category: 'basic' },
  { type: 'label', label: 'Label', icon: PhTextT, category: 'basic' },

  // Structure & Blocks
  { type: 'container', label: 'Container', icon: PhSquare, category: 'block' },
  { type: 'grid-3', label: 'Grid 3 Cols', icon: PhColumns, category: 'block' },
  { type: 'grid-4', label: 'Grid 4 Cols', icon: PhColumns, category: 'block' },

  { type: 'hero', label: 'Hero Section', icon: PhImage, category: 'block' },
  { type: 'feature', label: 'Feature Section', icon: PhColumns, category: 'block' },
  { type: 'card-product', label: 'Product Card', icon: PhSquare, category: 'block' },
  { type: 'card-team', label: 'Team Member', icon: PhUser, category: 'block' },
  { type: 'section-stats', label: 'Stats Section', icon: PhChartBar, category: 'block' },
  { type: 'section-logos', label: 'Logo Grid', icon: PhSquaresFour, category: 'block' },
  { type: 'section-testimonial', label: 'Testimonial', icon: PhHeart, category: 'block' },
  { type: 'section-footer', label: 'Footer', icon: PhRows, category: 'block' },
])

const basicWidgets = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return widgets.value
    .filter(w => w.category === 'basic')
    .filter(w => !query || w.label.toLowerCase().includes(query))
})

const blockWidgets = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return widgets.value
    .filter(w => w.category === 'block')
    .filter(w => !query || w.label.toLowerCase().includes(query))
})

// Clone function for draggable
const cloneWidget = (widget) => {
  const defaults = {
    // --- BASIC ---
    text: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tw: { padding: 'p-4', color: 'text-gray-800', size: 'text-base' }
    },
    button: {
      text: 'Click Here',
      tw: { padding: 'px-6 py-2', bg: 'bg-blue-600', color: 'text-white', rounded: 'rounded', hover: 'hover:bg-blue-700', align: 'self-start', display: 'inline-flex' }
    },
    image: {
      src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      tw: { width: 'w-full', height: 'auto', objectFit: 'object-cover', rounded: '' }
    },
    divider: {
      tw: { margin: 'my-6', color: 'border-gray-200', width: 'w-full', border: 'border-t' }
    },
    video: {
      videoId: 'dQw4w9WgXcQ',
      tw: { width: 'w-full', aspectRatio: 'aspect-video', rounded: 'rounded', shadow: 'shadow' }
    },
    icon: {
      icon: 'PhStar',
      tw: { size: 'text-4xl', color: 'text-blue-500' }
    },
    input: {
      placeholder: 'Enter text...',
      tw: { width: 'w-full', padding: 'p-2', border: 'border border-gray-300', rounded: 'rounded', bg: 'bg-white' }
    },
    textarea: {
      placeholder: 'Enter message...',
      tw: { width: 'w-full', height: 'h-24', padding: 'p-2', border: 'border border-gray-300', rounded: 'rounded', bg: 'bg-white' }
    },
    label: {
      text: 'Label Text',
      tw: { display: 'block', margin: 'mb-1', size: 'text-sm', weight: 'font-bold', color: 'text-gray-700' }
    },

    // --- CONTAINERS / LAYOUTS ---
    container: {
      tw: { padding: 'p-8', bg: '', border: 'border border-dashed border-gray-300', flex: 'flex flex-col gap-4', height: 'min-h-[100px]', width: 'w-full' },
      children: []
    },
    'grid-3': {
      type: 'container',
      tw: { padding: 'p-0', flex: 'grid grid-cols-1 md:grid-cols-3 gap-4', width: 'w-full' },
      children: [
        { id: crypto.randomUUID(), type: 'container', props: { tw: { padding: 'p-4', border: 'border border-dashed border-gray-300', height: 'min-h-[100px]' } }, children: [] },
        { id: crypto.randomUUID(), type: 'container', props: { tw: { padding: 'p-4', border: 'border border-dashed border-gray-300', height: 'min-h-[100px]' } }, children: [] },
        { id: crypto.randomUUID(), type: 'container', props: { tw: { padding: 'p-4', border: 'border border-dashed border-gray-300', height: 'min-h-[100px]' } }, children: [] }
      ]
    },
    'grid-4': {
      type: 'container',
      tw: { padding: 'p-0', flex: 'grid grid-cols-2 md:grid-cols-4 gap-4', width: 'w-full' },
      children: Array(4).fill(null).map(() => ({
        id: crypto.randomUUID(),
        type: 'container',
        props: { tw: { padding: 'p-4', border: 'border border-dashed border-gray-300', height: 'min-h-[100px]' } },
        children: []
      }))
    },


    // --- BLOCKS: SECTIONS ---
    'hero': {
      type: 'container',
      tw: {
        padding: 'p-20',
        bg: "bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center",
        flex: 'flex flex-col items-center justify-center gap-6',
        height: 'min-h-[500px]',
        width: 'w-full',
        shadow: 'shadow-xl'
      },
      children: [
        { id: crypto.randomUUID(), type: 'text', props: { text: 'Build Something Amazing', tw: { color: 'text-white', size: 'text-6xl', weight: 'font-bold', align: 'text-center', shadow: 'drop-shadow-lg' } } },
        { id: crypto.randomUUID(), type: 'text', props: { text: 'Create beautiful layouts with ease.', tw: { color: 'text-gray-100', size: 'text-xl', align: 'text-center', width: 'max-w-2xl' } } },
        { id: crypto.randomUUID(), type: 'button', props: { text: 'Get Started', tw: { padding: 'px-8 py-3', bg: 'bg-white', color: 'text-gray-900', rounded: 'rounded-full', weight: 'font-semibold', hover: 'hover:scale-105 transition-transform' } } }
      ]
    },
    'feature': {
      type: 'container',
      tw: { padding: 'p-12', bg: 'bg-white', flex: 'grid grid-cols-1 md:grid-cols-2 gap-12 items-center' },
      children: [
        {
          id: crypto.randomUUID(),
          type: 'container',
          props: { tw: { flex: 'flex flex-col gap-6' } },
          children: [
            { id: crypto.randomUUID(), type: 'text', props: { text: 'Premium Features', tw: { size: 'text-4xl', weight: 'font-bold', color: 'text-gray-900' } } },
            { id: crypto.randomUUID(), type: 'text', props: { text: 'Explain the benefits of your product here. Use compelling text to engage your audience.', tw: { color: 'text-gray-600', size: 'text-lg', height: 'leading-relaxed' } } },
            { id: crypto.randomUUID(), type: 'button', props: { text: 'Learn More', tw: { padding: 'px-6 py-2.5', bg: 'bg-blue-600', color: 'text-white', rounded: 'rounded-md', weight: 'font-medium' } } }
          ]
        },
        {
          id: crypto.randomUUID(),
          type: 'image',
          props: {
            src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
            tw: { rounded: 'rounded-xl', shadow: 'shadow-2xl' }
          }
        }
      ]
    },

    // --- BLOCKS: CARDS ---
    'card-product': {
      type: 'container',
      tw: { padding: 'p-0', bg: 'bg-white', rounded: 'rounded-xl', shadow: 'shadow-md', border: 'border border-gray-100', width: 'max-w-sm', flex: 'flex flex-col overflow-hidden' },
      children: [
        { id: crypto.randomUUID(), type: 'image', props: { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', tw: { height: 'h-64', width: 'w-full', objectFit: 'object-cover' } } },
        {
          id: crypto.randomUUID(), type: 'container', props: { tw: { padding: 'p-6', flex: 'flex flex-col gap-3' } }, children: [
            { id: crypto.randomUUID(), type: 'text', props: { text: 'Premium Headphones', tw: { size: 'text-xl', weight: 'font-bold', color: 'text-gray-900' } } },
            { id: crypto.randomUUID(), type: 'text', props: { text: '$299.00', tw: { size: 'text-lg', color: 'text-green-600', weight: 'font-semibold' } } },
            { id: crypto.randomUUID(), type: 'button', props: { text: 'Add to Cart', tw: { padding: 'px-4 py-2', bg: 'bg-gray-900', color: 'text-white', rounded: 'rounded-lg', width: 'w-full', align: 'text-center' } } }
          ]
        }
      ]
    },
    'card-team': {
      type: 'container',
      tw: { padding: 'p-8', bg: 'bg-white', rounded: 'rounded-2xl', shadow: 'shadow-sm', border: 'border border-gray-100', flex: 'flex flex-col items-center gap-4', align: 'text-center' },
      children: [
        { id: crypto.randomUUID(), type: 'image', props: { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', tw: { width: 'w-24', height: 'h-24', rounded: 'rounded-full', objectFit: 'object-cover', shadow: 'shadow-md' } } },
        {
          id: crypto.randomUUID(), type: 'container', props: { tw: { flex: 'flex flex-col gap-1' } }, children: [
            { id: crypto.randomUUID(), type: 'text', props: { text: 'Sarah Johnson', tw: { size: 'text-xl', weight: 'font-bold', color: 'text-gray-900' } } },
            { id: crypto.randomUUID(), type: 'text', props: { text: 'Creative Director', tw: { size: 'text-sm', color: 'text-blue-600', weight: 'font-medium', uppercase: 'uppercase' } } }
          ]
        }
      ]
    },

    // --- BLOCKS: MISC ---
    'section-stats': {
      type: 'container',
      tw: { padding: 'py-16 px-8', bg: 'bg-blue-900', flex: 'grid grid-cols-2 md:grid-cols-4 gap-8' },
      children: Array(4).fill(null).map((_, i) => ({
        id: crypto.randomUUID(),
        type: 'container',
        props: { tw: { flex: 'flex flex-col items-center gap-2' } },
        children: [
          { id: crypto.randomUUID(), type: 'text', props: { text: ['10k+', '200+', '99%', '24/7'][i], tw: { size: 'text-4xl', weight: 'font-bold', color: 'text-white' } } },
          { id: crypto.randomUUID(), type: 'text', props: { text: ['Customers', 'Products', 'Satisfaction', 'Support'][i], tw: { size: 'text-sm', color: 'text-blue-200', uppercase: 'uppercase', weight: 'font-semibold' } } }
        ]
      }))
    },
    'section-logos': {
      type: 'container',
      tw: { padding: 'py-12', bg: 'bg-gray-50', flex: 'flex flex-col gap-8' },
      children: [
        { id: crypto.randomUUID(), type: 'text', props: { text: 'Trusted by world class companies', tw: { align: 'text-center', color: 'text-gray-400', weight: 'font-semibold', uppercase: 'uppercase', size: 'text-sm', spacing: 'tracking-widest' } } },
        {
          id: crypto.randomUUID(),
          type: 'container',
          props: { tw: { flex: 'flex flex-wrap justify-center gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-300' } },
          children: Array(5).fill(null).map((_, i) => ({
            id: crypto.randomUUID(),
            type: 'image',
            props: { src: `https://logo.clearbit.com/${['google.com', 'airbnb.com', 'stripe.com', 'spotify.com', 'netflix.com'][i]}`, tw: { height: 'h-8', width: 'auto' } }
          }))
        }
      ]
    },
    'section-testimonial': {
      type: 'container',
      tw: { padding: 'p-12', bg: 'bg-gray-50', rounded: 'rounded-3xl', flex: 'flex flex-col items-center gap-6', align: 'text-center' },
      children: [
        { id: crypto.randomUUID(), type: 'icon', props: { icon: 'PhQuotes', tw: { size: 'text-5xl', color: 'text-blue-200' } } },
        { id: crypto.randomUUID(), type: 'text', props: { text: '"This product effectively solved my problems. The intuitive interface and powerful features made my workflow remarkably efficient."', tw: { size: 'text-2xl', color: 'text-gray-800', weight: 'font-medium', width: 'max-w-3xl', height: 'leading-relaxed' } } },
        {
          id: crypto.randomUUID(), type: 'container', props: { tw: { flex: 'flex items-center gap-4 mt-4' } }, children: [
            { id: crypto.randomUUID(), type: 'image', props: { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop', tw: { width: 'w-12', height: 'h-12', rounded: 'rounded-full' } } },
            {
              id: crypto.randomUUID(), type: 'container', props: { tw: { flex: 'flex flex-col items-start' } }, children: [
                { id: crypto.randomUUID(), type: 'text', props: { text: 'Alex Thompson', tw: { weight: 'font-bold', color: 'text-gray-900', size: 'text-sm' } } },
                { id: crypto.randomUUID(), type: 'text', props: { text: 'CEO, TechFlow', tw: { color: 'text-gray-500', size: 'text-xs' } } }
              ]
            }
          ]
        }
      ]
    },
    'section-footer': {
      type: 'container',
      tw: { padding: 'py-16 px-8', bg: 'bg-gray-900', color: 'text-white', flex: 'grid grid-cols-1 md:grid-cols-4 gap-12' },
      children: [
        {
          id: crypto.randomUUID(), type: 'container', props: { tw: { flex: 'flex flex-col gap-4' } }, children: [
            { id: crypto.randomUUID(), type: 'text', props: { text: 'Logo', tw: { size: 'text-2xl', weight: 'font-bold' } } },
            { id: crypto.randomUUID(), type: 'text', props: { text: 'Making the world a better place through constructing elegant hierarchies.', tw: { color: 'text-gray-400', size: 'text-sm' } } }
          ]
        },
        ...Array(3).fill(null).map((_, i) => ({
          id: crypto.randomUUID(),
          type: 'container',
          props: { tw: { flex: 'flex flex-col gap-4' } },
          children: [
            { id: crypto.randomUUID(), type: 'text', props: { text: ['Solutions', 'Support', 'Company'][i], tw: { weight: 'font-semibold', color: 'text-white' } } },
            ...Array(4).fill(null).map(() => ({
              id: crypto.randomUUID(), type: 'text', props: { text: 'Link Item', tw: { color: 'text-gray-400', size: 'text-sm', hover: 'hover:text-white', cursor: 'cursor-pointer' } }
            }))
          ]
        }))
      ]
    }
  }

  // --- RETURN LOGIC ---

  // 1. If it's a specific block type defined in defaults, clone it
  if (defaults[widget.type] && defaults[widget.type].type === 'container') {
    const preset = defaults[widget.type]
    return {
      id: crypto.randomUUID(),
      type: 'container',
      props: preset.tw ? { tw: preset.tw } : {},
      children: JSON.parse(JSON.stringify(preset.children)).map(child => ({
        ...child,
        id: crypto.randomUUID(), // Regenerate IDs for deeper levels if needed
        children: child.children ? child.children.map(sub => ({ ...sub, id: crypto.randomUUID() })) : []
      }))
    }
  }

  // 2. Fallback for simple elements
  const simpleDef = defaults[widget.type] || {}
  return {
    id: crypto.randomUUID(),
    type: widget.type,
    props: simpleDef ? JSON.parse(JSON.stringify(simpleDef)) : {},
    children: []
  }

  return {
    id: crypto.randomUUID(),
    type: widget.type,
    props: defaults[widget.type] || {},
    children: []
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-editor-bg select-none">
    <!-- Header / Search -->
    <div class="p-4 border-b border-editor-border bg-editor-bg z-10 sticky top-0">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="Search Widget..."
          class="w-full bg-editor-input-bg border border-editor-input-border text-editor-text text-sm rounded-sm py-2 pl-9 pr-3 focus:border-editor-accent focus:ring-1 focus:ring-editor-accent placeholder-editor-text-muted outline-none transition-all" />
        <PhMagnifyingGlass :size="16" class="absolute left-3 top-2.5 text-editor-text-muted" />
      </div>
    </div>

    <!-- Widget Grid -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
      <!-- BASIC SECTION -->
      <div v-if="basicWidgets.length > 0">
        <div
          class="px-2 py-3 flex items-center justify-between cursor-pointer hover:bg-editor-bg-lighter rounded-sm mb-2 group sticky top-0 bg-editor-bg z-10 border-b border-transparent hover:border-editor-border">
          <span class="text-xs font-bold uppercase tracking-wider text-editor-text">Basic</span>
          <PhSquaresFour :size="14" class="text-editor-text-muted group-hover:text-editor-text" />
        </div>

        <draggable :list="basicWidgets" :group="{ name: 'canvas', pull: 'clone', put: false }" :clone="cloneWidget"
          item-key="type" :sort="false" class="grid grid-cols-2 gap-2 mb-6">
          <template #item="{ element }">
            <div
              class="flex flex-col items-center justify-center p-4 bg-editor-bg-lighter border border-transparent hover:border-editor-accent hover:shadow-lg rounded-sm cursor-grab active:cursor-grabbing transition-all group h-24">
              <div class="text-3xl mb-2 text-editor-text-muted group-hover:text-editor-accent transition-colors">
                <component :is="element.icon" />
              </div>
              <span class="text-[11px] font-medium text-editor-text group-hover:text-white transition-colors">{{
                element.label }}</span>
            </div>
          </template>
        </draggable>
      </div>

      <!-- BLOCKS SECTION -->
      <div v-if="blockWidgets.length > 0">
        <div
          class="px-2 py-3 flex items-center justify-between cursor-pointer hover:bg-editor-bg-lighter rounded-sm mb-2 group sticky top-0 bg-editor-bg z-10 border-b border-transparent hover:border-editor-border">
          <span class="text-xs font-bold uppercase tracking-wider text-editor-text">Blocks</span>
          <PhColumns :size="14" class="text-editor-text-muted group-hover:text-editor-text" />
        </div>

        <draggable :list="blockWidgets" :group="{ name: 'canvas', pull: 'clone', put: false }" :clone="cloneWidget"
          item-key="type" :sort="false" class="grid grid-cols-2 gap-2 pb-10">
          <template #item="{ element }">
            <div
              class="flex flex-col items-center justify-center p-4 bg-editor-bg-lighter border border-transparent hover:border-editor-accent hover:shadow-lg rounded-sm cursor-grab active:cursor-grabbing transition-all group h-24">
              <div class="text-3xl mb-2 text-editor-text-muted group-hover:text-editor-accent transition-colors">
                <component :is="element.icon" />
              </div>
              <span class="text-[11px] font-medium text-editor-text group-hover:text-white transition-colors">{{
                element.label }}</span>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 4px;
}
</style>
