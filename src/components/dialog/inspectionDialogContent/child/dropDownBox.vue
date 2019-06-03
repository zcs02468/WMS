<!--  -->
<template>
    <div class="drop-down-box"
    :style="{width: wSize+'rem', height: hSize+'rem'}"
    >
        <div class="select-title" @click="changeSelect">
            <span class="title" :style="{lineHeight: hSize+'rem',width: (wSize - 2.5) + 'rem'}">{{selectTitle}}</span>
            <span class="iconfont icon-bArrow arrow" :style="{lineHeight: hSize+'rem'}"></span>
        </div>
        <div class="select-box" v-show="isShowSelectData" @mouseenter="mouseEnter">
            <ul>
                <li v-for="(item,i) in selectData" :key="i" @click="select(item)">{{item[prop]}}</li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    name: "singned",
    props:{
        wSize:{
            type:[Number,String],
            default:'default'
        },
        hSize:{
            type:[Number,String],
            default:'default'
        },
        selectData : {
            type : Array,
            default:[]
        },
        prop:{ //显示的字段
            type:String,
            default:''
        },
        title:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            selectTitle : this.title,
            isShowSelectData : false
        };
    },

    // mounted() {
    //     this.selectTitle = this.selectData[0][this.prop]
    // },

    components: {},

    methods: {
        changeSelect() {
            this.isShowSelectData = !this.isShowSelectData;
        },
        select(_item) {
            this.isShowSelectData = false;
            //向上级返回选中的下拉框数据
            this.selectTitle = _item[this.prop];
            this.$emit('selectCallback',_item)
        },
        mouseEnter() {
            clearTimeout( this.dropDownBoxTime );
        },
        mouseLeave() {
            this.isShowSelectData = false;
        }
    },

    computed: {

    },

    watch:{
        // isShowSelectData( val ) {
        //     if(val) {
        //         this.dropDownBoxTime = setTimeout(()=> {
        //             this.isShowSelectData = false;
        //         },1000)
        //     }
        // },
        selectData(val) {
            val.length == 0 && ( this.selectTitle = '請選擇')
        },
        title() {
            this.selectTitle = this.title
        }
    }
};
</script>
<style lang="less" scoped>
.drop-dowm-w-default {
    width: 9rem;
    .select-box {
        min-width: 7rem;
    }
}
.drop-dowm-w-medium {
    width: 12.6rem;
    .select-box {
        min-width: 12.6rem;
    }
}
.drop-dowm-w-small {
    width: 6.2rem;
    .select-box {
        min-width: 6.2rem;
    }
}
.drop-dowm-h-default {
    height: 2.2rem;
}
.drop-dowm-h-medium {
    height: 2rem;
}
.drop-dowm-h-small {
    height: 1.8rem;
}
.drop-down-box {
    // height: 2.2rem;
    position: relative;
    display: inline-block;
    border-radius: 0.8rem;
    background: #E8E8E8;
    font-size: 1.2rem;
    .select-title {
        width: 100%;
        height: 100%;
        padding: 0 0.7rem;
        // padding: 0 2rem 0 0.7rem;
        cursor: pointer;
        user-select: none;
        .title {
            font-size: 1.2rem;
            // line-height: 2.2rem;
            overflow: hidden;
            height: 100%;
            text-overflow:ellipsis;
            white-space: nowrap;
            display: inline-block;
        }
        .arrow {
            position: absolute;
            right: 0.7rem;
            font-size: 1.2rem;
            // line-height: 2.2rem;
        }
    }
    .select-box {
        background: #e8e8e8;
        border-radius: 0.5rem;
        overflow: hidden;
        position: absolute;
        top:2.9rem;
        width: 100%;
        box-shadow: 0 0 6px rgba(0,0,0,0.5);
        z-index: 10;
        li{
            height: 1.8rem;
            padding-left: 0.8rem;
            line-height: 1.8rem;
            font-size: 1.2rem;
            cursor: pointer;
            &:hover {
                background: #636E72;
            }
        }
    }
}
</style>