<script setup>
import { useNotification } from '../../composables/useNotification'
import { PhCheckCircle, PhWarningCircle, PhInfo, PhX } from '@phosphor-icons/vue'

const { toasts, removeToast } = useNotification()

const getIcon = (type) => {
    switch (type) {
        case 'success': return PhCheckCircle
        case 'error': return PhWarningCircle
        default: return PhInfo
    }
}

const getClasses = (type) => {
    switch (type) {
        case 'success': return 'bg-green-600 text-white'
        case 'error': return 'bg-red-500 text-white'
        default: return 'bg-blue-600 text-white'
    }
}
</script>

<template>
    <div class="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
        <TransitionGroup name="toast">
            <div v-for="toast in toasts" :key="toast.id"
                :class="['pointer-events-auto flex items-center gap-3 px-4 py-3 rounded shadow-lg min-w-[200px]', getClasses(toast.type)]">
                <component :is="getIcon(toast.type)" size="20" weight="fill" />
                <span class="text-sm font-medium">{{ toast.message }}</span>
                <button @click="removeToast(toast.id)" class="ml-auto hover:opacity-80">
                    <PhX size="14" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
