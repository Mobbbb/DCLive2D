const App = Vue.createApp({
    data() {
        return {
            editInput: {
                name: '',
				star: '',
                attribute: '',
            },
            clientHeight: 0,
            clientWidth: 0,
            viewSize: 85,
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
            SLIMS_CODE_MAP,
            OTHERS_CODE_MAP,
            
            ATTR_MAP,
            CODE_MAP,
            HOT_SPRING_MAP,
            OTHERS_ICON_SRC,
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
        iframeStyle() {
            return {
                width: `${this.clientWidth}px`,
                height: `${this.clientHeight}px`,
            }
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

        this.clientHeight = document.body.getBoundingClientRect().height
        this.clientWidth = document.body.getBoundingClientRect().width * this.viewSize / 100
    },
    methods: {
        select(item) {
            if (this.IS_DEBUG) this.editInput.name = ''
            this.showDrawer = true
            this.selectedChildConfig = item
            this.selectedChildId = this.selectedChildConfig.id
        },
        selectChilds(item) {
            this.select(item)
            this.selectedVariantId = this.selectedChildConfig.variants['01'] ? '01' : Object.keys(this.selectedChildConfig.variants)[0]
            this.$nextTick(() => {
                this.updateViewsHandle()
            })
        },
        selectCarts(item, key) {
            this.select(item)
            this.$nextTick(() => {
                this.updateViews(`${key}_${Object.keys(item.variants)[0]}`)
            })
        },
        selectOthers(item) {
            this.select(item)
            this.selectedVariantId = Object.keys(this.selectedChildConfig.variants)[0]
            this.$nextTick(() => {
                this.updateViewsHandle()
            })
        },
        changeVariants() {
            if (this.selectedVariantId === 's') {
                this.updateViews(`s${this.selectedChildId}_01`)
            } else {
                this.updateViewsHandle()
            }
        },
        updateViewsHandle() {
            if (this.selectedVariantId.indexOf('_') > -1) {
                this.updateViews(this.selectedVariantId)
            } else {
                this.updateViews(`${this.selectedChildId}_${this.selectedVariantId}`)
            }
        },
        updateViews(code) {
            const viewer = document.getElementsByTagName('iframe')[0]
            let size = this.clientHeight > this.clientWidth ? this.clientWidth : this.clientHeight
            let scale = 1.18
            viewer.src = `./src/views/canvas.html?code=${code}&size=${size}&scale=${scale}`
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
        setDefaultImage(e) {
            e.target.src = './src/images/icon/default.png'
        },
    },   
})

App.use(ElementPlus)
App.mount('#app')
