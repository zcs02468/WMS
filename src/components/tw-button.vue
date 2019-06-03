<!-- tw-button -->
<template>
    <div class="tw-btn-box"
        :class="[
            'tw-btn-w-'+wSize,
            'tw-btn-h-'+hSize,
        ]">
        <span class="btn-bottom-shadow" v-if="type == 'default'"></span>
        <button
        @click="handleClick"
        :type="nativeType"
        :class="[
            'tw-btn-'+ type,
            'tw-btn-w-'+wSize,
            'tw-btn-h-'+hSize,
            isShadow ? 'tw-button-shadow' : '',
            cursorWait ? 'cursorWait':''
        ]"
        >{{title}}</button>
    </div>
</template>

<script>
export default {
    name: "twButton",
    data() {
        return {};
    },
    props:{
        //按钮类型
        type:{
            type:String,
            default:'default' //default--默认 info  warning--重申   danger--未审核  success--审核中
        },
        title:{
            type:String,
            default:''
        },
        wSize:{
            type:String,
            default:'medium' //default--默认 medium--中等 small--小
        },
        hSize:{
            type:String,
            default:'default', //default--默认  medium--中等  small--小
        },
        nativeType: {
            type: String,
            default: 'button'
        },
        isShadow: Boolean,
        cursorWait: {
            type: Boolean,
            default: false
        }
    },
    components: {},

    methods: {
        handleClick(evt) {
            this.$emit("click", evt);
        }
    },

    computed: {}
};
// medium / small / big
</script>

<style lang="less" scoped>
.tw-btn-box {
    display: inline-block;
    position: relative;
    .btn-bottom-shadow {
        width: 100%;
        height: 100%;
        background: #5e5e5e;
        border-radius: 5px;
        position: absolute;
        top: 4px;
        left: 0;
    }
}
button {
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    font-size: 19px;
    position: absolute;
    left: 0;
    // position: relative;
    // &::after {
    //     content: '';
    //     width: 100%;
    //     height: 4px;
    //     border-radius: 0 0 5px 5px;
    //     position: absolute;
    //     background: red;
    //     left: 0px;
    //     bottom: -4px;

    // }
}
.tw-btn-w-default {
    width: 120px;
}
.tw-btn-w-medium {
    width: 114px;
}
.tw-btn-w-small {
    width: 72px;
}
.tw-btn-h-default {
    height: 36px;
}
.tw-btn-h-medium {
    height: 35px;
}
.tw-btn-h-small {
    height: 30px;
}
// default--默认 info  warning--重申   danger--未审核  success--审核中
.tw-btn-default {
    background: rgba(57,66,68,1 );
    &:hover {
        background: #f7f7f7;
        color: rgba(57,66,68,1 );
    }
    &:active {
        box-shadow: 5px 5px 17px rgba(0,0,0,.5);
    }
}
.tw-btn-info {
    background: rgba(57,66,68,1 );
}
.tw-btn-warning {
    background:  #fbcb6e;
}
.tw-btn-danger {
    background: #e17055;
}
.tw-btn-success {
    background: #00b894;
}
.tw-btn-plain {
    background: #fff;
    color: #3089d5;
}
.cursorWait{
    cursor: wait;
}
</style>
