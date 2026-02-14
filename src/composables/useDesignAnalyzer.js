import { ref } from 'vue'

// 設計圖分析器 — 使用 OpenAI GPT-4o Vision API 將設計圖轉換為元件樹 JSON

const API_KEY_STORAGE = 'tailwind-editor-openai-key'
const API_BASE_STORAGE = 'tailwind-editor-openai-base'
const API_MODEL_STORAGE = 'tailwind-editor-openai-model'

// 全域狀態
const apiKey = ref(localStorage.getItem(API_KEY_STORAGE) || '')
const apiBaseUrl = ref(localStorage.getItem(API_BASE_STORAGE) || 'https://api.openai.com/v1')
const apiModel = ref(localStorage.getItem(API_MODEL_STORAGE) || 'gpt-4o')
const isAnalyzing = ref(false)
const analysisResult = ref(null)
const analysisError = ref('')
const progressText = ref('')

/**
 * 系統提示詞 — 指導 AI 如何分析設計圖並輸出正確的元件樹結構
 */
const SYSTEM_PROMPT = `你是一個專業的網頁設計分析專家。你的任務是分析一張網頁設計截圖，並將它精確地轉換為一個結構化的元件樹 JSON。

## 輸出格式
你必須輸出一個 JSON 陣列，每個元素代表一個頁面區塊。嚴格遵循以下結構：

### 元件類型（type）
- \`container\` — 容器/區塊，可包含子元件
- \`text\` — 文字
- \`button\` — 按鈕
- \`image\` — 圖片
- \`divider\` — 分隔線
- \`icon\` — 圖示

### 節點結構
\`\`\`json
{
  "type": "container",
  "props": {
    "tw": {
      "padding": "py-16 px-8",
      "bg": "bg-[#1a1a2e]",
      "flex": "flex flex-col items-center gap-8",
      "width": "w-full",
      "height": "min-h-[500px]"
    }
  },
  "children": []
}
\`\`\`

### text 節點
\`\`\`json
{
  "type": "text",
  "props": {
    "text": "辨識到的文字內容",
    "tw": {
      "size": "text-4xl",
      "weight": "font-bold",
      "color": "text-white",
      "align": "text-center"
    }
  }
}
\`\`\`

### button 節點
\`\`\`json
{
  "type": "button",
  "props": {
    "text": "按鈕文字",
    "tw": {
      "padding": "px-8 py-3",
      "bg": "bg-blue-600",
      "color": "text-white",
      "rounded": "rounded-lg",
      "hover": "hover:bg-blue-700"
    }
  }
}
\`\`\`

### image 節點
\`\`\`json
{
  "type": "image",
  "props": {
    "src": "",
    "tw": {
      "width": "w-full",
      "height": "h-64",
      "objectFit": "object-cover",
      "rounded": "rounded-lg"
    }
  }
}
\`\`\`

## 分析規則

### 1. 分層分析
- 從上到下辨識每個 section（nav、hero、features、cards、footer 等）
- 每個 section 都是一個頂層 container
- 疊圖效果用嵌套 container 表示（背景圖 container → 半透明遮罩 container → 內容）

### 2. 佈局推理
- 判斷 grid 系統（2欄、3欄、4欄等），使用 Tailwind 的 grid 類別
- 判斷 flex 方向（row / column）
- 推理精確的 gap 數值（gap-4, gap-6, gap-8 等）
- 推理 padding 和 margin 數值

### 3. 設計 Token 還原
- 顏色：使用精確的 hex 值，格式為 \`bg-[#hex]\` 或 \`text-[#hex]\`
- 圓角：推理 border-radius（rounded-sm / rounded / rounded-lg / rounded-xl / rounded-full）
- 陰影：推理 shadow 層級（shadow-sm / shadow / shadow-md / shadow-lg / shadow-xl）
- 字型大小：使用 Tailwind 的 text-xs ~ text-9xl

### 4. 文字辨識（OCR）
- 精確辨識所有可見文字
- 保留原始語言（不翻譯）
- 判斷文字的語意角色（標題、副標題、段落、按鈕文字、標籤）

### 5. 圖片處理
- 圖片區域用 image 節點表示
- src 留空字串（因為無法還原原始圖片URL）
- 精確設定圖片容器的尺寸和裁切方式

### 6. 疊圖與遮罩
- 背景圖：使用 \`bg-[url(...)]\` 或留空讓使用者自行設定
- 半透明遮罩：用 container + \`bg-black/50\`（調整透明度）+ absolute positioning
- 漸層遮罩：使用 \`bg-gradient-to-r from-black/60 to-transparent\`

### 7. Tailwind tw 物件的 key 命名規則
tw 物件的 key 請使用以下命名：
- padding, margin — 間距
- bg — 背景色/背景圖
- color — 文字顏色
- size — 字型大小
- weight — 字型粗細
- align — 文字對齊
- flex — flex/grid 佈局
- width, height — 寬高
- rounded — 圓角
- shadow — 陰影
- border — 邊框
- hover — hover 效果
- display — display 屬性
- position — 定位方式
- opacity — 透明度
- overflow — 溢出處理
- objectFit — 圖片填充

## 注意事項
- 不要生成 id 欄位，系統會自動生成
- children 陣列不能省略，沒有子元件時設為空陣列 []
- 確保所有節點都有 type 和 props 欄位
- tw 物件中只使用合法的 Tailwind CSS 類別
- 盡量精確還原原設計的比例、間距、色彩
- 回應中只包含 JSON 陣列，不要包含任何其他文字或 markdown 標記`

/**
 * 使用者提示詞
 */
