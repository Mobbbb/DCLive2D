const App = Vue.createApp({
    data() {
        return {
            selectedChildId: 'c000',
            selectedVariantId: '',
            selectedChildConfig: {
                variants: {},
            },
            CHILDS_CODE_MAP,
        }
    },
    mounted() {
        this.changeChilds()
    },
    methods: {
        changeChilds() {
            this.selectedChildConfig = CHILDS_CODE_MAP[this.selectedChildId]
            console.log(Object.keys(this.selectedChildConfig.variants)[0])
            console.log(this.selectedChildConfig)
            this.selectedVariantId = Object.keys(this.selectedChildConfig.variants)[0]
            initModel(`${this.selectedChildId}_${this.selectedVariantId}`)
        },
        changeVariants() {
            initModel(`${this.selectedChildId}_${this.selectedVariantId}`)
        },
    },   
})

App.use(ElementPlus)
App.mount('#app')  
