<template>
    <div id="app-inspection">
        <!-- 头部 -->
        <div class="inspection-head">
            <div class="inspection-head-title">巡檢叫修系統</div>
            <div class="main-data-box">
                <div class="main-date">{{date}}</div>
                <span class="main-info iconfont icon-info"></span>
            </div>
        </div>
        <!-- 内容区 -->
        <div class="inspection-content">
            <div class="inspection-content-tabs">
                <div @click="activeClick(0)" :class="{active: activeIndex == 0}"><i>+</i><span>新增巡檢單</span></div>
                <div @click="activeClick(1)" :class="{active: activeIndex == 1}"><i>+</i><span>新增叫修單</span></div>
                <div @click="activeClick(2)" :class="{active: activeIndex == 2}"><span>巡檢清單</span></div>
                <div @click="activeClick(3)" :class="{active: activeIndex == 3}"><span>巡檢叫修總覽</span></div>
                <div @click="activeClick(4)" :class="{active: activeIndex == 4}"><span>派工總覽</span></div>
                <div @click="activeClick(5)" :class="{active: activeIndex == 5}"><span>歷史清單</span></div>
            </div>
            <div class="inspection-content-items" :class="{'bg-gray': bgClass}">
                <AddInspection v-if="activeIndex == 0"></AddInspection>
                <AddCallRepair v-if="activeIndex == 1"></AddCallRepair>
                <InspectionList v-if="activeIndex == 2"></InspectionList>
                <ICROverView v-if="activeIndex == 3"></ICROverView>
                <DWOverView v-if="activeIndex == 4"></DWOverView>
                <HistoryList v-if="activeIndex == 5"></HistoryList>
            </div>
        </div>
    </div>
</template>

<script>
import AddInspection from '../components/inspection/addInspection';
import AddCallRepair from '../components/inspection/addCallRepair';
import InspectionList from '../components/inspection/inspectionList';
import ICROverView from '../components/inspection/ICR_overview';
import DWOverView from '../components/inspection/DW_overview';
import HistoryList from '../components/inspection/historyList';
export default {
    data(){
        return {
            activeIndex: 0,
            date: null
        }
    },
    components: {
        AddInspection,
        AddCallRepair,
        InspectionList,
        ICROverView,
        DWOverView,
        HistoryList
    },
    created() {
       if( this.getUrlKey('qrcode') == undefined ) {
           this.$store.state.Hash = this.getUrlKey('qrcode')
       }
    },
    computed: {
        bgClass(){
            if(this.activeIndex === 2 || this.activeIndex === 3 || this.activeIndex === 4 || this.activeIndex === 5){
                return true
            }else{
                return false
            }
        },
        inspectionTabIndex() {
            return this.$store.state.inspectionTabIndex
        }
    },
    created() {
        this.activeIndex = this.inspectionTabIndex;
        this.date = this.formatData();
    },
    methods:{
        activeClick(val) {
            this.$store.state.inspectionTabIndex = val;
        },
        //时间转换
        formatData() {
            const date = new Date();
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                // H = date.getHours(),
                // i = date.getMinutes(),
                // s = date.getSeconds(),
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
        },
        getUrlKey(name) {
            return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null;
        },
    },
    watch:{
        inspectionTabIndex(value) {
            this.activeIndex = value;
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
            color: #ffee7b;
            font-size: 2.3rem
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
                &>i{
                    color: #ffee7b;
                }
            }
            &>div:first-child{
                border-radius: 2rem 0 0 0;

            }
            &>div:last-child{
                border-radius: 0 2rem 0 0;

            }
            &>div.active{
                color: #0e293f;
                background-color: #fff;
            }
        }
        .inspection-content-items{
            width: 100%;
            height: auto;
            min-height: 59rem;
            border-radius: 3.5rem;
            box-shadow: 0 0.6rem 0 #b7b7b7;
            // padding: 2.2rem 5rem;
            background-color: #fff;
        }
    }
}
.bg-gray{
    background-color: #dfe6e9 !important;
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

