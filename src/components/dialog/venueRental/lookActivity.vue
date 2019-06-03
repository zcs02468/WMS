<!--  -->
<template>
    <div class="dialog-floor">
        <div class="dialog-box">
            <span class="close iconfont icon-guanbi" @click="close"></span>
            <div class="dialog-content">
                <div class="content-head">
                    <span class="iconfont icon-arrowL" :class="{'noDrop' : allIndex == 0 }"  @click="preClick"></span>
                    <div>{{year}}&nbsp;年&nbsp;{{month}}&nbsp;月{{day}}&nbsp;日</div>
                    <span class="iconfont icon-arrowR" :class="{'noDrop' : allIndex == 41 }"  @click="nextClick"></span>
                </div>
                <div class="content-body" v-if="calendarData.length!=0">
                    <p>{{calendarData[lookIndex].ActivityTitle}}</p>
                    <ul>
                        <li>
                            <span class="title">開始時間(含場佈)</span>
                            <span class="content">
                                <span>{{ calendarData[lookIndex].BeginTime | formatData}}</span>
                                <span>{{calendarData[lookIndex].BeginTime | filterWeek}}&nbsp;起</span>
                            </span>
                        </li>
                        <li>
                            <span class="title">結束時間(含撤場)</span>
                            <span class="content">
                                <span>{{ calendarData[lookIndex].EndTime | formatData}}</span>
                                <span>{{calendarData[lookIndex].EndTime | filterWeek}}&nbsp;止</span>
                            </span>
                        </li>
                        <li>
                            <span class="title">活動開始</span>
                            <span class="content">
                                <span>{{ calendarData[lookIndex].AcBeginTime | formatData}}</span>
                                <span>{{calendarData[lookIndex].AcBeginTime | filterWeek}}&nbsp;起</span>
                            </span>
                        </li>
                        <li>
                            <span class="title">活動結束</span>
                            <span class="content">
                                <span>{{ calendarData[lookIndex].AcEndTiem | formatData}}</span>
                                <span>{{calendarData[lookIndex].AcEndTiem | filterWeek}}&nbsp;止</span>
                            </span>
                        </li>

                        <li class="spacing">
                            <span class="title">承辦組</span>
                            <span class="content">{{ calendarData[lookIndex].Contact.Dept }}</span>
                        </li>
                        <li>
                            <span class="title">承辦人</span>
                            <span class="content">{{ calendarData[lookIndex].Contact.Name }}</span>
                        </li>
                        <li>
                            <span class="title">電話</span>
                            <span class="content">{{ calendarData[lookIndex].Contact.Phone }}</span>
                        </li>

                        <li class="spacing">
                            <span class="title">使用單位</span>
                            <span class="content">{{ calendarData[lookIndex].LendingContact.Dept }}</span>
                        </li>
                        <li>
                            <span class="title">聯絡人員</span>
                            <span class="content">{{ calendarData[lookIndex].LendingContact.Name }}</span>
                        </li>
                        <li>
                            <span class="title">電話</span>
                            <span class="content">{{ calendarData[lookIndex].LendingContact.Phone }}</span>
                        </li>

                        <li class="spacing">
                            <span class="title">活動地點</span>
                            <span class="content">{{ calendarData[lookIndex].LendingSite }}</span>
                        </li>
                        <li>
                            <span class="title">填表日期</span>
                            <span class="content">{{ calendarData[lookIndex].CreatedTime | formatData }}</span>
                        </li>
                        <li>
                            <span class="title">活動內容</span>
                            <span class="content">{{ calendarData[lookIndex].ActivityContent }}</span>
                        </li>
                        <li>
                            <span class="title">備註</span>
                            <span class="content">{{ calendarData[lookIndex].Remark }}</span>
                        </li>
                    </ul>
                </div>
                <div class="dialog-info" v-if="calendarData.length==0">無數據</div>
                <div class="content-control" v-if="calendarData.length!=0">
                    <span class="iconfont icon-add" title="上一條活動" :class="{'noDrop' : lookIndex == 0 }" @click="lookPre"></span>
                    <span>{{lookIndex + 1}}</span>
                    <span class="iconfont icon-subtract" title="下一條活動" :class="{'noDrop' : lookIndex == maxIndex }" @click="lookNext"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "lookActivity",
    data() {
        return {
            lookIndex:0,
            maxIndex : 0,
            allIndex:0 ,
            year:0,
            month:0,
            day:0,
        };
    },

    components: {},

    created() {
        this.allIndex = this.$store.state.calendarData.index;
        this.initData()
    },

    methods: {
        preClick() {    
            if( this.allIndex == 0 ) return;
            this.allIndex--;
            this.initData();
        },
        nextClick() {
            if( this.allIndex >= 41 ) return;
            this.allIndex++;
            this.initData();
        },
        initData() {
            this.lookIndex = 0;
            let nowData = this.$store.state.calendarData.nowData[this.allIndex]
            if( nowData.work.length == 0) {
                this.maxIndex = 0;
            }else {
                this.maxIndex = nowData.work.length - 1;
            }
            this.getNowTime(nowData.tag)
        }, 
        lookNext() {
            if( this.lookIndex >= this.maxIndex ) {
                return 
            }
            this.lookIndex++;
        },
        lookPre() {
            this.lookIndex <= 0 ?  (this.lookIndex =0) : ( this.lookIndex--)
        },
        getNowTime(_data) {
            this.year = _data.slice(0,4);
            this.month = _data.slice(4,6);
            this.day = _data.slice(6,8);
        },
        close() {
            this.$store.commit("SET_IS_SHOW_DIALOG");
        },
    },

    computed: {
        calendarData() {
            return this.$store.state.calendarData.nowData[this.allIndex].work
        }
    },
    filters: {
        dateToDate(date){
            if(!date) return ;
            const _date = date.split('T')[0]
            const __date = _date.split('-')
            __date[0] =  __date[0] - 1911
            return __date.join('/')
        },
        //时间转换
        formatData(val) {
            const date = new Date(val)
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes(),
                // s = date.getSeconds(),
                w = date.getDay();//注:0-6对应为星期日到星期六
            return `${Y-1911}年${m}月${d}日`
        },
        filterWeek(val) {
            const date = new Date(val)
            let 
                H = date.getHours(),
                i = date.getMinutes(),
                w = date.getDay();//注:0-6对应为星期日到星期六
            i < 10 && (i = '0' + i)
            let week = ['日','一','二','三','四','五','六']
            return `| 星期${week[w]} | ${H}:${i}`
        }
    },
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
    .content-head{
        width: 22rem;
        height: 2.2rem;
        background: #fff;
        border-radius: 1rem;
        position: relative;
        line-height: 2.2rem;
        left: 50%;
        transform: translateX(-50%);
        div {
            text-align: center;
            font-size: 1.6rem;
            user-select: none;
        }
        .iconfont {
            position: absolute;
            font-size: 1.5rem;
            cursor: pointer;
            user-select: none;

        }
        .icon-arrowL {
            left: 1rem;
        }
        .icon-arrowR {
            top: 0;
            right: 1rem;
        }
        .noDrop {
            cursor: no-drop;
        }
    }
    .content-body {
        width: 33rem;
        margin-top: 3rem;
        p {
            font-size: 1.6rem;
            color: #0984E3;
        }
        ul {
            width: 100%;
            margin-top: 2rem;
            li {
                span{
                    display: inline-block;
                    font-size: 1.2rem;
                    line-height: 2rem;
                }
                
                .title {
                    width: 9.7rem;
                }
                .content {
                    width: 22rem;
                    span {
                        &:nth-child(1) {
                            width: 10rem;
                        }
                    }
                }
            }
            .spacing {
                margin-top: 1rem;
            }
        }
    }
    .content-control{
        position: absolute;
        bottom: 4rem;
        right: 3rem;
        height: 6rem;
        width: 2rem;
        user-select: none;
        span{
            display: inline-block;
            width: 2rem;
            height: 2rem;
            left: 0;
            line-height: 2rem;
            text-align: center;
            position: absolute;
            font-size: 1.2rem;
            &:nth-child(1) {
                top: 0;
                cursor: pointer;
            }
            &:nth-child(2) {
                top: 2rem;
            }   
            &:nth-child(3) {
                top: 4rem;
                cursor: pointer;
            }
        }
        
        span.noDrop {
            cursor: no-drop;
        }
    }
}

.dialog-info {
    height: 36rem;
    text-align: center;
    line-height: 36rem;
    font-size: 1.4rem;
}
</style>