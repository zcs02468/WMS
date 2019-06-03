<template>
    <div class="app-management">
        <div class="management-head">
            <div class="app-title">倉儲管理系統</div>
            <div class="app-user-box">
                <div class="main-user-type">{{userData.Dept || ''}}</div>
                <div class="main-user-name">
                    <span class="user-name">{{userData.Name || ''}}</span>
                    <span class="user-ip">IP: {{userData.IP || ''}}</span>
                </div>
            </div>
            <div class="main-data-box">
                <div class="main-date">{{date}}</div>
                <span class="main-info iconfont icon-info"></span>
            </div>
        </div>
        <div class="management-content">
            <div class="content-tab">
                <div :class="{active: nowIndex == 1}" @click="nowIndex = 1">主 倉</div>
                <div :class="{active: nowIndex == 2}"  @click="nowIndex = 2">備 倉</div>
                <div :class="{active: nowIndex == 3}"  @click="nowIndex = 3">簽 核</div>
            </div>
            <div class="content-item">
                <master-tab v-if="nowIndex == 1" type="1"></master-tab>
                <slave-tab v-if="nowIndex == 2" type="2"></slave-tab>
                <sign-tab v-if="nowIndex == 3" type="3"></sign-tab>
            </div>
        </div>
    </div>
</template>

<script>
import MasterTab from '../components/tab/masterTab.vue';
import SlaveTab from '../components/tab/slaveTab.vue';
import SignTab from '../components/tab/signTab.vue';
export default {
    data() {
        return {
            nowIndex: 1,
            date: null
        };
    },
    components: {
        MasterTab,
        SlaveTab,
        SignTab
    },
    created() {
        this.date = this.formatData();
    },
    methods: {

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
        }
    },
    watch: {
        nowIndex(value){
            this.$store.commit('addData',{key: 'storageSelectData',value: []})
        }
    },
    computed:{
        userData() {
            return this.$store.state.userData
        }
    }
    // beforeRouteEnter (to, from, next) {
    //     console.log( to, from ,next,'2222222222'   )
    //     return true
    // }
};
</script>

<style lang="less" scoped>
.app-main {
    height: 1377px;
}
.app-management {
    width: 100%;
    height:auto;
    .management-head{
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .app-title {
            color: #74B9FF;
            font-size: 2.3rem;
            margin-left: 70px;
        }
        .app-user-box {
            height: 50px;
            border-radius: 8px;
            overflow: hidden;
            .main-user-type {
                float: left;
                width: 116px;
                background: #E17055;
                color: #fff;
                height: 100%;
                font-size: 17px;
                line-height: 50px;
                text-align: center;
            }
            .main-user-name {
                float: left;
                width: 280px;
                background: #636e72;
                height: 100%;
                span {
                    display: inline-block;
                    height: 50px;
                    line-height: 50px;
                    font-size: 17px;
                    color: #fff;
                    vertical-align: middle;
                }
                .user-name {
                    width: 100px;
                    padding-left: 28px;
                }
            }
        }
        .main-data-box {
            width: 340px;
            height: 50px;
            float: right;
            line-height: 50px;
            .main-date {
                color: #868b8c;
                font-size: 21px;
                float: left;
            }
            .main-info {
                float: right;
                width: 50px;
                height: 50px;
                color: #fff;
                background: #636e72;
                font-size: 30px;
                text-align: center;
                border-radius: 5px;
            }
        }
    }
    .management-content{
        width: 100%;
        height: auto;
        .content-tab{
            width: auto;
            // height: 30px;
            // line-height: 30px;
            margin-left: 50px;
            display: flex;
            justify-content: flex-start;
            &>div {
                width: 140px;
                height: 3rem;
                line-height: 3rem;
                color: #fff;
                text-align: center;
                background-color: #636e72;
                cursor: pointer;
            }
            &>div:first-child {
                border-radius: 20px 0 0 0;

            }
            &>div:last-child {
                border-radius: 0 20px 0 0;
            }
            &>div.active {
                color: #0e293f;
                background-color: #dfe6e9;
            }
        }
        .content-item{
            width: 100%;
            height: auto;
            border-radius: 35px;
            box-shadow: 0 6px 0 #b7b7b7;
            padding: 30px 50px;
            background-color: #dfe6e9;

        }
    }
}
</style>

