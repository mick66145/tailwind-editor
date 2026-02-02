<script setup>
import draggable from 'vuedraggable'
import { useEditor } from '../../composables/useEditor'
import RecursiveBlock from './RecursiveBlock.vue'
import { PhPlus, PhMinus, PhArrowsOutSimple } from '@phosphor-icons/vue'
import { computed } from 'vue'

const { components, selectComponent, selectedId, deviceMode, isPreview } = useEditor()

const canvasWidth = computed(() => {
  switch (deviceMode.value) {
    case 'tablet': return 'w-[768px]'
    case 'mobile': return 'w-[375px]'
    default: return 'w-full max-w-[1280px]' // Fluid but capped for sanity, or just w-full? Let's go w-full for "Desktop" feel in limited space
  }
})

const canvasWidthLabel = computed(() => {
  switch (deviceMode.value) {
    case 'tablet': return '768px'
    case 'mobile': return '375px'
    default: return '100%'
  }
})
</script>

<template>
  <div class="relative flex-1 bg-editor-bg-lighter overflow-hidden flex flex-col transition-all">
    <!-- Canvas Controls (Hide in Preview) -->
    <div v-if="!isPreview"
      class="h-8 bg-editor-bg border-b border-editor-border flex items-center justify-between px-4 text-xs text-editor-text-muted select-none z-10 flex-shrink-0">
      <div class="flex items-center gap-4">
        <span class="font-mono text-editor-text">{{ canvasWidthLabel }}</span>
        <span class="text-editor-text-muted/50">|</span>
        <span>100%</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="hover:text-white transition-colors">
          <PhMinus :size="14" />
        </button>
        <span class="w-8 text-center">100%</span>
        <button class="hover:text-white transition-colors">
          <PhPlus :size="14" />
        </button>
        <div class="w-px h-4 bg-editor-border mx-2"></div>
        <button class="hover:text-white transition-colors">
          <PhArrowsOutSimple :size="14" />
        </button>
      </div>
    </div>

    <!-- Scrollable Area -->
    <div
      :class="['flex-1 overflow-auto flex justify-center bg-editor-bg-lighter relative custom-scrollbar', isPreview ? 'p-0' : 'p-12']">
      <!-- The Page -->
      <div :class="[
        canvasWidth,
        'min-h-[800px] bg-white transition-all duration-300 relative group',
        isPreview ? 'shadow-none' : 'shadow-2xl border-t-4 border-editor-accent'
      ]" :style="{ minHeight: isPreview ? '100%' : '800px' }">

        <!-- Empty State / Drop Hint -->
        <div v-if="components.length === 0"
          class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="text-center text-gray-300">
            <p class="text-4xl font-light mb-2">+</p>
            <p class="text-sm uppercase tracking-widest font-medium">Drag Widgets Here</p>
          </div>
        </div>

        <draggable v-model="components" group="canvas" item-key="id" class="min-h-full p-px" ghost-class="ghost"
          drag-class="drag">
          <template #item="{ element }">
            <RecursiveBlock :element="element" />
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../style.css";

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-editor-border rounded-full hover:bg-editor-text-muted transition-colors;
}

.ghost {
  @apply bg-editor-accent/10 border-2 border-editor-accent opacity-70 scale-[0.98] origin-center;
}

.drag {
  @apply opacity-100 shadow-2xl scale-100 ring-2 ring-editor-accent z-50;
}
</style>
