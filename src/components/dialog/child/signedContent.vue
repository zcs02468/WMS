<!-- signedTable -->
<template>
    <div class="signed-dialog-box">
        <SignedTable :widthData="widthData" :headData="headData" :bodyData="bodyData"></SignedTable>
        <div class="singed-dialog-bottom">
            <div class="singed-left">
                <div class="title">簽核人順序</div>
                <div class="content">
                    <ul>
                        <li  v-for="(item,i) in bodyData.Signings" :key="i">
                            <div class="btns">
                                <tw-button class="btn-type" :title="item.Status" v-if="item.StatusValue == 'T'" type="success"></tw-button>
                                <tw-button class="btn-type" :title="item.Status" v-else-if="item.StatusValue == 'P'"  type="danger"></tw-button>
                                <tw-button class="btn-type" :title="item.Status" v-else  type=""></tw-button>
                                <span class="type-index">{{i}}.</span>
                            </div>
                            <div class="signed-name">
                                <span>{{item.Signer}}&nbsp;</span>
                                <!-- <span>{{}}&nbsp;</span>
                                <span>{{}}&nbsp;</span>
                                <span>{{}}&nbsp;</span>
                                <span>{{}}&nbsp;</span>
                                <span>{{}}&nbsp;</span> -->
                            </div>

                        </li>
                    </ul>
                </div>
            </div>
            <div class="singed-right">
                <div class="radio-text-box">
                    <div class="title-box">
                        <span class="select" :class="[selectNum == 1 ? 'select-color' :  '' ]" @click="selectClick(1)"></span>
                        <span class="type" @click="selectClick(1)">核准</span>
                        <span class="title">備註</span>
                    </div>
                    <div class="txt-input">
                        <textarea name="" id="" cols="30" rows="10" v-model="throughData"></textarea>
                    </div>
                </div>
                <div class="radio-text-box" style="margin-top:27px;">
                    <div class="title-box">
                        <span class="select" :class="[selectNum == 2 ? 'select-color' :  '' ]" @click="selectClick(2)"></span>
                        <span class="type"  @click="selectClick(2)">不核准</span>
                        <span class="title">備註</span>
                    </div>
                    <div class="txt-input">
                        <textarea name="" id="" cols="30" rows="10" v-model="notThroughData"></textarea>
                    </div>
                </div>
                <div class="singed-btns">
                    <div class="btn-box">
                        <tw-button title="確認" isShadow class="confirm" @click="confirm" :class="[isClick ? '' : 'btn-cursor']"></tw-button>
                        <tw-button title="取消" isShadow @click="close"></tw-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SignedTable from "./signedTable";
