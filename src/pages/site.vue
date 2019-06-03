<template>
    <div class="app-site">
        <div class="site-title">
            <div class="app-title">臺北市市政大樓使用情形一覽表</div>
            <div class="change-month">
                <span class="iconfont icon-arrowL" @click="preClick"></span>
                <div>{{selectedYear-1911}}&nbsp;&nbsp;年&nbsp;&nbsp;{{selectedMonth + 1}}&nbsp;&nbsp;月</div>
                <span class="iconfont icon-arrowR" @click="nextClick"></span>
            </div>
            <div class="main-data-box">
                <div class="main-date">{{date}}</div>
                <div class="order" @click="addActivity">
                    <span>線上預約</span>
                    <span class="iconfont icon-youjiantou"></span>
                </div>
                <span class="iconfont icon-query" @click="downloadClick"></span>
            </div>
        </div>
        <div class="calendar-content">
            <div class="content-tab">
                <div :class="{active: index == nowIndex}" @click="bigSiteClick(ele,index)" v-for="(ele,index) in siteBigLocation" :key="index">{{ele.MainSite}}</div>
            </div>
            <div class="content-item">
                <ul class="calener-location">
                    <li v-for="(item,i) in siteSmallLocation" v-if="i <= 2" :key="i"><span class="round selection" :class="{'select-color' : i == 0}" @click="smallLocationClick($event,item)"></span><span class="title">{{item.SubSite}}</span></li>
                </ul>
                <calendar ref="child1" :calendarArr="calendarArr" :selectedYear="selectedYear" :selectedMonth="selectedMonth" :selectedDate="selectedDate" ></calendar>
                <div class="calender-foot">
                    <div class="left-info">
                        <span class="round round-g"></span>
                        <span class="info">場地租借從上午時段開始</span>
                        <span class="round round-b"></span>
                        <span class="info">場地租借從下午時段開始</span>
                        <span class="round round-o"></span>
                        <span class="info">場地租借從晚間時段開始</span>
                    </div>
                    <div class="right-info">※中庭應於申請使用日前3個月至10日提出申請; 市政大樓周邊場地或市民廣場者，應於申請使用日前3個月至20日提出申請。</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import API from '../api/index.js'
import Calendar from '../components/venueRental/calendar'

