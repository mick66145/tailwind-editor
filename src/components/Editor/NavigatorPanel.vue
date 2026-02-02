<script setup>
import { useEditor } from '../../composables/useEditor'
import { PhX, PhTreeStructure, PhCaretRight, PhCaretDown } from '@phosphor-icons/vue'
import { ref } from 'vue'

const { components, selectedId, selectComponent, showNavigator } = useEditor()

// Recursive Tree Component
const TreeItem = {
    name: 'TreeItem',
    props: ['item', 'depth'],
    setup(props) {
        const isOpen = ref(true)
        const { selectedId, selectComponent } = useEditor()

        const toggle = (e) => {
            e.stopPropagation()
            isOpen.value = !isOpen.value
        }

        return { isOpen, toggle, selectedId, selectComponent }
    },
    template: `
    <div>
        <div 
            @click.stop="selectComponent(item.id)"
            :class="['flex items-center gap-2 py-1.5 px-2 cursor-pointer text-xs rounded-sm transition-colors border border-transparent', 
                selectedId === item.id ? 'bg-editor-accent/10 border-editor-accent/30 text-editor-accent' : 'text-editor-text hover:bg-editor-bg-lighter hover:text-white'
            ]"
            :style="{ paddingLeft: (depth * 12 + 8) + 'px' }"
        >
            <button 
                v-if="item.children && item.children.length" 
                @click="toggle"
                class="p-0.5 hover:bg-white/10 rounded"
            >
                <component :is="isOpen ? 'PhCaretDown' : 'PhCaretRight'" size="12" />
            </button>
            <span v-else class="w-3"></span>
            
            <span class="truncate">{{ item.label || item.type }}</span>
        </div>
        
        <div v-if="isOpen && item.children && item.children.length" class="border-l border-white/5 ml-3">
             <tree-item 
                v-for="child in item.children" 
                :key="child.id" 
                :item="child" 
                :depth="depth + 1"
            ></tree-item>
        </div>
    </div>
  `,
    components: { PhCaretRight, PhCaretDown }
}

</script>

<template>
    <div
        class="absolute right-4 bottom-16 w-64 bg-editor-bg border border-editor-border shadow-xl rounded-md flex flex-col z-[60] animate-slide-up h-80">
        <!-- Header -->
        <div class="flex items-center justify-between p-3 border-b border-editor-border bg-editor-bg rounded-t-md">
            <div class="flex items-center gap-2">
                <PhTreeStructure class="text-editor-accent" />
                <h3 class="text-xs font-semibold text-editor-text uppercase tracking-wider">Navigator</h3>
            </div>
            <button @click="showNavigator = false" class="text-editor-text-muted hover:text-white transition-colors">
                <PhX size="14" />
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div v-if="components.length === 0" class="text-center py-8 text-editor-text-muted text-xs">
                No elements on canvas
            </div>
            <div v-else>
                <TreeItem v-for="c in components" :key="c.id" :item="c" :depth="0" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "../../style.css";

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-editor-border rounded-full;
}

.animate-slide-up {
    animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
