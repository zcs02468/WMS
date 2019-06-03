<!-- 後期自適應頁面需求 按鈕 -->
<template>
    <!-- <button
        @click="handleClick"
        :type="nativeType"
        :class="[
            'tw-btn-'+ type,
            'tw-btn-w-'+wSize,
            'tw-btn-h-'+hSize,
            isShadow ? 'tw-button-shadow' : ''
        ]"
    >{{title}}</button> -->

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
            isShadow ? 'tw-button-shadow' : ''
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
            default:'default' //default--默认 medium--中等 small--小
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
        border-radius: 0.5rem;
        position: absolute;
        top: 4px;
        left: 0;
    }
}
button {
    color: #fff;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1.2rem;
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
// .tw-button-shadow {
    // box-shadow: 0 3px 2px #5E5E5E;
// }
.tw-btn-w-default {
    width: 7.8rem;  
}
.tw-btn-w-medium {
    width: 6.8rem;
}
.tw-btn-w-small {
    width: 4.7rem;
}
.tw-btn-h-default {
    height: 2.5rem;
}
.tw-btn-h-medium {
    height: 2.2rem;
}
.tw-btn-h-small {
    height: 2.1rem;
}
// default--默认 info  warning--重申   danger--未审核  success--审核中  aprimary
.tw-btn-default {
    background: rgba(57,66,68,1 );
    &:hover {
        background: #f7f7f7;
        color: rgba(57,66,68,1 );
    }
    &:active {
        box-shadow: 0.5rem 0.5rem 1.7rem rgba(0,0,0,.5);
    }
}
.tw-btn-info {
    background: rgba(57,66,68,1 );
}
.tw-btn-warning {
    background:  #FDCB6E;
}
.tw-btn-danger {
    background: #E17055;
}
.tw-btn-success {
    background: #00B894;
}
.tw-btn-aprimary {
    background: #2FBEEA;
}
.tw-btn-untreated {
    background: #e8e8e8;
}

// 2FBEEA
.tw-btn-plain {
    background: #fff;
    color: #3089d5;
}
</style>
