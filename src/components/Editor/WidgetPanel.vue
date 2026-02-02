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
  PhSquaresFour
} from '@phosphor-icons/vue'

const searchQuery = ref('')

const widgets = ref([
  { type: 'container', label: 'Container', icon: PhSquare },
  { type: '2-cols', label: '2 Columns', icon: PhColumns },
  { type: 'text', label: 'Text Editor', icon: PhTextT },
  { type: 'image', label: 'Image', icon: PhImage },
  { type: 'video', label: 'Video', icon: PhYoutubeLogo },
  { type: 'button', label: 'Button', icon: PhCursorClick },
  { type: 'divider', label: 'Divider', icon: PhMinus },
])

const filteredWidgets = computed(() => {
  if (!searchQuery.value) return widgets.value
  return widgets.value.filter(w => w.label.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// Clone function for draggable
const cloneWidget = (widget) => {
  const defaults = {
    text: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
      tw: { padding: 'p-4', color: 'text-gray-800', size: 'text-base', bg: '', margin: '' }
    },
    button: {
      text: 'Click Here',
      tw: { padding: 'px-8 py-3', bg: 'bg-indigo-600', color: 'text-white', rounded: 'rounded-md', hover: 'hover:bg-indigo-700', align: 'self-start', display: 'inline-flex' }
    },
    container: {
      tw: { padding: 'p-10', bg: '', border: 'border border-dashed border-gray-300', flex: 'flex flex-col gap-4', height: 'min-h-[100px]', width: 'w-full' },
      children: []
    },
    '2-cols': {
      type: 'container', // Transform to container
      tw: { padding: 'p-0', bg: '', border: '', flex: 'grid grid-cols-1 md:grid-cols-2 gap-4', height: 'min-h-[100px]', width: 'w-full' },
      children: [
        { id: crypto.randomUUID(), type: 'container', props: { tw: { padding: 'p-4', border: 'border border-dashed border-gray-300', height: 'min-h-[100px]' } }, children: [] },
        { id: crypto.randomUUID(), type: 'container', props: { tw: { padding: 'p-4', border: 'border border-dashed border-gray-300', height: 'min-h-[100px]' } }, children: [] }
      ]
    },
    image: {
      src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      tw: { width: 'w-full', height: 'auto', objectFit: 'object-cover', rounded: '' }
    },
    divider: {
      tw: { margin: 'my-6', color: 'border-gray-300', width: 'w-full', border: 'border-t-2' }
    },
    video: {
      videoId: 'dQw4w9WgXcQ',
      tw: { width: 'w-full', aspectRatio: 'aspect-video', rounded: 'rounded-lg', shadow: 'shadow-lg' }
    }
  }

  // Handle Special Presets
  if (widget.type === '2-cols') {
    const preset = defaults['2-cols']
    return {
      id: crypto.randomUUID(),
      type: 'container',
      props: preset.tw ? { tw: preset.tw } : {},
      children: preset.children
    }
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
      <!-- Section Title -->
      <div
        class="px-2 py-4 flex items-center justify-between cursor-pointer hover:bg-editor-bg-lighter rounded-sm mb-2 group">
        <span class="text-xs font-bold uppercase tracking-wider text-editor-text">Basic</span>
        <PhSquaresFour :size="14" class="text-editor-text-muted group-hover:text-editor-text" />
      </div>

      <draggable :list="filteredWidgets" :group="{ name: 'canvas', pull: 'clone', put: false }" :clone="cloneWidget"
        item-key="type" :sort="false" class="grid grid-cols-2 gap-2">
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
