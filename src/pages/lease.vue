<template>
    <div id="app-inspection">
        <!-- 头部 -->
        <div class="inspection-head">
            <div class="inspection-head-title" @click="routeSite">場地租借管理系統</div>
            <div class="main-data-box">
                <div class="main-date">{{date}}</div>
                <span class="main-info iconfont icon-info"></span>
            </div>
        </div>
        <!-- 内容区 -->
        <div class="inspection-content">
            <div class="inspection-content-tabs">
                <div @click="activeIndex = 0,showPane = false" :class="{active: activeIndex == 0}"><span>清單</span></div>
                <div @click="activeIndex = 1,showPane = false" :class="{active: activeIndex == 1}"><span>歷史清單</span></div>
            </div>
            <div class="inspection-content-items">
                <LeaseList v-if="activeIndex == 0" @openDialog="openDialog"></LeaseList>
                <LeaseHistoryList v-if="activeIndex == 1" @openDialog="openDialog"></LeaseHistoryList>
                <LeaseDialog v-if="showPane" @closeDialog="closeDialog"></LeaseDialog>
            </div>
        </div>
    </div>
</template>

<script>
import LeaseList from '../components/lease/leaseList';
import LeaseHistoryList from '../components/lease/leaseHistoryList';
import LeaseDialog from '../components/lease/leaseDialog';
export default {
    data(){
        return {
            activeIndex: 0,
            date: null,
            showPane: false

        }
    },
    components: {
        LeaseList,
        LeaseHistoryList,
        LeaseDialog
    },
    created() {
        this.$store.state.storageSelectData = []
        this.date = this.formatData();
    },
    methods:{
        openDialog() {
            this.showPane = true;
        },
        closeDialog() {
            this.showPane = false;
        },
        routeSite() {
           const {href} = this.$router.resolve({
                    name: 'Site',
                })
            window.open(href, '_blank')
        },
        //时间转换
        formatData() {
            const date = new Date();
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                w = date.getDay();//注:0-6对应为星期日到星期六
                Y = Y-1911;
            switch (w) {
                case 0:
                    w = '日'
                    break;
                case 1:
                    w = '一'
                    break;
                case 2:
                    w = '二'
                    break;
                case 3:
                    w = '三'
                    break;
                case 4:
                    w = '四'
                    break;
                case 5:
                    w = '五'
                    break;
                case 6:
                    w = '六'
                    break;
                default:
                    break;
            }
            const t = `${Y}  年  ${m}  月  ${d} 日    星 期 ${w}`
            return t;
        }
    }
}
</script>

<style lang="less" scoped>
#app-inspection{
    width: 100%;
    height: auto;
    .inspection-head{
        width: 100%;
        height: 7rem;
        height: 7rem;
        line-height: 7rem;
        font-size: 1.7rem;
        padding-left: 5rem;
        display: flex;
        justify-content: space-between;
        .inspection-head-title{
            font-size: 2.3rem;
            color: #fff;
            cursor: pointer;
        }
    }
    .inspection-content{
        width: 100%;
        height: auto;
        .inspection-content-tabs{
            width: auto;
            height: 3rem;
            margin-left: 5rem;
            display: flex;
            justify-content: flex-start;
            &>div{
                width: 14rem;
                line-height: 3rem;
                text-align: center;
                color: #fff;
                background-color: #636e72;
                cursor: pointer;
            }
            &>div:first-child{
                border-radius: 2rem 0 0 0;

            }
            &>div:last-child{
                border-radius: 0 2rem 0 0;

            }
            &>div.active{
                color: #0e293f;
                background-color: #dfe6e9;
            }
        }
        .inspection-content-items{
            width: 100%;
            height: auto;
            min-height: 60rem;
            border-radius: 3.5rem;
            box-shadow: 0 0.6rem 0 #b7b7b7;
            background-color: #dfe6e9;
            position: relative;
        }
    }
}
.main-data-box {
    width: 25rem;
    height: 5rem;
    float: right;
    line-height: 5rem;
    .main-date {
        color: #868b8c;
        font-size: 1.8rem;
        float: left;
    }
    .main-info {
        float: right;
        width: 3rem;
        height: 3rem;
        color: #fff;
        background: #636e72;
        font-size: 2.5rem;
        text-align: center;
        border-radius: 0.5rem;
        line-height: 3rem;
        margin-top: 1rem;
    }
}
</style>

