import { ref } from 'vue'

const toasts = ref([])

export function useNotification() {
    const addToast = (message, type = 'success') => { // type: success, error, info
        const id = crypto.randomUUID()
        toasts.value.push({ id, message, type })

        setTimeout(() => {
            removeToast(id)
        }, 3000)
    }

    const removeToast = (id) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    return {
        toasts,
        addToast,
        removeToast
    }
}
