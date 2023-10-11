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
            activeType: '',
            selectedChildId: '', // c000
            selectedVariantId: '', // 01
            selectedChildConfig: {
                variants: {},
            },
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
            let arr = []
            Object.keys(CHILDS_CODE_MAP).forEach(item => {
                const attr = CHILDS_CODE_MAP[item].attribute || 'UNKNOWN'
                const star = CHILDS_CODE_MAP[item].star || 'UNKNOWN'
                const type = CHILDS_CODE_MAP[item].type || 'UNKNOWN'
    
                if (this.activeStar === 'UNKNOWN') {
                    if (attr === 'UNKNOWN' || star === 'UNKNOWN') {
                        arr.push(CHILDS_CODE_MAP[item])
                    }
                } else if (!this.activeTab && !this.activeStar && !this.activeType) {
                    arr = null
                    return
                } else if ((!this.activeTab || (this.activeTab && this.activeTab === attr)) &&
                    (!this.activeStar || (this.activeStar && this.activeStar === star)) &&
                    (!this.activeType || (this.activeType && this.activeType === type))) {
                    arr.push(CHILDS_CODE_MAP[item])
                }
            })
            return arr
        },
        ACTIVE_DOLLS_CODE_LIST() {
            let arr = []
            Object.keys(DOLLS_CODE_MAP).forEach(item => {
                const attr = DOLLS_CODE_MAP[item].attribute || 'UNKNOWN'
                const star = DOLLS_CODE_MAP[item].star || 'UNKNOWN'
    
                if (this.activeDollsStar === 'UNKNOWN') {
                    if (attr === 'UNKNOWN' || star === 'UNKNOWN') {
                        arr.push(DOLLS_CODE_MAP[item])
                    }
                } else if ((!this.activeDollsTab || (this.activeDollsTab && this.activeDollsTab === attr)) &&
                    (!this.activeDollsStar || (this.activeDollsStar && this.activeDollsStar === star))) {
                    arr.push(DOLLS_CODE_MAP[item])
                }
            })
            return arr
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

        this.clientHeight = document.body.getBoundingClientRect().height
        this.clientWidth = document.body.getBoundingClientRect().width * this.viewSize / 100

        App.config.globalProperties.$closeIframe = () => {
            this.showDrawer = false
        }
    },
    methods: {
        tabClick(pane, key) {
            if (pane.paneName === this[key]) {
                this[key] = ''
            }
        },
        selectItem(item) {
            if (this.IS_DEBUG) this.editInput.name = ''
            this.showDrawer = true
            this.selectedChildConfig = item
            this.selectedChildId = this.selectedChildConfig.id

            let recentSelectedVariantId = localStorage.getItem(`DC_${this.selectedChildId}_VID`)
            recentSelectedVariantId = recentSelectedVariantId === 's' ? '' : recentSelectedVariantId

            if (recentSelectedVariantId) {
                this.selectedVariantId = recentSelectedVariantId
            } else {
                this.selectedVariantId = this.selectedChildConfig.variants['01']
                    ? '01'
                    : Object.keys(this.selectedChildConfig.variants)[0]
            }
            this.$nextTick(() => {
                this.updateViewsHandle()
            })
        },
        changeVariants() {
            if (this.selectedVariantId === 's') {
                this.updateViews(`s${this.selectedChildId}_01`)
            } else {
                localStorage.setItem(`DC_${this.selectedChildId}_VID`, this.selectedVariantId)
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
            const res = await fetch(`http://127.0.0.1:3000/edit?name=${this.editInput.name}&type=${this.editInput.type}&star=${this.editInput.star}&attribute=${this.editInput.attribute}&id=${this.selectedChildId}&file=${file}`, { method: 'GET' })
            if (res) this.showDrawer = false
        },
        setDefaultImage(e) {
            e.target.src = './src/images/icon/default.png'
        },
    },   
})

App.use(ElementPlus)
App.mount('#app')
