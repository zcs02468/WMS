<!-- storageDialog -->
<template>
    <div class="tw-dialog">
        <div class="dialog-head">
            <span class="close iconfont icon-guanbi" @click="close"></span>
            <div class="title-box">
                <span class="icon iconfont" :class="'icon-'+type"></span>
                <span class="title">{{headTitle}}</span>
            </div>
        </div>
        <div v-if="type != 'signed'">
            <div class="dialog-body">
                <dialog-table :type="type" :widthData="widthData" :headData="headData" ></dialog-table>
            </div>
            <div class="dialog-foot">
                <div class="dialog-btns">
                    <tw-button title="確認" isShadow @click="confirm" :class="[isClick ? '' : 'btn-cursor']"></tw-button>
                    <tw-button title="取消" isShadow class="confirm" @click="cancel"></tw-button>
                </div>
            </div>
        </div>
        <signed-content v-else></signed-content>
    </div>
</template>

<script>
import DialogTable from "./dialogTable";
import TwButton from "../../tw-button";
import SignedContent from "./signedContent";
import API from '../../../api/index.js';

export default {
    name: "storageDialog",
    props: {
        type: {
            type: String,
            default: "transfer"
        }
    },
    data() {
        return {
            num8: 1,
            widthData: [{ width: 140 }, { width: 214 }, { width: 100 }, { width: 114 }, { width: 66 }, { width: 128 }, { width: 232 }, { width: 146 }],
            headData: [{ title: "代號" }, { title: "品名" }, { title: "主倉存量" }, { title: "安全庫存量" }, { title: "單位" }, { title: "存放位置" }, { title: "備註" }, { title: "轉移數量" }],
            isClick : true,
            initData:null,
            isSignedSuccess:false,
        };
    },

    components: {
        DialogTable,
        TwButton,
        SignedContent
    },

    created() {
        //用于主仓变更取消时恢复默认值
        this.initData = JSON.parse(JSON.stringify(this.$store.state.storageSelectData));
    },

    methods: {
        confirm() {
            // if( this.type == 'replenishment'  && this.parsingReplenishment()) {
            //     this.openInfoDialog(false,'存在主倉存量為0的物品,無法補貨')
            // }else {
                if(this.parsingData()) {
                    let title = this.headTitle 
                    this.openInfoDialog(false,title+'數量有為0的物品，無法進行'+title+'操作')
                }else {
                    this.isClick && this[this.type]();
                    this.isClick = false;
                }
            // }
        },
        //领料 主仓出库单
        picking() {
            let data = {
                DeptType:this.$store.state.userData.DeptType,
                Remark:'',
                // SigningCategory:'SOC1809170001',
                Materials:[]
            }
            let allData = this.$store.state.storageSelectData
            allData.forEach(item => {
                if( item.stockoutnNum != 0 ) {
                    data.Materials.push({
                        ID:item.ID,
                        Quantity: item.stockoutnNum,
                        Remark:item.Remark
                    })
                }
            });
            this.$axios.post(API.addMasterStockout,data)
            .then(res => {
                this.openInfoDialog(true,'領料成功')
            })
            .catch(err => {
                this.isClick = true;
                this.openInfoDialog(true,'領料失敗')
            })
        },
        //补货  主仓入库单
        replenishment() {
            let data = {
                DeptType:this.$store.state.userData.DeptType,
                Remark:'',
                // SigningCategory:'SOC1809170001',
                MaterialExists:[],
                MaterialNotExists:[]
            }
            let allData = this.$store.state.storageSelectData
            allData.forEach(item => {
                // if( item.stockoutnNum != 0 ) {
                    data.MaterialExists.push({
                        ID:item.ID,
                        Quantity: item.stockoutnNum,
                        Remark:item.Remark
                    })
                // }
            });
            this.$axios.post(API.addMasterStock,data)
            .then(res => {
                this.openInfoDialog(true,'補貨成功')
            })
            .catch(err => {
                this.isClick = true;
                this.openInfoDialog(false,'補貨失敗')
            })
        },
        //转移  备仓入库单
        transfer() {
            let data = {
                DeptType:this.$store.state.userData.DeptType,
                Remark:'',
                // SigningCategory:'SOC1809170001',
                Materials:[]
            }
            let allData = this.$store.state.storageSelectData
            allData.forEach(item => {
                if( item.stockoutnNum != 0 ) {
                    data.Materials.push({
                        ID:item.ID,
                        Quantity: item.stockoutnNum,
                        Remark:item.Remark
                    })
                }
            });
            if(data.Materials.length == 0) return
            this.$axios.post(API.addSlaveStockin,data)
            .then(res => {
                this.openInfoDialog(true,'轉移成功')
            })
            .catch(err => {
                this.isClick = true;
                this.openInfoDialog(true,'轉移失敗')
            })
        },
        //变更
        change() {
            let allData = this.$store.state.storageSelectData
            let arr = []
            

            allData.forEach(item => {
                let obj = {
                    "ID": item.ID,
                    "Vender": 'VV',
                    "Code": item.Code,
                    "Name": item.Name,
                    "Limit": item.Limit,
                    "Spec": item.Spec,
                    "Location": item.Location,
                    "Remark": item.Remark,
                    "DeptType": this.$store.state.userData.DeptType
                }
                //  Verder 为空时报错
                arr.push( obj )
            });
            // arr.forEach( item => {
                this.$axios.patch(API.editMasterMaterial,arr)
                .then(res => {
                    this.isSignedSuccess = true;
                    this.openInfoDialog(true,'變更成功')
                })
                .catch(err => {
                    this.isClick = true;
                    this.isSignedSuccess = false;
                    this.openInfoDialog(false,'變更失敗')
                })
            // })

        },
        openInfoDialog(_status,_content,_title = '提示') {
            this.$alert(_content, _title, {
            confirmButtonText: '確定',
            callback: action => {
                if( _status ) {
                    this.close()
                }
            }
            });
        },
        //取消
        cancel() {
            if( this.type == 'change' && !this.isSignedSuccess ) {
                this.$store.commit('editorMasterData',this.initData)
            }
            this.close()
        },
        close() {
            if( this.type == 'change' && !this.isSignedSuccess ) {
                this.$store.commit('editorMasterData',this.initData)
            }
            this.$store.commit("SET_IS_SHOW_DIALOG",false);
        },
        //查找主倉數量是否為 0  為 0 則無法補貨
        parsingReplenishment() {
            return this.initData.some( item => {
                return item.Quantity == 0
            })
        },
        //查找修改的数量中是否存在为0的值  为 0 则阻止
        parsingData() {
            if( this.type != 'change') {
                let selectData = this.$store.state.storageSelectData;
                let isOk = selectData.some( item => {
                   return item.stockoutnNum == 0
                })
                return isOk
            }
        }
    },
    computed: {
        headTitle() {
            //转移--transfer  补货--replenishment  领料--picking  签核--signed
            switch (this.type) {
                case "picking":
                    this.headData[this.headData.length-1].title = '領料數量';
                    return "領料";
                case "replenishment":
                    this.headData[this.headData.length-1].title = '補貨數量';
                    return "補貨";
                case "transfer":
                    this.headData[this.headData.length-1].title = '轉移數量';
                    return "轉移";
                case "change":
                    // this.headData[this.headData.length-1].title = '變更數量';
                    this.headData.pop()
                    return "變更";
                case "signed":
                    return "簽核";
                default:
                    return "";
            }
        },
        headData1() {
            let titleData = [{ title: "代號" }, { title: "品名" }, { title: "主倉存量" }, { title: "安全庫存量" }, { title: "單位" }, { title: "存放位置" }, { title: "備註" }, { title: "轉移數量" }];
            let len = titleData.length;
            switch (this.type) {
                case "picking":
                    titleData[len-1].title ='領料數量';
                    break;
                case "replenishment":
                    titleData[len].title = '補貨數量';
                    break;
                case "transfer":
                    titleData[len].title = '轉移數量';
                    break;
                case "change":
                    titleData[len].title = '變更數量';
                    break;
                default:
                    return "";
            }
        }
    }
};
</script>
<style lang="less" scoped>
.btn-cursor {
    cursor: wait;
}
.tw-dialog {
    position: relative;
    left: 50%;
    top: 50%;
    width: 1280px;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    background: #fff;
    // padding-left: 70px;
    padding: 0 55px;
    .dialog-head {
        // height: 110px;
        height: 6rem;
        .close {
            position: absolute;
            right: -26px;
            top: -26px;
            display: inline-block;
            width: 52px;
            height: 52px;
            color: #44484c;
            border-radius: 50%;
            background: #fff;
            // box-shadow: -2px 2px 3px #ccc;
            box-shadow: 0px 0px 10px #ccc;
            font-size: 20px;
            font-weight: 900;
            text-align: center;
            line-height: 52px;
            cursor: pointer;
        }
        .icon {
            font-size: 33px;
            color: #587ee0;
            margin-right: 20px;
        }
        .title-box {
            // padding-top: 40px;
            padding-top: 2rem;
            .title {
                font-size: 33px;
                color: #587ee0;
            }
        }
    }
    .dialog-foot {
        height: 174px;
        padding-top: 75px;
        text-align: center;
        // margin-left: -95px;
        .dialog-btns {
            display: inline-block;
            .confirm {
                margin-left: 20px;
            }
        }
    }
}
</style>
