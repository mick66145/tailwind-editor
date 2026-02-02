<script setup>
import { useEditor } from '../../composables/useEditor'
import {
    PhGear,
    PhStack,
    PhEye,
    PhDeviceMobile,
    PhClockCounterClockwise
} from '@phosphor-icons/vue'

const { showNavigator, isPreview } = useEditor()

</script>

<template>
    <div
        class="h-10 bg-editor-bg border-t border-editor-border flex items-center justify-between px-4 select-none z-50">

        <!-- Left: Tools -->
        <div class="flex items-center gap-0.5">
            <button
                class="p-2 text-editor-text-muted hover:text-white hover:bg-editor-bg-lighter rounded-sm transition-colors"
                title="Settings">
                <PhGear size="18" />
            </button>

            <button @click="showNavigator = !showNavigator"
                :class="['p-2 rounded-sm transition-colors flex items-center gap-2', showNavigator ? 'text-editor-accent bg-editor-accent/10' : 'text-editor-text-muted hover:text-white hover:bg-editor-bg-lighter']"
                title="Navigator">
                <PhStack size="18" />
                <span class="text-xs font-medium hidden sm:block">Navigator</span>
            </button>

            <button
                class="p-2 text-editor-text-muted hover:text-white hover:bg-editor-bg-lighter rounded-sm transition-colors"
                title="History">
                <PhClockCounterClockwise size="18" />
            </button>
        </div>

        <!-- Center: Responsive (Optional, kept in TopBar but maybe move here?) -->
        <!-- Keeping in TopBar for now as designed -->

        <!-- Right: Preview -->
        <div>
            <button @click="isPreview = !isPreview"
                :class="['p-2 rounded-md transition-colors flex items-center gap-2 text-xs font-semibold', isPreview ? 'bg-editor-accent text-white shadow-md' : 'text-editor-text hover:bg-editor-bg-lighter']">
                <PhEye size="18" />
                <!-- <span class="hidden sm:inline">{{ isPreview ? 'Edit' : 'Preview' }}</span> -->
            </button>
        </div>

    </div>
</template>
