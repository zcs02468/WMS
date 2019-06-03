<template>
    <div id="app">
        <router-view ></router-view>
        <dialog-box></dialog-box>
    </div>
</template>

<script>
import DialogBox from './components/dialog/dialogBox';
import API from './api/index.js'
export default {
    name: 'App',
    components:{
        DialogBox
    },
    created() {
        let qrcode = this.getUrlKey('qrcode')
        let System = this.getUrlKey('System')
        let Ticket = this.getUrlKey('Ticket')
        this.$store.state.query.qrcode = qrcode
        this.$store.state.query.System = System
        this.$store.state.query.Ticket = Ticket
    },
    methods:{
        getRem(pwidth,prem){
            let html = document.getElementsByClassName("html")[0];
            let oWidth = document.body.clientWidth || document.documentElement.clientWidth;
            html.style.fontSize = oWidth / pwidth * prem + 'px';
        },
        getUrlKey(name) {
            return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null;
        },
    },
    mounted() {
        // this.login()
        let _this = this;
        // getRem(1400,10)
        var fun = function (doc, win) {
            var docEl = doc.documentElement,
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function () {
                    var clientWidth = docEl.clientWidth;
                    if (!clientWidth) return;
                    //这里是假设在640px宽度设计稿的情况下，1rem = 20px；
                    //可以根据实际需要修改
                    let num = 10* (clientWidth / 1440);
                    docEl.style.fontSize = num + 'px';
                    _this.$store.state.fontSize = num;
                };
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
            doc.addEventListener('DOMContentLoaded', recalc, false);
        }
        fun(document, window);
    }
};
</script>

<style>
#app {
    width: 100%;
    height: auto;
    min-width: 1440px;
    padding: 0 4rem;
}
</style>