const USER_PROMPT = `請仔細分析這張網頁設計圖，將它轉換為元件樹 JSON。

請做到：
1. 精確辨識每個區塊（section）的邊界和層次
2. 所有文字必須用 OCR 精確辨識，不能遺漏或猜測
3. 顏色要精確到 hex（如 bg-[#2d1b69]）
4. 佈局要精確（幾欄、gap、padding）
5. 疊圖效果要用嵌套 container 正確表達
6. 按鈕、連結等互動元素要辨識為 button 類型

直接輸出 JSON 陣列，不要包含任何 markdown 或說明文字。`

export function useDesignAnalyzer() {

    /**
     * 儲存 API 設定到 localStorage
     */
    const saveApiSettings = () => {
        localStorage.setItem(API_KEY_STORAGE, apiKey.value)
        localStorage.setItem(API_BASE_STORAGE, apiBaseUrl.value)
        localStorage.setItem(API_MODEL_STORAGE, apiModel.value)
    }

    /**
     * 將圖片檔案轉為 base64
     */
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    /**
     * 遞迴為元件樹中每個節點生成 UUID
     */
    const assignIds = (nodes) => {
        return nodes.map(node => ({
            ...node,
            id: crypto.randomUUID(),
            children: node.children ? assignIds(node.children) : [],
            props: node.props || {}
        }))
    }

    /**
     * 驗證並修正元件樹結構
     */
    const validateAndFix = (nodes) => {
        if (!Array.isArray(nodes)) {
            throw new Error('分析結果格式不正確：預期為 JSON 陣列')
        }

        const validTypes = ['container', 'text', 'button', 'image', 'divider', 'icon', 'video', 'input', 'textarea', 'label']

        const fixNode = (node) => {
            // 確保基本結構
            if (!node.type || !validTypes.includes(node.type)) {
                node.type = 'container'
            }
            if (!node.props) {
                node.props = {}
            }
            if (!node.props.tw) {
                node.props.tw = {}
            }

            // text / button 必須有 text 屬性
            if ((node.type === 'text' || node.type === 'button' || node.type === 'label') && !node.props.text) {
                node.props.text = node.type === 'button' ? 'Button' : 'Text'
            }

            // 確保 children 是陣列
            if (node.type === 'container') {
                if (!Array.isArray(node.children)) {
                    node.children = []
                }
                node.children = node.children.map(fixNode)
            } else {
                node.children = []
            }

            return node
        }

        return nodes.map(fixNode)
    }

    /**
     * 從 AI 回應中提取 JSON
     */
    const extractJson = (text) => {
        // 嘗試直接解析
        try {
            return JSON.parse(text)
        } catch (e) {
            // 忽略，嘗試其他方式
        }

        // 嘗試從 markdown 代碼塊中提取
        const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
        if (codeBlockMatch) {
            try {
                return JSON.parse(codeBlockMatch[1])
            } catch (e) {
                // 忽略
            }
        }

        // 嘗試找到第一個 [ 和最後一個 ] 之間的內容
        const firstBracket = text.indexOf('[')
        const lastBracket = text.lastIndexOf(']')
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            try {
                return JSON.parse(text.slice(firstBracket, lastBracket + 1))
            } catch (e) {
                // 忽略
            }
        }

        throw new Error('無法從 AI 回應中解析出有效的 JSON')
    }

    /**
     * 主分析函式
     */
    const analyzeDesignImage = async (imageFile) => {
        if (!apiKey.value) {
            analysisError.value = '請先設定 API Key'
            return null
        }

        isAnalyzing.value = true
        analysisError.value = ''
        analysisResult.value = null
        progressText.value = '正在讀取圖片...'

        try {
            // 1. 圖片轉 base64
            const base64Image = await fileToBase64(imageFile)
            progressText.value = '正在上傳至 AI 分析...'

            // 2. 呼叫 OpenAI API
            saveApiSettings()

            const baseUrl = apiBaseUrl.value.replace(/\/+$/, '')
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey.value}`
                },
                body: JSON.stringify({
                    model: apiModel.value,
                    messages: [
                        {
                            role: 'system',
                            content: SYSTEM_PROMPT
                        },
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: USER_PROMPT
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: base64Image,
                                        detail: 'high'
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 16000,
                    temperature: 0.1
                })
            })

            progressText.value = '正在解析 AI 回應...'

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    errorData.error?.message ||
                    `API 請求失敗 (${response.status}: ${response.statusText})`
                )
            }

            const data = await response.json()
            const content = data.choices?.[0]?.message?.content

            if (!content) {
                throw new Error('AI 未回傳有效內容')
            }

            // 3. 解析 JSON
            progressText.value = '正在處理元件結構...'
            const rawTree = extractJson(content)

            // 4. 驗證並修正
            const fixedTree = validateAndFix(rawTree)

            // 5. 生成 ID
            const treeWithIds = assignIds(fixedTree)

            analysisResult.value = treeWithIds
            progressText.value = '分析完成！'

            return treeWithIds

        } catch (error) {
            analysisError.value = error.message || '分析過程中發生未知錯誤'
            progressText.value = ''
            return null
        } finally {
            isAnalyzing.value = false
        }
    }

    /**
     * 重置分析結果
     */
    const resetAnalysis = () => {
        analysisResult.value = null
        analysisError.value = ''
        progressText.value = ''
    }

    /**
     * 計算元件樹中的節點數量
     */
    const countNodes = (nodes) => {
        if (!nodes) return 0
        let count = 0
        for (const node of nodes) {
            count++
            if (node.children) {
                count += countNodes(node.children)
            }
        }
        return count
    }

    return {
        apiKey,
        apiBaseUrl,
        apiModel,
        isAnalyzing,
        analysisResult,
        analysisError,
        progressText,
        saveApiSettings,
        analyzeDesignImage,
        resetAnalysis,
        countNodes
    }
}
