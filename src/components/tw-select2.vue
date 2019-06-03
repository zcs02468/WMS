<template>
    <div class="tw-select">
        <div class="select-title" @click="toggleList">
            <div class="title-value">{{nowVal.mes}}</div>
            <div class="title-icon iconfont icon-bArrow"></div>
        </div>
        <ul class="select-list" v-show="isShow">
            <li v-for="item in this.datas" @click="changeType(item)">{{item.mes}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        datas: {
            type: Array,
            default: []
        }
    },
    data(){
        return {
            nowVal: '',
            isShow: false
        }
    },
    methods: {
        changeType(type){
            this.$store.state.clearSearchValue = true;
            this.$emit('change',type);
            this.nowVal = type;
            this.isShow = false;
        },
        toggleList(){
            this.isShow = !this.isShow;
        }
    },
    created(){
        this.nowVal = this.datas[0]
    }
}
</script>


<style lang="less" scoped>
.tw-select{
    position: relative;
    width: 8rem;
    height: 2.4rem;
    font-size: 1.1rem;
    user-select: none;
    .select-title{
        background-color: #959ea2;
        border-radius: 0.6rem;
        display: flex;
        line-height: 2.4rem;
        color: #fff;
        .title-value{
            flex: 1;
            text-indent: 20px;
        }
        .title-icon{
            width: 30px;
            text-align: center;
        }
    }
    .select-list{
        width: 100%;
        height: auto;
        position: absolute;
        top: 3rem;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0 0 30px #ccc;
        z-index: 100;
        border-radius: 0.6rem;
        &>li{
            width: 100%;
            height: 2.4rem;
            line-height: 2.4rem;
            text-indent: 20px;
        }
        &>li:hover {
            color: #fff;
            background-color: #959ea2;
            cursor: pointer;
        }
    }
}
</style>