import TwButton from "../../tw-button";
import API from '../../../api/index.js';
export default {
    name: "signedTable",
    data() {
        return {
            selectNum: null,
            throughData:'',//核准备注
            notThroughData:'',//不核准备注
            type:null,//签核类型
            widthData: [{ width: 122 }, { width: 106 }, { width: 80 }, { width: 208 }, { width: 96 }, { width: 114 }, { width: 64 }, { width: 94 }, { width: 146 }, { width: 132 }],
            headData: [
                { title: "轉移代碼" },
                { title: "申請日期" },
                { title: "申請人" },
                { title: "品名" },
                { title: "主倉存量" },
                { title: "安全庫存量" },
                { title: "單位" },
                { title: "存放位置" },
                { title: "備註" },
                { title: "更動數量", isCenter: true }
            ],
            isClick:true
        };
    },

    components: {
        SignedTable,
        TwButton
    },

    created() {
        let orderCode = this.bodyData.OrderCode;
        this.type = 'slaveStockin'; //备仓入库签核
        orderCode.indexOf('SIO') == 0 && (this.type = 'masterStockin');//主仓入库签核
        orderCode.indexOf('SOO') == 0 && (this.type = 'masterStockout');//主仓出库签核

    },

    methods: {
        selectClick(index) {
            this.selectNum = index;
        },
        confirm() {
            if( this.isClick ) {
                this.isClick = false;
                this[this.type]()
            }
        },
        close(){
            this.$store.commit("SET_IS_SHOW_DIALOG");
        },
        getData() {
            let data = {
                "OrderID": this.bodyData.ID,
                "DeptType": this.$store.state.userData.DeptType,
                "SigningOrder": this.getSigningOrder(),
                "Signing": null,
                "SigningReason": null
            }
            if(this.selectNum == 1) {
                data.Signing = true;
                data.SigningReason = this.throughData;
            }else {
                data.Signing = false;
                data.SigningReason = this.notThroughData;
            }
            return data
        },
        getSigningOrder() {
            let data = this.bodyData.Signings;
            let signOrder;
            for (let i = 0; i < data.length; i++) {
                if( data[i].StatusValue == 'N' ) {
                    signOrder = data[i].Order;
                    break;
                }
            }
            return signOrder;
        },
        //簽核主倉入庫單
        masterStockin() {
            if( this.selectNum == null) return
            let data = this.getData()
            this.$axios.patch(API.signedMaterStockin,data)
            .then(res => {
                this.openInfoDialog(true,'主倉入庫簽核成功')
                this.$store.state.upDateSign = true;
            })
            .catch(err => {
                this.openInfoDialog(false,'主倉入庫簽核失敗')
            })
        },
        //簽核主倉出庫單
        masterStockout() {
            if( this.selectNum == null) return
            let data = this.getData()
            this.$axios.patch(API.signedMaterStockout,data)
            .then(res => {
                this.openInfoDialog(true,'主倉出庫簽核成功')
                this.$store.state.upDateSign = true;
            })
            .catch(err => {
                this.openInfoDialog(false,'主倉出庫簽核失敗')
            })
        },
        //簽核備倉入庫單
        slaveStockin() {
            if( this.selectNum == null) return
            let data = this.getData()
            this.$axios.patch(API.signedSlaveStockin,data)
            .then(res => {
                this.openInfoDialog(true,'備倉入庫簽核成功')
                this.$store.state.upDateSign = true;
            })
            .catch(err => {
                this.openInfoDialog(false,'備倉入庫簽核失敗')
            })

        },
        openInfoDialog(_status,_content,_title = '提示') {
            this.isClick = true;
            this.$alert(_content, _title, {
            confirmButtonText: '確定',
            callback: action => {
                if( _status ) {
                    this.close();
                }
            }
            });
        },
    },

    computed: {
        bodyData() {
            let bodyData = this.$store.state.signedData;
            if( bodyData.OrderCode.indexOf('SSIO') == 0 ) {
                this.headData[this.headData.length - 1].title = '轉移數量'
            }else if(bodyData.OrderCode.indexOf('SIO') == 0){
                this.headData[this.headData.length - 1].title = '新增數量'
            }else {
                this.headData[this.headData.length - 1].title = '領料數量'
            }

            return this.$store.state.signedData;
        }
    }
};
</script>
<style lang="less" scoped>
.btn-cursor {
    cursor: wait;
}
.singed-dialog-bottom {
    margin-top: 3rem;
    width: 100%;
    min-height: 450px;
    .singed-left {
        float: left;
        height: 100%;
        width: 485px;
        .title {
            width: 102px;
            height: 36px;
            line-height: 36px;
            float: left;
            font-size: 17px;
        }
        .content {
            float: left;
            width: 316px;
            li {
                width: 316px;
                font-size: 17px;
                height: 50px;
                .btns {
                    width: 142px;
                    float: left;
                    .btn-type {
                        float: left;
                    }
                    .type-index {
                        float: right;
                        margin-right: 4px;
                        height: 36px;
                        line-height: 36px;
                    }
                }
                .signed-name {
                    float: left;
                    width: 174px;
                    span {
                        height: 36px;
                        line-height: 36px;
                    }
                }
                span {
                    float: left;
                }
            }
        }
    }
    .singed-right {
        float: left;
        height: 100%;
        .radio-text-box {
            width: 100%;
            height: 104px;
            .title-box {
                width: 161px;
                height: 104px;
                float: left;
                font-size: 19px;
                span {
                    display: inline-block;
                }
                .select {
                    width: 24px;
                    height: 24px;
                    border-radius: 7px;
                    background: #e8e8e8;
                    vertical-align: middle;
                    cursor: pointer;
                }
                .type {
                    width: 70px;
                    margin-left: 5px;
                    cursor: pointer;
                }
                .title {
                    width: 48px;
                }
                .select-color {
                    background: #2d3436;
                }
            }
            .txt-input {
                float: left;
                width: 521px;
                height: 104px;
                textarea {
                    width: 100%;
                    height: 100%;
                    background: #e8e8e8;
                    resize: none;
                    border-radius: 7px;
                    padding: 7px;
                }
            }
        }
        .singed-btns {
            margin-top: 36px;
            text-align: center;
            .btn-box {
                display: inline-block;
                .confirm {
                    margin-right: 25px;
                }
            }
        }
    }
}
</style>
