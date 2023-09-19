window.App = Vue.createApp({
    data() {
        return {
            editInput: {
                name: '',
				star: '',
                attribute: '',
            },
            clientHeight: 0,
            clientWidth: 0,
            viewSize: 100,
            footerType: '0',
            activeDollsTab: 'L',
            activeDollsStar: '5',
            activeTab: 'L',
            activeStar: '5',
            selectedChildId: '', // c000
            selectedVariantId: '', // 01
            selectedChildConfig: {
                variants: {},
            },
            CHILDS_ATTR_GROUP: {},
            DOLLS_ATTR_GROUP: {},
            CARTAS_CODE_MAP,
            DOLLS_CODE_MAP,
            SLIMS_CODE_MAP,
            OTHERS_CODE_MAP,
            
            ATTR_MAP,
            CODE_MAP,
            FOOTER_CONFIG,
            HOT_SPRING_MAP,
            OTHERS_ICON_SRC,
            showDrawer: false,
            isFullScreen: false,
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
        ACTIVE_DOLLS_CODE_LIST() {
            if (this.activeDollsTab === 'UNKNOWN') {
                return this.DOLLS_ATTR_GROUP.UNKNOWN || []
            }
            return this.DOLLS_ATTR_GROUP[`${this.activeDollsTab}-${this.activeDollsStar}`]
        },
        iframeStyle() {
            return {
                width: `${this.clientWidth}px`,
                height: `${this.clientHeight}px`,
            }
        },
        selectionNum() {
            const variantsKeys = Object.keys(this.selectedChildConfig.variants)
            let num = variantsKeys.length
            if (this.HOT_SPRING_MAP[`s${this.selectedChildId}`]) {
                num ++
                variantsKeys.forEach(key => {
                    if (key.slice(0, 1) === 's') {
                        num --
                    }
                })
            }
            return num
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

        this.DOLLS_ATTR_GROUP = {}
        Object.keys(DOLLS_CODE_MAP).forEach(item => {
            const attr = DOLLS_CODE_MAP[item].attribute || 'UNKNOWN'
            const star = DOLLS_CODE_MAP[item].star || 'UNKNOWN'

            let key = `${attr}-${star}`
            if (attr === 'UNKNOWN' || star === 'UNKNOWN' ) key = 'UNKNOWN'
            
            if (!this.DOLLS_ATTR_GROUP[key]) {
                this.DOLLS_ATTR_GROUP[key] = [DOLLS_CODE_MAP[item]]
            } else {
                this.DOLLS_ATTR_GROUP[key].push(DOLLS_CODE_MAP[item])
            }
        })

        this.clientHeight = document.body.getBoundingClientRect().height
        this.clientWidth = document.body.getBoundingClientRect().width * this.viewSize / 100

        App.config.globalProperties.$closeIframe = () => {
            this.showDrawer = false
        }
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
            viewer.src = `./src/views/canvas.html?code=${code}`
        },
        closeDrawer() {
            if (this.isFullScreen) {
                this.isFullScreen = false
            } else {
                this.showDrawer = false
            }
        },
        async saveInputChange () {
            let file = ''
            this.FOOTER_CONFIG.forEach(item => {
                if (this.footerType === item.id) {
                    file = item.dataFileName
                }
            })
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
