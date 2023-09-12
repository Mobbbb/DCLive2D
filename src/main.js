const App = Vue.createApp({
    data() {
        return {
            selectedChildId: 'c000',
            selectedVariantId: '',
            selectedChildConfig: {
                variants: {},
            },
            CHILDS_CODE_MAP,
            viewer: null,
        }
    },
    mounted() {
        this.viewer = document.getElementsByTagName('iframe')[0]
        this.changeChilds()
    },
    methods: {
        // todo  + s 温泉
        changeChilds() {
            this.selectedChildConfig = CHILDS_CODE_MAP[this.selectedChildId]
            this.selectedVariantId = Object.keys(this.selectedChildConfig.variants)[0]
            console.log(this.selectedChildConfig.variants)
            console.log(this.selectedVariantId)
            this.updateViews()
        },
        changeVariants() {
            this.updateViews()
        },
        updateViews() {
            let size = 1000
            let scale = 1
            this.viewer.src = `./src/views/canvas.html?code=${this.selectedChildId}_${this.selectedVariantId}&size=${size}&scale=${scale}`
        },
    },   
})

App.use(ElementPlus)
App.mount('#app')  
