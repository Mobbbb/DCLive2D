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
            footerType: '0',
            activeTab: 'L',
            activeStar: '5',
            selectedChildId: '', // c000
            selectedVariantId: '', // 01
            selectedChildConfig: {
                variants: {},
            },
            CHILDS_ATTR_GROUP: [],
            CARTAS_CODE_MAP,
            DOLLS_CODE_MAP,
            
            ATTR_MAP,
            CODE_MAP,
            HOT_SPRING_MAP,
            IS_DEBUG: false,
        }
    },
    computed: {
        ACTIVE_CHILDS_CODE_LIST() {
            if (this.activeTab === 'UNKNOWN') {
                return this.CHILDS_ATTR_GROUP.UNKNOWN || []
            }
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

            let key = `${attr}-${star}`
            if (attr === 'UNKNOWN' || star === 'UNKNOWN' ) key = 'UNKNOWN'
            
            if (!this.CHILDS_ATTR_GROUP[key]) {
                this.CHILDS_ATTR_GROUP[key] = [CHILDS_CODE_MAP[item]]
            } else {
                this.CHILDS_ATTR_GROUP[key].push(CHILDS_CODE_MAP[item])
            }
        })

        const clientHeight = document.body.getBoundingClientRect().height
        const clientWidth = document.body.getBoundingClientRect().width

        this.iframeSize = clientHeight > (clientWidth * this.viewSize / 100) ? (clientWidth * this.viewSize / 100) : clientHeight
    },
    methods: {
        selectChilds(item) {
            if (this.IS_DEBUG) this.editInput.name = ''
            this.showDrawer = true
            this.selectedChildConfig = item
            this.selectedChildId = this.selectedChildConfig.id
            this.selectedVariantId = '01'
            this.$nextTick(() => {
                this.updateViews(`${this.selectedChildId}_${this.selectedVariantId}`)
            })
        },
        selectCarts(item, key) {
            this.showDrawer = true
            this.selectedChildConfig = item
            this.selectedChildId = this.selectedChildConfig.id
            this.$nextTick(() => {
                this.updateViews(`${key}_${Object.keys(item.variants)[0]}`)
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
            viewer.src = `./src/views/canvas.html?code=${code}&size=${size}&scale=${scale}&type=${this.footerType}`
        },
        async saveInputChange () {
            const fileMap = {
                '0': 'childs',
                '1': 'dolls',
                '2': 'cartas',
            }
            const file = fileMap[this.footerType]
            const res = await fetch(`http://127.0.0.1:3000/edit?name=${this.editInput.name}&star=${this.editInput.star}&attribute=${this.editInput.attribute}&id=${this.selectedChildId}&file=${file}`, { method: 'GET' })
            if (res) this.showDrawer = false
        },
    },   
})

App.use(ElementPlus)
App.mount('#app')
