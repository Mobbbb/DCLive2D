const App = Vue.createApp({
    data() {
        return {
            showDrawer: false,
            activeTab: 'L',
            selectedChildId: 'c000',
            selectedVariantId: '',
            selectedChildConfig: {
                variants: {},
            },
            CHILDS_ATTR_GROUP: [],
            
            ATTR_MAP,
            CODE_MAP,
        }
    },
    computed: {
        ACTIVE_CHILDS_CODE_LIST() {
            return this.CHILDS_ATTR_GROUP[this.activeTab]
        },
    },
    mounted() {
        this.CHILDS_ATTR_GROUP = {}
        Object.keys(CHILDS_CODE_MAP).forEach(item => {
            const attr = CHILDS_CODE_MAP[item].attribute || 'UNKNOWN'
            if (!this.CHILDS_ATTR_GROUP[attr]) {
                this.CHILDS_ATTR_GROUP[attr] = [CHILDS_CODE_MAP[item]]
            } else {
                this.CHILDS_ATTR_GROUP[attr].push(CHILDS_CODE_MAP[item])
            }
        })
    },
    methods: {
        selectChilds(list) {
            this.showDrawer = true
            this.selectedChildConfig = list
            this.selectedChildId = this.selectedChildConfig.id
            this.selectedVariantId = '01'
            this.$nextTick(() =>{
                this.updateViews()
            })
        },
        // todo  + s 温泉
        changeChilds() {
            this.updateViews()
        },
        changeVariants() {
            this.updateViews()
        },
        updateViews() {
            const viewer = document.getElementsByTagName('iframe')[0]
            let size = 1000
            let scale = 1
            viewer.src = `./src/views/canvas.html?code=${this.selectedChildId}_${this.selectedVariantId}&size=${size}&scale=${scale}`
        },
    },   
})

App.use(ElementPlus)
App.mount('#app')  
