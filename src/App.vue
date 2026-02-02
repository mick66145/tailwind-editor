<script setup>
import TopBar from './components/Editor/TopBar.vue'
import WidgetPanel from './components/Editor/WidgetPanel.vue'
import CanvasArea from './components/Editor/CanvasArea.vue'
import PropertyPanel from './components/Editor/PropertyPanel.vue'
import FooterBar from './components/Editor/FooterBar.vue'
import NavigatorPanel from './components/Editor/NavigatorPanel.vue'
import ContextMenu from './components/Editor/ContextMenu.vue'
import ToastNotification from './components/Common/ToastNotification.vue'
import { useEditor } from './composables/useEditor'

const { isPreview, showNavigator } = useEditor()
</script>

<template>
  <div class="flex flex-col h-screen w-screen bg-editor-bg text-editor-text overflow-hidden font-sans">
    <!-- Top Bar -->
    <TopBar class="flex-shrink-0 z-50 border-b border-editor-border" />

    <div class="flex flex-1 overflow-hidden relative">
      <!-- Left: Widget Panel -->
      <WidgetPanel v-if="!isPreview"
        class="w-72 flex-shrink-0 bg-editor-bg border-r border-editor-border transition-all z-40" />

      <!-- Center: Canvas Area -->
      <CanvasArea class="flex-1 bg-editor-bg-lighter overflow-auto flex justify-center relative" />

      <!-- Right: Property Panel -->
      <PropertyPanel v-if="!isPreview"
        class="w-80 flex-shrink-0 bg-editor-bg border-l border-editor-border transition-all z-40" />

      <!-- Floating Navigator -->
      <NavigatorPanel v-if="showNavigator && !isPreview" />

      <!-- Context Menu Overlay -->
      <ContextMenu />
    </div>

    <!-- Footer Bar -->
    <FooterBar v-if="!isPreview" class="flex-shrink-0 border-t border-editor-border bg-editor-bg select-none" />

    <!-- Global Notifications -->
    <ToastNotification />
  </div>
</template>
