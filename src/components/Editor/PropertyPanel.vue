<script setup>
import { useEditor } from '../../composables/useEditor'
import { computed, ref } from 'vue'
import {
  PhPencilSimple,
  PhPaintBrush,
  PhGear,
} from '@phosphor-icons/vue'

// Sub-Panels
import StyleTypography from './Panels/StyleTypography.vue'
import StyleSpacing from './Panels/StyleSpacing.vue'
import StyleBackground from './Panels/StyleBackground.vue'
import StyleBorder from './Panels/StyleBorder.vue'
import StyleLayout from './Panels/StyleLayout.vue'
import StyleIcon from './Panels/StyleIcon.vue'

const { selectedComponent, selectedId } = useEditor()

const activeTab = ref('content') // content, style, advanced

const tabs = [
  { id: 'content', label: 'Content', icon: PhPencilSimple },
  { id: 'style', label: 'Style', icon: PhPaintBrush },
  { id: 'advanced', label: 'Advanced', icon: PhGear },
]

const twProps = computed({
  get: () => selectedComponent.value?.props?.tw || {},
  set: (newVal) => {
    if (selectedComponent.value) {
      selectedComponent.value.props.tw = newVal
    }
  }
})

</script>

<template>
  <div class="flex flex-col h-full bg-editor-bg border-l border-editor-border w-80 select-none">

    <div v-if="selectedComponent" class="flex flex-col h-full">
      <!-- Header -->
      <div class="p-4 border-b border-editor-border bg-editor-bg shadow-sm z-10">
        <h2 class="font-semibold text-editor-text text-sm flex items-center gap-2">
          Edit {{ selectedComponent.label || selectedComponent.type }}
        </h2>
      </div>

      <!-- Tabs -->
      <div class="flex bg-editor-bg-lighter border-b border-editor-border">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          :class="['flex-1 py-3 flex items-center justify-center text-editor-text-muted transition-colors border-b-2', activeTab === tab.id ? 'border-editor-accent text-editor-accent bg-editor-bg' : 'border-transparent hover:text-editor-text hover:bg-editor-bg/50']">
          <component :is="tab.icon" :size="18" />
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">

        <!-- TAB: CONTENT -->
        <div v-if="activeTab === 'content'" class="space-y-4 animate-fade-in">

          <div v-if="selectedComponent.props.text !== undefined">
            <label class="editor-label">Text Content</label>
            <textarea v-model="selectedComponent.props.text" class="editor-input min-h-[80px]"></textarea>
          </div>

          <div v-if="selectedComponent.props.videoId !== undefined">
            <label class="editor-label">YouTube Video ID</label>
            <input type="text" v-model="selectedComponent.props.videoId" class="editor-input"
              placeholder="e.g. dQw4w9WgXcQ" />
          </div>

          <div v-if="selectedComponent.props.src !== undefined">
            <label class="editor-label">Image URL</label>
            <input type="text" v-model="selectedComponent.props.src" class="editor-input" placeholder="https://..." />
          </div>

          <div v-if="selectedComponent.type === 'button'">
            <label class="editor-label">Link</label>
            <input type="text" placeholder="#" class="editor-input" />
          </div>

        </div>

        <!-- TAB: STYLE -->
        <div v-if="activeTab === 'style'" class="space-y-6 animate-fade-in">
          <!-- Text -->
          <StyleTypography v-if="selectedComponent.type === 'text' || selectedComponent.type === 'button'"
            v-model="twProps" />

          <!-- Icon -->
          <StyleIcon v-if="selectedComponent.type === 'icon'" v-model="twProps" :elementProps="selectedComponent.props"
            @update:elementProps="newProps => selectedComponent.props = newProps" />

          <StyleBackground v-model="twProps" />
          <StyleBorder v-model="twProps" />
        </div>

        <!-- TAB: ADVANCED -->
        <div v-if="activeTab === 'advanced'" class="space-y-6 animate-fade-in">
          <StyleLayout v-model="twProps" />
          <StyleSpacing v-model="twProps" />
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div class="flex-1 flex flex-col items-center justify-center text-editor-text-muted p-4 text-center opacity-50"
      v-else>
      <div class="mb-3 p-4 bg-editor-bg-lighter rounded-full">
        <PhPencilSimple :size="32" />
      </div>
      <p class="text-xs font-medium uppercase tracking-wider">Select an element<br>to edit properties</p>
    </div>

  </div>
</template>

<style scoped>
@reference "../../style.css";

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-editor-border rounded-full hover:bg-editor-text-muted transition-colors;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
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
