<template>
    <div class="tw-pane-lease">
        <div class="pane-title">
            申請案件基本資料
        </div>
        <div class="pane-top">
            <div class="top-left">
                <div>
                    <div>{{message.ActivityTitle}}</div>
                </div>
                <div>
                    <div>
                        <span>開始時間(含場佈)</span>
                        <span>{{message.BeginTime | dateToDate2}} 起</span>
                    </div>
                    <div>
                        <span>結束開始(含撤場)</span>
                        <span>{{message.EndTime | dateToDate2}} 止</span>
                    </div>
                    <div>
                        <span>活動開始</span>
                        <span>{{message.AcBeginTime | dateToDate2}} 起</span>
                    </div>
                    <div>
                        <span>活動結束</span>
                        <span>{{message.AcEndTiem | dateToDate2}} 止</span>
                    </div>
                </div>
                <div>
                    <div>
                        <span>使用單位</span>
                        <span>{{message.LendingContact.Dept}}</span>
                    </div>
                    <div>
                        <span>聯絡人員</span>
                        <span>{{message.LendingContact.Name}}</span>
                    </div>
                    <div>
                        <span>電話</span>
                        <span>{{message.LendingContact.Phone}}</span>
                    </div>
                </div>
                <div>
                    <div><span>活動地點</span><span>{{message.LendingSite}}</span></div>
                    <div><span>填表日期</span><span>{{message.OrderCode | dateToDate3}}</span></div>
                    <div><span>活動內容</span><span>{{message.ActivityContent}}</span></div>
                    <div><span>備註</span><span>{{message.Remark}}</span></div>
                </div>
            </div>
            <div class="top-right">
                <div v-for="(item,i) in question">
                    <div>
                        <span class="select" @click="activeQuestion($event,item)"></span>
                        <span>{{i+1}}. {{item.Question}}</span>
                    </div>
                    <input type="text" placeholder="備註" v-model="item.Remark" />
                </div>
            </div>
        </div>
        <div class="pane-bottom">
            <div class="bottom-title">審查結果</div>
            <div class="bottom-content">
                <div class="content-left">
                    <div class="left-radio">
                        <span ref="agreeRadio" class="radio" @click="agree"></span>
                        <span>同意</span>
                    </div>
                    <div class="left-form">
                        <div>
                            <div>
                                <span class="radio" @click="judge($event,'Charge')"></span>
                                <span class="len">本府機關免費</span>
                            </div>
                            <div>
                                <div>使用費 <input type="text" placeholder="新台幣" v-model="Charge" /> 元 </div>
                            </div>
                            <div>
                                <span class="radio" @click="judge($event,'Charge')"></span>
                                <span>免費</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span class="radio" @click="judge($event,'Deposit')"></span>
                                <span class="len">本府機關協辦</span>
                            </div>
                            <div>
                                <div>保證金 <input type="text" placeholder="新台幣" v-model="Deposit" /> 元 </div>
                            </div>
                            <div>
                                <span class="radio" @click="judge($event,'Deposit')"></span>
                                <span>免費</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span class="radio"  @click="styleJudge($event)"></span>
                                <span class="len">非本府機關</span>
                                <!-- <input type="text"> -->
                            </div>
                        </div>
                        <div>
                            <div>
                                <span class="indent"></span>
                                <span class="len">案件編號</span>
                                <input type="text" v-model="CaseCode">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <div>
                        <span ref="unagreeRadio" class="radio" @click="unAgree"></span>
                        <span>不同意</span>
                    </div>
                    <textarea placeholder="備註" v-model="remark"></textarea>
                </div>
            </div>
            <div class="bottom-button">
                <tw-button title="送出" @click="send"></tw-button>
                <tw-button title="離開" @click="leave"></tw-button>
            </div>
        </div>
    </div>
