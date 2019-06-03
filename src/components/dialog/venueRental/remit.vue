<!--  -->
<template>
    <div class="dialog-floor">
        <div class="dialog-box">
            <span class="close iconfont icon-guanbi" @click="close"></span>
            <div class="dialog-content">
                <div class="remit-head">請勾選匯出項目</div>
                <ul>
                    <li v-for="(item,i) in arr" :key="i">
                       <div v-if="item.type == 'default'">
                            <span class="round" :class="{'select-color': selectNum == i}" @click="selectNum = i,itemData = item"></span>
                            <span>{{item.title}}</span>
                       </div>
                        <div v-else>
                            <span class="round" :class="{'select-color': selectNum == i}" @click="selectNum = i,itemData = item"></span>
                            <span>{{item.title}}</span>
                            <div class="slide-box">
                                <span class="title">不退保證金</span>
                                <span class="slide" @click="item.isSelect = !item.isSelect">
                                    <span class="chunk" :class="[ item.isSelect ? 'chunk-r' : 'chunk-l' ]"></span>
                                </span>
                                <span class="title">退保證金</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="remit-foot">
                    <div class="btn-box">
                        <tw-btn title="送出" @click="remit"></tw-btn>
                        <tw-btn title="取消" class="cancel" @click="close"></tw-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TwBtn from '../../tw-btn'
export default {
    name: "lookActivity",
    data() {
        return {
            selectNum : null,
            isSelect: false,
            arr:[],
            itemData:null
        };
    },

    components: {
        TwBtn
    },

    created() {
        // SignedOutList---签核  物品核发统计表 汇出
        // SignedInList---签核  物品收发月报表 汇出
        // SignedStockList---  物品盘点表 汇出
        // Month --- 场地  月报表汇出
        // Arrange--- 场地  轮值表汇出
        // Quick--- 场地  速报表汇出
        // Annual--- 场地  年收入明细表汇出
        // SurveyNon--- 场地  会勘表- 不退保证金汇出
        // Survey--- 场地  会勘表- 退保证金汇出
        let signedExport = [
            { type:'default',title:'月報表',url:'Month'},
            { type:'default',title:'輪值表',url:'Arrange'},
            { type:'default',title:'速報表',url:'Quick'},
            { type:'default',title:'年收入明細表',url:'Annual'},
            { type:'multiterm',title:'月報表',isSelect:false,url1:'SurveyNon',url2:'Survey'},
        ];
        let siteExport = [
            { type:'default',title:'物品核發統計表',url:'SignedOutList'},
            { type:'default',title:'物品收發月報表',url:'SignedInList'},
            { type:'default',title:'物品盤點表',url:'SignedStockList'},
        ]
        this.arr = signedExport
       
    },

    methods: {
        remit() {
            if(this.itemData == null) {
                this.$alert('請勾選匯出項目', '提示', {
                    confirmButtonText: '確定',
                });
                return;
            }
            let type;
            if( this.itemData.type != 'default' ) {
                if( !this.itemData.isSelect ) {
                    type = this.itemData.url1
                }else {
                    type = this.itemData.url2
                }
            }else {
                type = this.itemData.url
            }
            

        },
        close() {
            this.$store.commit("SET_IS_SHOW_DIALOG");
        }
    },

    computed: {}
};
</script>
<style lang="less" scoped>
.dialog-floor {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
    .dialog-box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 1.5rem;
        .close {
            position: absolute;
            right: -1.6rem;
            top: -1.6rem;
            display: inline-block;
            width: 3.2rem;
            height: 3.2rem;
            color: #44484c;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0px 0px 10px #ccc;
            font-size: 1.4rem;
            font-weight: 900;
            text-align: center;
            line-height: 3.2rem;
            cursor: pointer;
        }
    }
}

.dialog-content {
    padding: 4rem 5rem 4rem 5rem;
    .remit-head {
        font-size: 2.5rem;
        color: #2FBEEA;
    }
    ul {
        margin-top: 3rem;
        li {
            height: 3.6rem;
            line-height: 3.6rem;
            span {
                display: inline-block;
                font-size: 1.4rem;
                vertical-align: middle;
            }
            .round {
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 0.4rem;
                background: #BCBCBC;
                cursor: pointer;
                margin-right: 0.4rem;
            }
            .select-color {
                background: #000;
            }
            .slide-box {
                display: inline-block;
                margin-left: 0.5rem;
                user-select: none;
                .title {
                    font-size: 1.2rem;
                }
                .slide {
                    width: 2.8rem;
                    height: 1.4rem;
                    background: #bcbcbc;
                    border-radius: 0.4rem;
                    position: relative;
                    cursor: pointer;
                    vertical-align: middle;
                    margin: 0 0.5rem;
                    .chunk {
                        position: absolute;
                        right: 0;
                        width: 1.4rem;
                        height: 1.4rem;
                        background: #000;
                        border-radius: 0.4rem;
                        transition: 1s linear;
                    }
                    .chunk-l{
                        left: 0;
                    }
                    .chunk-r{
                        right: 0;
                    }
                }
            }
        }
    }
    .remit-foot {
        margin-top: 6rem;
        text-align: center;
        .btn-box {
            display: inline-block;
            .cancel {
                margin-left: 1rem;
            }
        }
    }
}
</style>