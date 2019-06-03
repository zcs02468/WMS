<template>
    <!-- 新增巡檢單 -->
    <div class="inspection-box">
        <div class="inspection-head">
            <div class="inspection-data">
                <div class="inspection-title">巡檢基本資料</div>
                <div class="inspection-data-box">
                    <div class="inspection-time">
                        <span class="name">巡檢時間</span>
                        <span>{{inpectionData}}</span>
                    </div>
                    <div class="inspection-location">
                        <span class="name">巡檢區域</span>
                        <span class="select-box">
                            <span><i :class="{'select-color' : Zone == '第1區'}"></i>第1區</span>
                            <span><i :class="{'select-color' : Zone == '第2區'}"></i>第2區</span>
                            <span><i :class="{'select-color' : Zone == '第3區'}"></i>第3區</span>
                            <span><i :class="{'select-color' : Zone == '第4區'}"></i>第4區</span>
                            <span><i :class="{'select-color' : Zone == '第5區'}"></i>第5區</span>
                            <span><i :class="{'select-color' : Zone == '第6區'}"></i>第6區</span>
                            <span><i :class="{'select-color' : Zone == '第7區'}"></i>第7區</span>
                            <span><i :class="{'select-color' : Zone == '第8區'}"></i>第8區</span>
                        </span>
                    </div>
                    <div class="inspection-user">
                        <span class="name">巡檢人</span>
                        <input type="text" disabled class="name-input" v-model="userData.Name">
                        <span class="extension">分機</span>
                        <input type="text" disabled class="extension-input" v-model="userData.Phone">
                    </div>
                </div>
            </div>
            <div class="trainer-data">
                <div class="trainer-title">巡檢資料</div>
                <ul class="title-box">
                    <li>防護員是否配合巡檢</li>
                    <li>防護員</li>
                    <li>所屬單位</li>
                    <li>地點</li>
                    <li>備註</li>
                </ul>
                <ul class="content-box">
                    <li v-for="(item,i) in trainerData" :key="i">
                        <span>
                            <i class="round" :class="{ 'select-color' : item.isSelect }" @click="withTheSelectionEvent(i,true)"></i>
                            <span class="yes">是</span>
                            <i :class="{ 'select-color' : !item.isSelect }" @click="withTheSelectionEvent(i,false)"></i>
                            <span class="no">否</span>
                        </span>
                        <span class="name">{{item.Guarder}}</span>
                        <span>{{item.ToCheckDept}}</span>
                        <span>{{item.Location}}</span>
                        <span>{{item.Remark}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="inspection-body">
            <h3>巡檢評量表</h3>
            <table>
                <thead>
                    <tr>
                        <th>巡檢項目</th>
                        <th>檢查標準</th>
                        <th>檢查結果</th>
                        <th>缺失地點</th>
                        <th>備註</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in QuestionsData" :key="i">
                        <td><span>{{i+1}}.</span>{{item.Problem}}</td>
                        <td>{{item.Benchmark}}</td>
                        <td>
                            <i :class="{ 'select-color' : item.isSelect }" @click="isOkEvent(i,true)"></i>
                            <span>正常</span>
                            <i :class="{ 'select-color' : !item.isSelect }" @click="isOkEvent(i,false)"></i>
                            <span>缺失</span>
                        </td>
                        <td>
                            <!-- <input type="text" class="location" placeholder="請輸入缺失地點" v-model="item.location"> -->
                            <textarea placeholder="請輸入缺失地點" v-model="item.location" @input="textareaChange(i)" @blur="textareaBlur(i)" ></textarea>
                        </td>
                        <td>
                            <!-- <input type="text" class="note" placeholder="請輸入備註" v-model="item.note"> -->
                            <textarea placeholder="請輸入備註" v-model="item.note"></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="inspection-btns">
                <div class="btns-box">
                    <tw-btn title="送出" @click="confirm"></tw-btn>
                    <tw-btn class="cancel" title="取消"></tw-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from '../../api/index.js'
import TwBtn from '../tw-btn'

export default {
    name: "twButton",
    data() {
        return {
            inpectionData: null,
            trainerData:[],
            QuestionsData:[],
            Zone:null,
            Hash:'dUCAYMm5AvNbxspP'
        };
    },
    created() {
        if( this.$store.state.query.qrcode != null ) {
            this.Hash = this.$store.state.query.qrcode
        }
        this.inpectionData = this.formatData();
        setInterval(() => {
            this.inpectionData = this.formatData();
        }, 60000);
        

        this.$axios.get(API.getInfo + this.Hash).then( res => {
            // this.judge(res)
            res.data.Guarder.forEach( item => {
                item.isSelect = true
            })
            res.data.Questions.forEach( item => {
                item.location = '';
                item.note = '';
                item.isSelect = true;
            })
            this.trainerData = res.data.Guarder;
            this.QuestionsData = res.data.Questions;
            this.Zone = res.data.Zone;
        }).catch(err=> {
            switch (err.response.status) {
                case 401:
                    this.$router.push({path:'/href'})
                    break;
                default:
                    this.Hash = 'dUCAYMm5AvNbxspP'
                    this.$axios.get(API.getInfo + this.Hash).then( res => {
                        res.data.Guarder.forEach( item => {
                            item.isSelect = true
                        })
                        res.data.Questions.forEach( item => {
                            item.location = '';
                            item.note = '';
                            item.isSelect = true;
                        })
                        this.trainerData = res.data.Guarder;
                        this.QuestionsData = res.data.Questions;
                        this.Zone = res.data.Zone;
                    })
                    break;
            }
        })

    },
    components: {
        TwBtn
    },

    methods: {
        textareaChange(_index) {
            if( this.QuestionsData[_index].location != '' ) {
                this.QuestionsData[_index].isSelect = false;
            }
        },
        textareaBlur(_index) {
            if( this.QuestionsData[_index].location == '' ) {
                this.QuestionsData[_index].isSelect = true;
            }
        },
        withTheSelectionEvent(_index,_val) {
            this.trainerData[_index].isSelect = _val;
        },
        isOkEvent(_index,_val) {
            this.QuestionsData[_index].isSelect = _val;
        },
        //送出
        confirm() {
            let data = this.integratedData();
            this.$axios.post(API.addInspection,data).then(res=> {
                this.$alert('新增巡檢單成功', '提示', {
                    confirmButtonText: '我知道了',
                    callback: action => {
                        if( _status ) {
                            this.close()
                        }
                    }
                });
            }).catch( err => {
                this.$alert('新增巡檢單失敗', '提示', {
                    confirmButtonText: '我知道了',
                    callback: action => {
                        this.close()
                    }
                });
            })
        },
        //整合巡检单数据
        integratedData() {
            // let aa = {
            //     "Hash": "string",
            //     "CheckQuestion": [
            //         {
            //         "Order": 0,
            //         "Loction": "string",
            //         "Result": true,
            //         "Remark": "string"
            //         }
            //     ],
            //     "Guarder": [
            //         {
            //         "Order": 0,
            //         "Cooperation": true
            //         }
            //     ],
            //     "Remark": "string"
            // }
            let guarderArr = [],questionsArr=[];
            this.trainerData.forEach( item => {
                guarderArr.push( {
                    Order : item.Order,
                    Cooperation : item.isSelect
                })
            })
            this.QuestionsData.forEach( item =>{
                questionsArr.push({
                    Order:item.Order,
                    Loction:item.location,
                    Result:item.isSelect,
                    Remark:item.note
                })
            })
            let obj = {
                Hash : this.Hash,
                CheckQuestion:questionsArr,
                Guarder:guarderArr,
                Remark:''
            }
            return obj;
        },
        //时间转换
        formatData() {
            const date = new Date();
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes();
            // s = date.getSeconds(),
            // w = date.getDay();//注:0-6对应为星期日到星期六
            Y = Y - 1911;
            let amAndPm = "上午";
            if (H > 12) {
                amAndPm = "下午";
                H = H - 12;
            }
            const t = `${Y}年${m}月${d}日  ${amAndPm}${H}:${i}`;
            return t;
        }
    },

    computed: {
        userData() {
            return this.$store.state.userData;
        }
    }
};
</script>

<style lang="less" scoped>
.inspection-box {
    padding: 2.2rem 5rem;
}
.inspection-head {
    min-height: 15rem;
    padding-bottom: 3rem;
    .inspection-data {
        width: 38rem;
        height: 100%;
        float: left;
        .inspection-title {
            font-size: 1.7rem;
        }
        .inspection-data-box {
            font-size: 1.2rem;
            margin-top: 1.7rem;
            span {
                display: inline-block;
            }
            .name {
                width: 10.6rem;
                font-size: 1.4rem;
            }
            .inspection-location {
                margin-top: 0.8rem;
                width: 38rem;
                height: 4rem;
                .name {
                    vertical-align: top;
                }
                .select-box {
                    width: 26rem;
                    font-size: 1.2rem;
                    span {
                        float: left;
                        margin-left: 0.6rem;
                    }
                    i {
                        display: inline-block;
                        width: 1.3rem;
                        height: 1.3rem;
                        border-radius: 50%;
                        background: #e8e8e8;
                        margin-right: 0.4rem;
                        vertical-align: middle;
                    }
                    .select-color {
                        background: #000;
                    }
                }
            }
            .inspection-user {
                margin-top: 1rem;
                input {
                    height: 1.8rem;
                    border-radius: 0.5rem;
                    background: #e8e8e8;
                    padding-left: 0.5rem;
                    font-size: 1rem;
                }
                .name-input {
                    width: 12.3rem;
                }
                .extension-input {
                    width: 10.2rem;
                }
                .extension,
                .select-num {
                    margin-left: 0.7rem;
                }
            }
        }
    }
    .trainer-data {
        // width: 47rem;
        height: 100%;
        float: left;
        .trainer-title {
            font-size: 1.7rem;
        }
        .title-box {
            margin-top: 1.7rem;
            font-size: 1.2rem;
            li {
                display: inline-block;
                &:nth-child(1) {
                    width: 11.5rem;
                }
                &:nth-child(2) {
                    width: 7rem;
                }
                &:nth-child(3) {
                    width: 5.7rem;
                }
                &:nth-child(4) {
                    width: 11rem;
                }
                &:nth-child(5) {
                    width: 10.4rem;
                }
            }
        }
        .content-box {
            margin-top: 1.1rem;
            li {
                font-size: 1.2rem;
                span {
                    height: 2rem;
                    line-height: 2rem;
                    display: inline-block;
                    &:nth-child(1) {
                        width: 11.5rem;
                        .round {
                            margin-left: 0;
                        }
                        i {
                            display: inline-block;
                            width: 1.4rem;
                            height: 1.4rem;
                            border-radius: 50%;
                            background: #e8e8e8;
                            vertical-align: middle;
                            margin-left: 0.6rem;
                            cursor: pointer;
                            user-select:none;
                        }
                        .select-color {
                            background: #000;
                        }
                        .yes,.no {
                            width: auto;
                            margin-left: 0.6rem;
                            cursor: pointer;
                            user-select:none;
                        }
                    }
                    &:nth-child(2) {
                        width: 7rem;
                    }
                    &:nth-child(3) {
                        width: 5.7rem;
                    }
                    &:nth-child(4) {
                        width: 11rem;
                    }
                    &:nth-child(5) {
                        width: 10.4rem;
                    }
                }
            }
        }
    }
}
.inspection-body {
    min-height: 30.5rem;  
    background: #dfe6e9;
    border-radius: 2.9rem;
    width: 83.3rem;
    h3 {
        padding: 2.8rem 0 0 3.5rem;
        font-weight: 500;
        font-size: 1.8rem;
    }
    table {
        margin-top: 1.5rem;
        margin-left: 3.5rem;
    }
    thead {
        tr {
            th{
                text-align: left;
                height: 2.8rem;
                line-height: 2.8rem;
                &:nth-child(1) {width: 21rem;padding-left: 1.6rem;}
                &:nth-child(2) {width: 13.5rem;}
                &:nth-child(3) {width: 12rem;}
                &:nth-child(4) {width: 14rem;}
                &:nth-child(5) {width: 13.5rem;}
            }
        }
    }
    tbody {
        tr {
            td{
                line-height: 2.8rem;
                height: 2.8rem;
                font-size: 1.2rem;
                &:nth-child(1) {
                    width:21rem;
                    padding-left: 2.4rem;
                    position: relative;
                    span {
                        display: inline-block;
                        width: 2rem;
                        position: absolute;
                        left: 0;
                        font-size: 1.2rem;
                    }
                }
                &:nth-child(2) {width:13.5rem;}
                &:nth-child(3) {width:12rem;}
                &:nth-child(4) {width:14rem;position: relative;}
                &:nth-child(5) {width:13.5rem;position: relative;}
                i {
                    width: 1.6rem;
                    height: 1.6rem;
                    display: inline-block;
                    border-radius: 50%;
                    background: #fff;
                    vertical-align: middle;
                    cursor: pointer;
                    user-select: none;
                    &:nth-child(3) {
                        margin-left: 1rem;
                    }
                }
                .select-color {
                    background: #000;
                }
                input {
                    width: 13.2rem;
                    height: 2.3rem;
                    border-radius: 0.7rem;
                    padding-left: 0.7rem;
                }
                textarea {
                    width: 13.2rem;
                    min-height: 2.3rem;
                    border-radius: 0.5rem;
                    padding-left: 0.5rem;
                    resize: none;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
    }
    .inspection-btns {
        margin-top: 2.8rem;
        padding-bottom: 2.8rem;
        .btns-box {
            text-align: center;
            .cancel {
                margin-left: 0.7rem;
            }
        }
    }
}
</style>