</template>
<script>
import TwButton from '../tw-btn';
import API from '../../api/index.js';
export default {
    data(){
        return {
            postData: null,
            Deposit: null,
            Charge: null,
            CaseCode: null,
            remark: ''
        }
    },
    components: {
        TwButton
    },
    methods:{
        leave(){
            this.$parent.showPane = false;
        },
        getVerifyById(id){
            this.$axios.get(API.siteVerify + '/' + id)
            .then(res => {
                this.postData = res.data;
                this.postData.ID = id;
            })
            .catch(err => {
                console.log(err,'獲得簽核數據錯誤')
            })
        },
        postVerify(){
            if(this.postData.Result){
                this.postData.Remark = null;
                this.postData.Charge = this.Charge;
                this.postData.Deposit = this.Deposit;
                this.postData.CaseCode = this.CaseCode;
            }else{
                this.postData.Remark = this.remark;
                this.postData.Charge = null;
                this.postData.Deposit = null;
            }
            console.log(this.postData,"000000000000000000000000000")
            this.$axios.post(API.siteVerify,this.postData)
            .then(res => {
                this.$alert('簽核成功','提示')
                this.leave()
            })
            .catch(err => {
                this.$alert('簽核失敗','提示')
            })
        },
        send(){
            this.postVerify();
        },
        agree(){
            this.$refs.agreeRadio.classList.add('active')
            this.$refs.unagreeRadio.classList.remove('active')
            this.postData.Result = true;
        },
        unAgree(){
            this.$refs.agreeRadio.classList.remove('active')
            this.$refs.unagreeRadio.classList.add('active')
            this.postData.Result = false;
        },
        activeQuestion(e,item){
            e.target.classList.toggle('active');
            item.Agreed = !item.Agreed;
        },
        judge(e,type){
            if(e.target.classList.contains('active')){
                //取消選中
                this[type] = null
            }else{
                //選中
                this[type] = null
            }
            e.target.classList.toggle('active');
        },
        styleJudge(e){
            e.target.classList.toggle('active');
        }
    },
    computed: {
        message(){
            return this.$store.state.signedData
        },
        question(){
            if(this.postData){
                return this.postData.Question
            }
            return []
        }
    },
    filters: {
        dateToDate(date){
            if(!date) return ;
            const _date = date.split('T')[0]
            const __date = _date.split('-')
            __date[0] =  __date[0] - 1911
            return __date[0]+'年'+__date[1]+'月'+__date[2]+'日'
        },
        dateToDate2(date){
            if(!date) return ;
            let _day = new Date(date).getDay(),
                _h = new Date(date).getHours(),
                _m = new Date(date).getMinutes(),
                __day;
            switch(_day){
                case 1:
                    __day = '星期一';
                break;
                case 2:
                    __day = '星期二'
                break;
                case 3:
                    __day = '星期三'
                break;
                case 4:
                    __day = '星期四'
                break;
                case 5:
                    __day = '星期五'
                break;
                case 6:
                    __day = '星期六'
                break;
                case 0:
                    __day = '星期天'
                break;
            }
            const _date = date.split('T')[0]
            const __date = _date.split('-')
            __date[0] =  __date[0] - 1911;
            return __date[0]+'年'+__date[1]+'月'+__date[2]+'日'+' '+__day+' '+_h+':'+_m
        },
        dateToDate3(date){
            if(!date) return ;
            const _date = date.substr(3,6);
            const _y = ('20'+_date.substr(0,2)) - 1911,
                  _m = _date.substr(2,2),
                  _d = _date.substr(4,2);
            return _y+'年'+_m+'月'+_d+'日'
        },
    },
    created(){
        const data = this.$store.state.signedData;
        this.getVerifyById(data.ID);
    }
}
</script>


<style lang="less" scoped>
.tw-pane-lease{
    width: 100%;
    height: 100%;
    border-radius: 3.5rem;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #dfe6e9;
    padding: 30px 50px;
    display: flex;
    flex-direction: column;
}
.pane-title{
    font-weight: bold;
    font-size: 1.5rem;
    height: 2rem;
    line-height: 2rem;
}
.pane-top{
    display: flex;
    flex: 1;
    .top-left{
        width: 40%;
        &>div{
            height: 90px;
            &>div{
                height: 24px;
                &>span:nth-child(1){
                    display: inline-block;
                    width: 130px;
                }
            }
        }
        &>div:nth-child(1){
            height: 50px;
            font-size: 16px;
        }
    }
    .top-right{
        width: 60%;
        &>div{
            height: 35px;
            display: flex;
            &>div{
                width: 40%;
                .select{
                    margin-right: 5px;
                }
            }
            &>input{
                height: 2rem;
                padding: 0 10px;
                border-radius: 8px;
                flex: 1;
            }
        }
    }
}
.pane-bottom{
    background-color: #fff;
    border-radius: 3.5rem;
    .bottom-title{
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;

    }
    .bottom-content{
        display: flex;
        padding: 0 100px;
        &>div{
            flex: 1;
            display: flex;
        }
        .content-left{
            border-right: 1px solid #000;
            .left-radio{
                width: 70px;
                &>span{
                    vertical-align: middle;
                }
            }
            .left-form{
                flex: 1;
                &>div{
                    display: flex;
                    height: 2.4rem;
                    &>div:nth-child(1){
                        width: 50%;
                        input{
                            width: 50%;
                            height: 24px;
                            background-color: #efefef;
                            text-indent: 5px;
                            border-radius: 8px;

                        }
                    }
                    &>div:nth-child(2){
                        width: 35%;
                        input{
                            width: 65%;
                            height: 24px;
                            background-color: #efefef;
                            text-indent: 5px;
                            border-radius: 8px;
                        }
                    }
                    &>div:nth-child(3){
                        width: 15%;
                    }
                }
            }
        }
        .content-right{
            &>div{
                width: 130px;
                padding-left: 45px;
            }
            &>textarea{
                border-radius: 10px;
                padding: 10px;
                resize: none;
                width: 100%;
                background-color: #efefef;
            }
        }
    }
    .bottom-button{
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        &>div{
            margin: 0 10px;
        }
    }
}
.select{
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background-color: #fff;
    cursor: pointer;
}
.radio{
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 0.4rem;
    background-color: #dfe6e9;
    cursor: pointer;
}
.active{
    background-color: #000;
}
.indent{
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
}
.len{
    display: inline-block;
    width: 90px;
}
</style>

