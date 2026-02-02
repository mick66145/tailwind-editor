import { ref, computed } from 'vue'

const components = ref([])
const selectedId = ref(null)

// State (Global Singleton)
const isPreview = ref(false)
const deviceMode = ref('desktop') // desktop, tablet, mobile
const showNavigator = ref(false)

// Context Menu State
const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    targetId: null
})

export function useEditor() {

    const addComponent = (component) => {
        components.value.push(component)
    }

    const selectComponent = (id) => {
        selectedId.value = id
    }

    const selectedComponent = computed(() => {
        return findComponentById(components.value, selectedId.value)
    })

    // Export Logic
    const generateHtml = (componentList = components.value) => {
        return componentList.map(comp => {
            const twProps = comp.props.tw ? Object.values(comp.props.tw).join(' ') : (comp.props.class || '')

            if (comp.type === 'text') {
                return `<p class="${twProps}">${comp.props.text}</p>`
            }
            if (comp.type === 'button') {
                return `<button class="${twProps}">${comp.props.text}</button>`
            }
            if (comp.type === 'image') {
                return `<img src="${comp.props.src}" class="${twProps}" alt="Image" />`
            }
            if (comp.type === 'divider') {
                return `<hr class="${twProps}" />`
            }
            if (comp.type === 'video') {
                return `<div class="${twProps}"><iframe src="https://www.youtube.com/embed/${comp.props.videoId}" frameborder="0" allowfullscreen class="w-full h-full"></iframe></div>`
            }
            if (comp.type === 'container') {
                const childrenHtml = generateHtml(comp.children)
                return `<div class="${twProps}">${childrenHtml}</div>`
            }
            return ''
        }).join('\n')
    }

    // Recursive search
    const findComponentById = (list, id) => {
        for (const item of list) {
            if (item.id === id) return item
            if (item.children && item.children.length > 0) {
                const found = findComponentById(item.children, id)
                if (found) return found
            }
        }
        return null
    }

    // State - Now Global


    // Actions
    const deleteComponent = (id) => {
        // Recursive delete
        const deleteFromList = (list) => {
            const index = list.findIndex(c => c.id === id)
            if (index !== -1) {
                console.log('Deleting component', id)
                list.splice(index, 1)
                return true
            }
            for (const item of list) {
                if (item.children && deleteFromList(item.children)) return true
            }
            return false
        }

        deleteFromList(components.value)
        if (selectedId.value === id) selectedId.value = null
    }

    const duplicateComponent = (id) => {
        const findAndDuplicate = (list) => {
            const index = list.findIndex(c => c.id === id)
            if (index !== -1) {
                const original = list[index]
                // Deep clone with new IDs
                const clone = JSON.parse(JSON.stringify(original))

                const regenerateIds = (comp) => {
                    comp.id = crypto.randomUUID()
                    if (comp.children) comp.children.forEach(regenerateIds)
                }
                regenerateIds(clone)

                list.splice(index + 1, 0, clone)
                return true
            }
            for (const item of list) {
                if (item.children && findAndDuplicate(item.children)) return true
            }
            return false
        }
        findAndDuplicate(components.value)
    }

    // Storage Logic
    const STORAGE_KEY = 'tailwind-editor-data'

    const saveToLocalStorage = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(components.value))
            return true
        } catch (e) {
            console.error('Save failed', e)
            return false
        }
    }

    const loadFromLocalStorage = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY)
            if (data) {
                components.value = JSON.parse(data)
                return true
            }
        } catch (e) {
            console.error('Load failed', e)
        }
        return false
    }

    const clearCanvas = () => {
        components.value = []
        selectedId.value = null
    }

    // Keyboard Shortcuts
    if (typeof window !== 'undefined') {
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId.value) {
                // Avoid deleting when editing text inputs
                if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return

                deleteComponent(selectedId.value)
            }
        })
    }

    return {
        components,
        selectedId,
        selectedComponent,
        isPreview,
        deviceMode,
        showNavigator,
        contextMenu,
        addComponent,
        selectComponent,
        deleteComponent,
        duplicateComponent,
        generateHtml,
        saveToLocalStorage,
        loadFromLocalStorage,
        clearCanvas
    }
}
