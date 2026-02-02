<script setup>
import { useEditor } from '../../composables/useEditor'
import { PhCopy, PhTrash, PhPen } from '@phosphor-icons/vue'
import { watch, onMounted, onUnmounted } from 'vue'

const { contextMenu, deleteComponent, duplicateComponent, selectComponent } = useEditor()

const closeMenu = () => {
    contextMenu.value.visible = false
}

// Close on global click
const handleClickOutside = (e) => {
    if (contextMenu.value.visible) {
        closeMenu()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const handleDuplicate = () => {
    duplicateComponent(contextMenu.value.targetId)
    closeMenu()
}

const handleDelete = () => {
    deleteComponent(contextMenu.value.targetId)
    closeMenu()
}

const handleEdit = () => {
    selectComponent(contextMenu.value.targetId)
    closeMenu()
}
</script>

<template>
    <div v-if="contextMenu.visible"
        class="fixed z-[100] bg-editor-bg border border-editor-border rounded-sm shadow-xl w-40 py-1 overflow-hidden"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }">
        <button @click="handleEdit"
            class="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-accent hover:text-white flex items-center gap-2 transition-colors">
            <PhPen size="14" /> Edit
        </button>
        <button @click="handleDuplicate"
            class="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-accent hover:text-white flex items-center gap-2 transition-colors">
            <PhCopy size="14" /> Duplicate
        </button>
        <div class="h-px bg-editor-border my-1"></div>
        <button @click="handleDelete"
            class="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors">
            <PhTrash size="14" /> Delete
        </button>
    </div>
</template>