export default {
    data() {
        return {
            smallSite:new Set(),
            siteBigLocation:[],
            siteSmallLocation:[],
            nowIndex: 0,
            date:null,
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth(),
            selectedDate: new Date().getDate(),
            monthArr: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            calendarArr:[],//日历集合 不包含 展示数据
        };
    },
    components: {
        Calendar
    },

    created() {
        this.$store.state.storageSelectData = []
        this.date = this.formatData();
        this.calendarArr = this.getNowDate(this.selectedYear,this.selectedMonth)
        this.getSiteLocation()
    },

    methods: {
        //大地址选择事件
        bigSiteClick(_item,_index) {
            this.nowIndex = _index;
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('select-color')
            })
            this.smallSite.clear();
            if( _index == 0 ||  _item.SubSites.length == 0) {
                this.smallSite.add( _item.ID )
            }else{
                this.smallSite.add( _item.SubSites[0].ID )
            }
            this.siteSmallLocation = [];
            setTimeout(()=> {
                this.siteSmallLocation = _item.SubSites
            },500) ;
            this.getCalendarData()
        },
        //小地址选择事件
        smallLocationClick(e,_item) {
            if(e.target.classList.contains('select-color')){
                //取消選中
                if( this.smallSite.size == 1 ) {
                    return
                }
                this.smallSite.delete( _item.ID )
            }else{
                //選中
                this.smallSite.add( _item.ID )
            }
            e.target.classList.toggle('select-color');
            this.getCalendarData();
        },
        //預約跳转
        addActivity() {
            if( this.$store.state.query.System == null && this.$store.state.query.Ticket == null) {
                this.$router.push({path:'/addActivity'})
            }else {
                this.$router.push({path:'/addActivity',query:{
                    System : this.$store.state.query.System,
                    Ticket : this.$store.state.query.Ticket,
                }})
            }
        },
        //点击问号下载
        downloadClick() {
            let src = '/download/site_qa';
            var eleLink = document.createElement('a');
            eleLink.download = src;
            eleLink.style.display = 'none';
            eleLink.href = src;
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
        },
        //加载上一月
        preClick() {
            if (this.selectedMonth === 0) {
                this.selectedYear = this.selectedYear - 1;
                this.selectedMonth = 11;
            } else {
                this.selectedMonth = this.selectedMonth - 1;
            }
            this.calendarArr = this.getNowDate(this.selectedYear,this.selectedMonth)
            this.getCalendarData(  )
        },
        //加载下一月
        nextClick() {
            if (this.selectedMonth === 11) {
                this.selectedYear = this.selectedYear + 1;
                this.selectedMonth = 0;
            } else {
                this.selectedMonth = this.selectedMonth + 1;
            }
            this.calendarArr = this.getNowDate(this.selectedYear,this.selectedMonth)
            this.getCalendarData()
        },
        //获取当月日历数据
        getNowDate(_year, _month) {
            if ((_year % 4 === 0 && _year % 100 !== 0) || _year % 400 === 0) {
                this.monthArr[1] = 29;
            }
            let dateArr = [];
            let nowDayArr = [];
            let preDay = new Date(_year, _month, 1).getDay();
            //获取上一个月的数据
            let preDayArr = this.getPreDate(_month, preDay);
            let preDayArrLen = preDayArr.length;
            let nextDayArr = this.getNextDate(_month, preDayArrLen);
            let m = _month + 1;
            m < 10 ? ( m = '0' + m ) : m;

            //获取当月数据
            for (let i = 0; i < this.monthArr[_month]; i++) {
                let d = i + 1
                d < 10 ? (d = '0' + d ) : d;
                nowDayArr.push({
                    type: "normal",
                    content: i + 1,
                    tag: String(_year) + String(m) + String(d),
                    work:[]
                });
            }
            dateArr = [...preDayArr, ...nowDayArr, ...nextDayArr];
            return dateArr;
        },
        //获取上一个月日历数据
        getPreDate(_month, _nowDay) {
            let arr = [];
            let year = this.selectedYear;
            _month == 0 ? (_month = 11,year=this.selectedYear-1) : (_month = _month - 1);
            let num = this.monthArr[_month] - _nowDay + 1;
            let m = _month + 1;
            m < 10 ? ( m = '0' + m ) :'';
            if (_nowDay > 0) {
                for (let i = num; i <= this.monthArr[_month]; i++) {
                    let d = i
                    d < 10 ? (d = '0' + d ) : d;
                    arr.push({
                        type: "pre",
                        content: i,
                        tag: String(year) + String(m) + String(d),
                        work:[],
                    });
                }
            }
            return arr;
        },
        //获取下个月日历数据
        getNextDate(_month, _preDayArrLen) {
            let arr = [];
            let year = this.selectedYear;
            let num = 42 - this.monthArr[_month] - _preDayArrLen;
            _month == 11 ? (_month=0,year=year+1) : (_month=_month+1)
            let m = _month + 1;
            _month < 10 ? ( m = '0' + m ) :'';
            for (let i = 0; i < num; i++) {
                let d = i+1
                d < 10 ? (d = '0' + d ) : d;
                arr.push({
                    type: "next",
                    content: i+1,
                    tag: String(year) + String(m) + String(d),
                    work:[]
                });
            }
            if( arr.length >=7 ) {
                arr.length = arr.length - 7
            }
            return arr;
        },
        //获取日历详情数据
        getCalendarData( ) {
            let SiteIDs = this.getSiteId()
            let url = `${API.getSiteCalendar}${this.selectedYear}/${this.selectedMonth+1}?SiteIDs=${SiteIDs}`
            let _this = this;
            function getLendingData(){
                return _this.$axios.get(url)
            }
            this.$axios.all([getLendingData()]).then(this.$axios.spread( (val1) => {
                let datas = [...val1.data]
                this.calendarArr.forEach( (item,index) => {
                    item.work = []
                    datas.forEach( (ele,index) => {
                        let startData = this.formatData( ele.BeginTime,true);
                        let BeginTime = startData[0];
                        let EndTime = this.formatData( ele.EndTime,true)[0];
                        if( BeginTime <= item.tag && EndTime >= item.tag) {
                            let itemData = JSON.parse( JSON.stringify( ele ))
                            if( BeginTime == item.tag ) {
                                itemData.timeType = startData[1]
                            }else {
                                itemData.timeType = 8
                            }
                            item.work.push( itemData );
                        }
                    })
                })
            }))
        },
        //获取地点总数据
        getSiteLocation() {
            this.$axios.get(API.getSite).then( res => {
                this.siteBigLocation = res.data;
                this.siteSmallLocation = res.data[0].SubSites
                let ids;
                if( this.siteBigLocation[0].SubSites.length != 0 ) {
                    ids = this.siteSmallLocation[0].SubSites.ID;
                    this.smallSite.add( ids )
                }else {
                    ids = this.siteBigLocation[0].ID;
                    this.smallSite.add( ids )
                }
                this.getCalendarData( ids )
            })
        },
        //时间转换
        formatData( val ,type) {
            let date;
            if( type ) {
                date = new Date(val)
            }else {
                date = new Date()
            }
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                w = date.getDay();//注:0-6对应为星期日到星期六
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
            let t;
            if( type == undefined ) {
                t = `${Y-1911}  年  ${m}  月  ${d} 日    星 期 ${w}`;
            }else {
                m < 10 ? ( m = '0' + m ) : '';
                d < 10 ? ( d = '0' + d ) : '';
                let n = `${Y}${m}${d}` 
                t = [ n , H]
            }
            return t;
        },
        getSiteId() {
            let ids = ''
            this.smallSite.forEach( item => {
                ids = ids + `${item},` 
            })
            return ids;
        },
    },

    watch: {

    }
};
</script>

