<template>
    <div class="tw-select" v-show="datas.length != 0">
        <div class="select-title" @click="toggleList">
            <div class="title-value">{{defVal.CodeValue}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{defVal.CodeText}}</div>
            <div class="title-icon iconfont icon-bArrow"></div>
        </div>
        <ul class="select-list" v-show="isShow">
            <li v-for="(item,i) in datas" :key="i" @click="activeCode(item)">{{item.CodeValue}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.CodeText}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['datas'],
    data(){
        return {
            isShow: false,
            defVal: {},
            hasData: true
        }
    },
    methods: {
        toggleList(){
            if(this.isShow){
                this.isShow = false;
            }else{
                this.$parent.$refs.select_1.isShow = false;
                this.$parent.$refs.select_2.isShow = false;
                this.$parent.$refs.select_3.isShow = false;
                this.$parent.itemSelect = false;
                this.isShow = true;
            }
        },
        activeCode(item){
            this.isShow = false;
            this.$emit('change',item)
            this.defVal = item;
        }
    },
    watch: {
        datas(value){
            // if(value.length == 0){} return;
            const data = value[0];
            this.$emit('change',data)
            this.defVal = data;
        }
    },
}
</script>

<style lang="less" scoped>
.tw-select{
    width: 100%;
    height: 24px;
    position: relative;
    .select-title{
        width: 100%;
        height: 100%;
        background-color: #e8e8e8;
        border-radius: 8px;
        .title-value{
            height: 24px;
            line-height: 24px;
            float: left;
            padding: 0 12px;
        }
        .title-icon{
            width: 24px;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            float: right;
        }
    }
    .select-list{
        width: 100%;
        height: auto;
        background-color: #fff;
        box-shadow: 0 0 30px #ccc;
        border-radius: 8px;
        position: absolute;
        top: 30px;
        z-index: 10;
        &>li{
            width: 100%;
            height: 24px;
            padding: 0 12px;
            cursor: pointer;
        }
        &>li:first-child{
            border-radius: 8px 8px 0 0;
        }
        &>li:last-child{
            border-radius: 0 0 8px 8px;
        }
        &>li:hover{
            color: #fff;
            background-color: #636e72;
        }
    }
}

</style>


