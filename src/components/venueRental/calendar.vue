<!--  -->
<template>
        <div class="calendar">
            <div class="calendar-head">
                <span v-for="(item,i) in dayHeader" :key="i">{{item}}</span>
            </div>
            <div class="calendar-main">
                <div class="day" v-for="( item,i ) in calendarArr" :key="i" :class="{ 'day-mask': item.type == 'pre' || item.type == 'next' }">
                    <p :class="{'select-day' :  item.type == 'normal' && item.content == nowDate && selectedMonth  == nowMonth && selectedYear == nowYear }">{{item.content}}</p>
                    <div class="work" 
                    v-for="(ele,index) in item.work" 
                    :key="index" 
                    @click="lookNowDay(item,index,i)" 
                    :class="{
                        'am-start' :  ele.timeType < 12,
                        'night-start' : ele.timeType > 16,
                        }">{{ele.ActivityTitle}}</div>
                </div>
            </div>
        </div>

</template>

<script>
export default {
    name: "calendar",
    props:{
        calendarArr:{
            type:Array,
            default:[]
        },
        selectedYear:{
            type:Number,
            default:''
        },
        selectedMonth:{
            type:Number,
            default:''
        },
        selectedDate:{
            type:Number,
            default:''
        },
    },
    data() {
        return {
            dayHeader: ["日", "一", "二", "三", "四", "五", "六"],
            nowYear: new Date().getFullYear(),
            nowMonth: new Date().getMonth(),
            nowDate: new Date().getDate(),
            monthArr: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            selectNum: 0
        };
    },

    components: {},

    methods: {
        //查看當天信息
        lookNowDay(_item,_index,_i) {
            this.$store.state.dialogType = 'lookActivity';
            this.$store.state.isShowDialog = true;
            this.$store.state.calendarData.index = _i;
            this.$store.state.calendarData.nowData = this.calendarArr;
        },
    },

    computed: {}
};
</script>
<style lang="less" scoped>
.content-item {
    width: 100%;
    height: auto;
    border-radius: 35px;
    box-shadow: 0 6px 0 #b7b7b7;
    padding: 30px 50px 0 50px;
    background-color: #dfe6e9;
    .calener-location {
        padding-left: 1rem;
        span {
            display: inline-block;
            vertical-align: middle;
            font-size: 1.2rem;
        }
        li {
            display: inline-block;
            margin-right: 1.7rem;
            height: 2rem;
            line-height: 2rem;
        }
        .round {
            width: 1.2rem;
            height: 1.25rem;
            border-radius: 0.4rem;
            background: #fff;
            margin-right: 0.5rem;
            vertical-align: middle;
            cursor: pointer;
        }
        .select-color {
            background: #000;
        }
    }
}
.calendar {
    .calendar-head {
        height: 3rem;
        span {
            padding: 0.8rem 0 0 0.8rem;
            width: 14.285%;
            float: left;
            font-size: 1.2rem;
        }
    }
    .calendar-main {
        background: #fff;
        border-top: 2px solid #707b7d;
        border-right: 2px solid #707b7d;
        border-radius: 1rem;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        .day {
            width: 14.285%;
            min-height: 8.7rem;
            border-left: 2px solid #707b7d;
            border-bottom: 2px solid #707b7d;
            padding: 0rem 0.5rem 0.5rem 0.5rem;
            font-size: 1.2rem;
            p {
                height: 2rem;
                line-height: 2rem;
            }
            .work {
                padding-left: 0.5rem;
                font-size: 1.2rem;
                line-height: 1.8rem;
                margin-top: 0.2rem;
                height: 1.8rem;
                background: #0984E3;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #fff;
                cursor: pointer;
            }
            .am-start {
                background: #00B894;
            }
            .night-start {
                background: #E17055;
            }
            .select-day {
                color: #ffb900;
            }
            &:nth-child(1) {
                border-top-left-radius: 1rem;
            }
            &:nth-last-child(1) {
                border-bottom-right-radius: 1rem;
            }
            &:nth-last-child(7) {
                border-bottom-left-radius: 1rem;
            }
        }
    }
}
.day-mask {
    position: relative;
    overflow: hidden;
    &::after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        opacity: 0.5;
    }
}
</style>