<style lang="less" scoped>
.app-main {
  height: 1377px;
}
.app-site {
  width: 100%;
  height: auto;
  .site-title {
    width: 100%;
    height: 7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .app-title {
      color: #fff;
      font-size: 2.3rem;
      margin-left: 70px;
    }
    .change-month {
      width: 33rem;
      height: 3.2rem;
      background: #fff;
      border-radius: 1rem;
      position: relative;
      line-height: 3.2rem;
      div {
        text-align: center;
        font-size: 1.2rem;
        user-select: none;
      }
      .iconfont {
        position: absolute;
        font-size: 1.5rem;
        cursor: pointer;
      }
      .icon-arrowL {
        left: 1rem;
      }
      .icon-arrowR {
        top: 0;
        right: 1rem;
      }
    }
    .main-data-box {
      width: 40rem;
      height: 5rem;
      float: right;
      line-height: 5rem;
      .main-date {
        color: #868b8c;
        font-size: 1.6rem;
        float: left;
      }
      .order {
        width: 12rem;
        height: 2.5rem;
        border-radius: 0.8rem;
        background: #fdcb6e;
        display: inline-block;
        text-align: center;
        line-height: 2.5rem;
        box-shadow: 0 3px 0 #b7b7b7;
        margin: 0 0.6rem 0 2rem;
        cursor: pointer;
        span {
          display: inline-block;
          line-height: 2.5rem;
          height: 100%;
        }
        .iconfont {
          vertical-align: middle;
        }
      }
      .icon-query {
        display: inline-block;
        width: 2.4rem;
        height: 2.5rem;
        background: #ff7675;
        line-height: 2.5rem;
        text-align: center;
        cursor: pointer;
        border-radius: 0.76rem;
        box-shadow: 0 3px 0 #b7b7b7;
      }
    }
  }
  .calendar-content {
    width: 100%;
    height: auto;
    .content-tab {
      width: auto;
      margin-left: 50px;
      display: flex;
      justify-content: flex-start;
      & > div {
        width: 140px;
        height: 3rem;
        line-height: 3rem;
        color: #fff;
        text-align: center;
        background-color: #636e72;
        cursor: pointer;
      }
      & > div:first-child {
        border-radius: 20px 0 0 0;
      }
      & > div:last-child {
        border-radius: 0 20px 0 0;
      }
      & > div.active {
        color: #0e293f;
        background-color: #dfe6e9;
      }
    }
  }
}

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

.calender-foot {
    height: 4rem;
    line-height: 4rem;
    font-size: 1.2rem;
    .left-info {
        float: left;
        span {
            display: inline-block;
        }
        .round {
            width: 1rem;
            height: 1rem;
            vertical-align: middle;
            border-radius: 50%;
            background: #fff;
        }
        .round-g {
            background: #00B894;
        }
        .round-b {
            background: #0984E3;
        }
        .round-o {
            background: #E17055;
        }
        .info {
            margin-right: 0.8rem;
        }
    }
    .right-info {
        float: right;
        font-size: 1.2rem;
    }
}
</style>

