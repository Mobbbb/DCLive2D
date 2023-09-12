const App = Vue.createApp({
    data() {
        return {
            editInput: {
                name: '',
				star: '',
                attribute: '',
            },
            viewSize: 85,
            iframeSize: 0,
            showDrawer: false,
            activeTab: 'L',
            activeStar: '5',
            selectedChildId: '', // c000
            selectedVariantId: '', // 01
            selectedChildConfig: {
                variants: {},
            },
            CHILDS_ATTR_GROUP: [],
            
            ATTR_MAP,
            CODE_MAP,
            HOT_SPRING_MAP,
            IS_DEBUG: false,
        }
    },
    computed: {
        ACTIVE_CHILDS_CODE_LIST() {
            return this.CHILDS_ATTR_GROUP[`${this.activeTab}-${this.activeStar}`]
        },
    },
    mounted() {
        let searchParams = (new URL(window.location.href)).searchParams
        let debug = searchParams.get('d') || ''
        if (debug) this.IS_DEBUG = true

        this.CHILDS_ATTR_GROUP = {}
        Object.keys(CHILDS_CODE_MAP).forEach(item => {
            const attr = CHILDS_CODE_MAP[item].attribute || 'UNKNOWN'
            const star = CHILDS_CODE_MAP[item].star || 'UNKNOWN'
            if (!this.CHILDS_ATTR_GROUP[`${attr}-${star}`]) {
                this.CHILDS_ATTR_GROUP[`${attr}-${star}`] = [CHILDS_CODE_MAP[item]]
            } else {
                this.CHILDS_ATTR_GROUP[`${attr}-${star}`].push(CHILDS_CODE_MAP[item])
            }
        })

        this.iframeSize = document.body.clientHeight > (document.body.clientWidth * this.viewSize / 100) ? (document.body.clientWidth * this.viewSize / 100) : document.body.clientHeight
    },
    methods: {
        selectChilds(list) {
            this.showDrawer = true
            this.selectedChildConfig = list
            this.selectedChildId = this.selectedChildConfig.id
            this.selectedVariantId = '01'
            this.$nextTick(() => {
                this.updateViews(`${this.selectedChildId}_${this.selectedVariantId}`)
            })
        },
        changeVariants() {
            if (this.selectedVariantId === 's') {
                this.updateViews(`s${this.selectedChildId}_01`)
            } else {
                this.updateViews(`${this.selectedChildId}_${this.selectedVariantId}`)
            }
        },
        updateViews(code) {
            const viewer = document.getElementsByTagName('iframe')[0]
            viewer.style.width = `${this.iframeSize}px`
            viewer.style.height = `${this.iframeSize}px`
            let size = 5000
            let scale = 1.2
            viewer.src = `./src/views/canvas.html?code=${code}&size=${size}&scale=${scale}`
        },
        async saveInputChange () {
            const res = await fetch(`http://127.0.0.1:3000/edit?name=${this.editInput.name}&star=${this.editInput.star}&attribute=${this.editInput.attribute}&id=${this.selectedChildId}`, { method: 'GET' })
            if (res) {
                this.showDrawer = false
            }
        },
    },   
})

App.use(ElementPlus)
App.mount('#app')  
