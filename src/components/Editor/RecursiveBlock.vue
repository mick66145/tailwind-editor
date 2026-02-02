<script setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { useEditor } from '../../composables/useEditor'

import { PhCopy, PhTrash } from '@phosphor-icons/vue'

defineOptions({
  name: 'RecursiveBlock'
})

const props = defineProps({
  element: {
    type: Object,
    required: true
  }
})

const { selectComponent, selectedId, isPreview, contextMenu, deleteComponent, duplicateComponent } = useEditor()

const isSelected = computed(() => selectedId.value === props.element.id && !isPreview.value)

// Compute classes from structured tw object OR fallback to raw class string
const elementClass = computed(() => {
  if (props.element.props.tw) {
    return Object.values(props.element.props.tw).join(' ')
  }
  return props.element.props.class || ''
})

const handleContextMenu = (e) => {
  if (isPreview.value) return
  e.preventDefault()
  e.stopPropagation()
  selectComponent(props.element.id)
  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    targetId: props.element.id
  }
}
</script>

<template>
  <div @click.stop="!isPreview && selectComponent(element.id)" @contextmenu="handleContextMenu" :class="['relative transition-all',
    !isPreview ? 'group hover:outline hover:outline-1 hover:outline-blue-400 p-2 cursor-pointer' : '',
    isSelected ? 'outline outline-2 outline-blue-600 z-10' : ''
  ]">
    <!-- Label / Toolbar -->
    <div v-if="isSelected && !isPreview"
      class="absolute -top-7 right-0 h-7 bg-blue-600 flex items-center px-1 rounded-t-md z-[50] shadow-sm select-none animate-fade-in">
      <span class="text-[10px] font-bold text-white px-2 uppercase cursor-grab active:cursor-grabbing">{{ element.type
        }}</span>
      <div class="w-px h-3 bg-white/20 mx-1"></div>
      <button @click.stop="duplicateComponent(element.id)"
        class="p-1 hover:bg-blue-500 text-white rounded transition-colors" title="Duplicate">
        <PhCopy :size="12" />
      </button>
      <button @click.stop="deleteComponent(element.id)"
        class="p-1 hover:bg-red-500 text-white rounded transition-colors" title="Delete">
        <PhTrash :size="12" />
      </button>
    </div>
    <div v-if="!isSelected && !isPreview"
      class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-1 hidden group-hover:block z-20 rounded-bl pointer-events-none">
      {{ element.type }}
    </div>

    <!-- CONTENT: TEXT -->
    <div v-if="element.type === 'text'">
      <p :class="elementClass || 'text-base text-gray-800'">{{ element.props.text || 'Edit this text' }}</p>
    </div>

    <!-- CONTENT: BUTTON -->
    <div v-else-if="element.type === 'button'">
      <button :class="elementClass || 'px-4 py-2 bg-blue-600 text-white rounded'">{{ element.props.text || 'Click Me'
      }}</button>
    </div>

    <!-- CONTENT: IMAGE -->
    <div v-else-if="element.type === 'image'">
      <img v-if="element.props.src" :src="element.props.src" :class="elementClass" class="max-w-full" />
      <div v-else :class="elementClass" class="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400">
        Image Placeholder
      </div>
    </div>

    <!-- CONTENT: DIVIDER -->
    <div v-else-if="element.type === 'divider'" class="py-2">
      <hr :class="elementClass" />
    </div>

    <!-- CONTENT: VIDEO -->
    <div v-else-if="element.type === 'video'">
      <iframe :class="elementClass" :src="`https://www.youtube.com/embed/${element.props.videoId || ''}`"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>

    <!-- CONTENT: CONTAINER (NESTED) -->
    <div v-else-if="element.type === 'container'" class="h-full">

      <!-- Empty State / Guide -->
      <div v-if="element.children.length === 0 && !isPreview"
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-50">
        <div class="border border-dashed border-gray-400 w-full h-full absolute inset-0 bg-gray-50/50"></div>
        <span class="text-xs text-gray-400 font-medium relative z-10 bg-white/80 px-2 py-1 rounded">Container</span>
      </div>

      <!-- Draggable IS grid/flex container -->
      <draggable v-model="element.children" group="canvas" item-key="id" :class="[
        elementClass,
        !elementClass && !isPreview ? 'min-h-[100px] p-4' : '', // Default size if no class
        'min-h-[50px] h-full w-full transition-all relative z-10',
        !isPreview ? 'ring-1 ring-transparent hover:ring-blue-400/20' : ''
      ]" ghost-class="ghost">
        <template #item="{ element: child }">
          <RecursiveBlock :element="child" />
        </template>
      </draggable>
    </div>

  </div>
</template>

<style scoped>
@reference "../../style.css";

.ghost {
  @apply bg-blue-50 border-blue-400 opacity-50;
}

.animate-fade-in {
  animation: fadeIn 0.1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(2px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
