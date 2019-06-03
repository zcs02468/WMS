<template>
    <div class="main-tab">
        <div class="tab-left">
            <div class="tab-left-top">
                <storage-search type="master"></storage-search>
            </div>
            <div class="tab-left-list">
                <table class="tw-table-list">
                    <thead class="tw-table-head">
                        <tr class="tr_border">
                            <th class="row01">
                                <div class="selection" @click="selectAll"></div>
                            </th>
                            <th class="row02 sortable" @click="sortByCode">
                                <div>
                                    <span>代號</span>
                                    <span class="iconfont icon-bArrow" :class="{'icon-tArrow': codeSort == 2,'icon-bArrow': codeSort == 1}"></span>
                                </div>
                            </th>
                            <th class="row03 sortable" @click="sortByName">
                                <div>
                                    <span>品名</span>
                                    <span class="iconfont icon-bArrow" :class="{'icon-tArrow': nameSort == 2,'icon-bArrow': nameSort == 1}"></span>
                                </div>
                            </th>
                            <th class="row04 sortable" @click="sortByQuantity">
                                <div>
                                    <span>主倉存量</span>
                                    <span class="iconfont icon-bArrow" :class="{'icon-tArrow': quantitySort == 2,'icon-bArrow': quantitySort == 1}"></span>
                                </div>
                            </th>
                            <th class="row05 sortable" @click="sortByLimit">
                                <div>
                                    <span>安全庫存量</span>
                                    <span class="iconfont icon-bArrow" :class="{'icon-tArrow': limitSort == 2,'icon-bArrow': limitSort == 1}" ></span>
                                </div>
                            </th>
                            <th class="row06">
                                <div>單位</div>
                            </th>
                            <th class="row07 sortable" @click="sortByLocation">
                                <div>
                                    <span>存放位置</span>
                                    <span class="iconfont icon-bArrow" :class="{'icon-tArrow': locationSort == 2,'icon-bArrow': locationSort == 1}"></span>
                                </div>
                            </th>
                            <th class="row08">
                                <div>備註</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="tw-table-body">
                        <tr class="tr-border" v-for="(item,index) in dataList" :key="index">
                            <td>
                                <div class="selection" @click="select($event,item)"></div>
                            </td>
                            <td>{{item.Code}}</td>
                            <td>{{item.Name}}</td>
                            <td>{{item.Quantity}}</td>
                            <td>{{item.Limit}}</td>
                            <td>{{item.Spec}}</td>
                            <td>{{item.Location}}</td>
                            <td>{{item.Remark}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="tab-paging">
                <tw-pagination type="master" @upDatePageIndex="upDatePageIndex"></tw-pagination>
            </div>
            <div class="tab-left-button">
                <tw-button class="btn" title="領料" isShadow @click="openDialog('picking')"></tw-button>
                <tw-button class="btn" title="補貨" isShadow @click="openDialog('replenishment')"></tw-button>
                <tw-button class="btn" title="轉移" isShadow @click="openDialog('transfer')"></tw-button>
                <tw-button class="btn" title="變更" isShadow @click="openDialog('change')"></tw-button>
                <tw-button class="btn" title="匯出" isShadow @click="remit"></tw-button>
            </div>
        </div>
        <div class="tab-right">
            <div class="tab-right-top">
                <div class="top-icon">+</div>
                <div class="top-title">新增入庫</div>
            </div>
            <div class="tab-right-from">
                <div>
                    <div class="item-title" >
                        <span>請輸入物品代號</span>
                        <span class="items-code">
                            <span class="title-box" @click="itemsSelectClick">
                                <span class="title">{{codeVal}}</span>
                                <span class="items-icon iconfont icon-bArrow"></span>   
                            </span>
                            <ul class="item-code-select" v-show="itemSelect">
                                <li v-for="item in 9" @click="codeVal = item,itemSelect = false">{{item}}</li>
                            </ul>
                        </span>
                    </div>
                    <div class="item-input">
                        <div class="select-box">
                            <tw-select ref="select_1" :datas="layer1List" @change="activeCode1"></tw-select>
                        </div>
                        <div class="select-box">
                            <tw-select ref="select_2" :datas="layer2List" @change="activeCode2"></tw-select>
                        </div>
                        <div class="select-box">
                            <tw-select ref="select_3" :datas="layer3List" @change="activeCode3"></tw-select>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="item-title">請輸入物品名稱</div>
                    <div class="item-input">
                        <input type="text" v-model.trim="nameVal" />
                    </div>
                </div>
                <div>
                    <div class="item-title">請輸入物品數量</div>
                    <div class="item-input">
                        <input ref="inputN" type="text" @input="handleInputN" />
                    </div>
                </div>
                <div>
                    <div class="item-title">請輸入安全庫存量</div>
                    <div class="item-input">
                        <input ref="inputS" type="text" @input="handleInputS" />
                    </div>
                </div>
                <div>
                    <div class="item-title">請輸入物品單位</div>
                    <div class="item-input">
                        <input type="text" v-model.trim="unitVal" />
                    </div>
                </div>
                <div>
                    <div class="item-title">擺放位置</div>
                    <div class="item-input">
                        <input type="text" v-model.trim="localVal" />
                    </div>
                </div>
                <div>
                    <div class="item-title">備註</div>
                    <div class="item-input">
                        <textarea v-model.trim="remarkVal" />
                    </div>
                </div>
            </div>
            <div class="tab-right-button">
                <tw-button class="btn" title="新增" isShadow :cursorWait="!addBtnStatus" @click="addStockIn"></tw-button>
                <tw-button class="btn" title="重填" isShadow  @click="resetForm"></tw-button>
            </div>
        </div>
    </div>
</template>

<script>
import StorageSearch from '../storageSearch'
import TwButton from '../tw-button.vue';
import TwSelect from '../tw-select.vue';
import API from '../../api/index.js';
import TwPagination from '../tw-pagination';
import TableList from '../units/TableList';

export default {
    props: ['type'],
    data(){
        return {
            codeList: [],  //整體数据
            codeVal:1,
            codeVal_1: {},  //一级選中数据
            codeVal_2: {},  //二級選中数据
            codeVal_3: {},  //三級選中数据
            nameVal: null,
            numberVal: null,
            safetyVal: null,
            unitVal: null,
            localVal: null,
            remarkVal: null,
            addBtnStatus: true,
            resetBtnStatus: true,
            isSort: false,
            selectList: new Map(),
            codeSort: 0,
            nameSort: 0,
            quantitySort: 0,
            limitSort: 0,
            locationSort: 0,
            itemSelect:false
        }
    },
    computed: {
        dataList(){
            return this.$store.state.masterFindData
        },
        layer1List(){
            return this.codeList || []
        },
        layer2List(){
            return (this.codeVal_1 && this.codeVal_1.MaterialCode2nd) || []
        },
        layer3List(){
            return (this.codeVal_2 && this.codeVal_2.MaterialCode3rd) || []
        }
    },
    methods: {
        itemsSelectClick() {
            this.itemSelect = !this.itemSelect;
            this.$refs.select_1.isShow = false;
            this.$refs.select_2.isShow = false;
            this.$refs.select_3.isShow = false;
        },
        getCodeVal(){
            const a = (this.codeVal_1 && this.codeVal_1.CodeValue) || '000';
            const b = (this.codeVal_2 && this.codeVal_2.CodeValue) || '000';
            const c = (this.codeVal_3 && this.codeVal_3.CodeValue) || '000';
            return `${this.codeVal}-${a}-${b}-${c}`;
        },
        openDialog(val) {
            if( this.$store.state.storageSelectData.length == 0 ) {
                this.$alert('請選擇物料操作', '提示', {
                    confirmButtonText: '確認',
                    callback: action => {}
                });
            }else {
                this.$store.commit("SET_DIALOG_TYPE",val);
                this.$store.commit("SET_IS_SHOW_DIALOG");
            }
        },
        //汇出
        remit() {
            let data = Array.from(this.selectList.keys()).join(',')
            this.$axios.get(API.exportMaster+this.$store.state.userData.DeptType+'?IDs='+data).then(res => {
                console.log( res )
            }).catch( err => {
                console.log(err)
            })
        },
        select(e,selection){
            if(e.target.classList.contains('active')){
                //取消選中
                this.selectList.delete(selection.ID)
                this.$el.querySelector('.selection').classList.remove('active');
            }else{
                //選中
                this.selectList.set(selection.ID,selection)
            }
            e.target.classList.toggle('active');
            this.$store.commit('addData',{key: 'storageSelectData',value: Array.from(this.selectList.values())})
        },
        selectAll(e){
            if(e.target.classList.contains('active')){
                //取消選中
                Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                    item.classList.remove('active')
                })
                this.selectList.clear()
            }else{
                //選中
                Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                    item.classList.add('active')
                })
                this.dataList.forEach(item => {
                    this.selectList.set(item.ID,item)
                })
            }
            this.$store.commit('addData',{key: 'storageSelectData',value: Array.from(this.selectList.values())})
        },
        resetSelect(){
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('active')
            });
            this.selectList.clear();
        },
        handleInputN(e){
            const a = e.target.value.replace(/[^\d]/g,'');
            e.target.value = a;
            this.numberVal = a
        },
        handleInputS(e){
            const val = e.target.value.replace(/[^\d]/g,'');
            e.target.value = val;
            this.safetyVal = val;
        },
        upDatePageIndex(_index) {
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('active')
            })
            this.selectList.clear()
            this.$store.commit('addData',{key: 'storageSelectData',value:[]})
        },
        //新增主仓入库单
        addStockIn(){
            if(!this.addBtnStatus) return ;
            if(!this.numberVal) return ;
            if(!this.safetyVal) return ;
            if(!this.unitVal) return ;
            if(!this.localVal) return ;
            const codeVal = this.getCodeVal();
            const data = {
                "MaterialExists": [],
                "MaterialNotExists": [
                    {
                        "Verder": "",
                        "Code": codeVal,
                        "Name": this.nameVal,
                        "Quantity": parseInt(this.numberVal),
                        "Limit": parseInt(this.safetyVal),
                        "Spec": this.unitVal,
                        "Location": this.localVal,
                        "Remark": this.remarkVal
                    }
                ],
                "SigningCategory": 'SOC1809170001', //签字人
                "DeptType": this.$store.state.userData.DeptType, //部门类别
                "Remark": this.remarkVal, //备注
            }
            this.addBtnStatus = false;
            this.$axios.post(API.addMasterStock,data)
            .then(res => {
                if(res.data.Message == 'Success'){
                    this.addBtnStatus = true;
                    this.$alert('新增成功','提示')
                    this.resetForm();
                }
            })
            .catch(err => {
                this.addBtnStatus = true;
                this.$alert('新增失敗','提示')
            })
        },
        //重置表单
        resetForm(){
            this.nameVal = '';
            this.numberVal = null;
            this.safetyVal = null;
            this.unitVal = '';
            this.localVal = '';
            this.remarkVal = '';
            this.$refs.inputN.value = '';
            this.$refs.inputS.value = '';
        },
        //选择下拉菜单
        activeCode1(obj){
            this.codeVal_1 = obj;
        },
        activeCode2(obj){
            this.codeVal_2 = obj;
        },
        activeCode3(obj){
            this.codeVal_3 = obj;
        },
        // 获取主仓所有物料资讯
        getMaterial(){
            this.$axios.get(API.masterMaterial + this.$store.state.userData.DeptType)
            .then(res => {
                const data = res.data;
                this.$store.commit('addData',{key: 'masterAllData',value: data})
                this.$store.commit('addData',{key: 'masterFilterData',value: data})
                this.$store.commit('addData',{key: 'masterFindData',value: data.slice(0,12)})
            })
            .catch(err => {
                console.log(err)
            })
        },
        //获取下拉菜单内容
        getCode(){
            this.$axios.get(API.getAllCode + '/' + this.$store.state.userData.DeptType )
            .then(res => {
                const data = res.data;
                this.codeList = data;
            })
            .catch(err => {
                console.log(err)
            })
        },
        sortByCode(){
            if(this.codeSort == 0){
                this.$store.commit('sortByCode','master')
                this.codeSort = 1
            }else if(this.codeSort == 1){
                this.$store.commit('reverseList','master');
                this.codeSort = 2
            }else{
                this.$store.commit('reverseList','master');
                this.codeSort = 1
            }
            this.nameSort = 0;
            this.quantitySort = 0;
            this.limitSort = 0;
            this.locationSort = 0;
        },
        sortByName(){
            if(this.nameSort == 0){
                this.$store.commit('sortByName','master')
                this.nameSort = 1
            }else if(this.nameSort == 1){
                this.$store.commit('reverseList','master');
                this.nameSort = 2
            }else{
                this.$store.commit('reverseList','master');
                this.nameSort = 1
            }
            this.codeSort = 0;
            this.quantitySort = 0;
            this.limitSort = 0;
            this.locationSort = 0;
        },
        sortByQuantity(){
            if(this.quantitySort == 0){
                this.$store.commit('sortByQuantity','master')
                this.quantitySort = 1
            }else if(this.quantitySort == 1){
                this.$store.commit('reverseList','master');
                this.quantitySort = 2
            }else{
                this.$store.commit('reverseList','master');
                this.quantitySort = 1
            }
            this.codeSort = 0;
            this.nameSort = 0;
            this.limitSort = 0;
            this.locationSort = 0;
        },
        sortByLimit(){
            if(this.limitSort == 0){
                this.$store.commit('sortByLimit','master')
                this.limitSort = 1
            }else if(this.limitSort == 1){
                this.$store.commit('reverseList','master');
                this.limitSort = 2
            }else if(this.limitSort == 2){
                this.$store.commit('reverseList','master');
                this.limitSort = 1
            }
            this.codeSort = 0;
            this.nameSort = 0;
            this.quantitySort = 0;
            this.locationSort = 0;
        },
        sortByLocation(){
            if(this.locationSort == 0){
                this.$store.commit('sortByLocation','master');
                this.locationSort = 1
            }else if(this.locationSort == 1){
                this.$store.commit('reverseList','master');
                this.locationSort = 2
            }else{
                this.$store.commit('reverseList','master');
                this.locationSort = 1
            }
            this.codeSort = 0;
            this.nameSort = 0;
            this.quantitySort = 0;
            this.limitSort = 0;
        },
    },
    components: {
        TwButton,
        StorageSearch,
        TwButton,
        TwSelect,
        TwPagination,
        TableList
    },
    created(){
        this.getMaterial()
        this.getCode()
    }
};
</script>

<style lang="less" scoped>
.main-tab {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .tab-left {
        flex: 1;
        width: calc(100% - 400px);
        padding-right: 40px;
        display: flex;
        flex-direction: column;
        position: relative;
        .tab-left-top {
            width: 100%;
            height: 100px;
        }
        .tab-left-list {
            width: 100%;
            position: relative;
            .tab-left-button{
                width: 100%;
                position: absolute;
                bottom: 0;
                display: flex;
                justify-content: center;
                &>.btn{
                    margin: 0 10px;
                }
            }
        }
        .tab-left-button{
            width: 100%;
            position: absolute;
            bottom: 0;
            display: flex;
            justify-content: center;
            &>.btn{
                margin: 0 10px;
            }
        }
        .tab-paging {
            text-align: center;
            height: 162px;
            line-height: 126px;
        }
    }
    .tab-right {
        width: 40rem;
        background-color: #fff;
        border-radius: 30px;
        padding: 30px;
    }
}

.tab-right-top {
    width: 100%;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: flex-start;
    .top-icon {
        height: 60px;
        font-size: 24px;
        color: #0984e3;
    }
    .top-title {
        height: 60px;
        font-size: 20px;
        color: #000;
        font-weight: bold;
    }
}
.tab-right-from {
    width: 100%;
    &>div{
        display: flex;
        height: 40px;
        .item-title {
            width: 170px;
        }
        .items-code {
            position: relative;
            right: 25px;
            width: 35px;
            height: 24px;
            user-select: none;
            span {
                display: inline-block;
            }
            .title-box {
                width: 35px;
                background-color: #e8e8e8;
                border-radius: 8px;
                cursor: pointer;
                .title {
                    line-height: 24px;
                    width: 17px;
                    text-align: center;
                }
                .items-icon {
                    line-height: 24px;
                    font-size: 12px;
                    float: right;
                    margin-right: 5px;
                }
            }
            .item-code-select {
                width: 100%;
                height: auto;
                background-color: #fff;
                -webkit-box-shadow: 0 0 30px #ccc;
                box-shadow: 0 0 30px #ccc;
                border-radius: 8px;
                position: absolute;
                top: 30px;
                z-index: 10;
                overflow: hidden;
                user-select: none;
                li {
                    text-align: center;
                    cursor: pointer;
                    &:hover {
                        color: #fff;
                        background-color: #636e72;
                    }
                }
            }
        }
        .item-input {
            width: 200px;
        }
    }
    &>div:first-child{
        height: 120px;
        .item-title{
            display: flex;
            justify-content: space-between;
        }
    }
    &>div:last-child{
        height: 200px;
    }
}
.tab-right-button{
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    &>div{
        margin: 0 10px;
    }
}
.select-box{
    width: 100%;
    height: 40px;
}

input[type='text'] {
    width: 100%;
    height: 24px;
    border-radius: 8px;
    background-color: #e8e8e8;
    padding: 0 12px;
}
textarea {
    width: 100% !important;
    height: 180px !important;
    background-color: #e8e8e8;
    resize: none;
    border-radius: 8px;
    padding: 0 12px;
    line-height: 24px;
}

.row01{width: 6rem}
.row02{width: 12rem}
.row03{width: 10rem}
.row04{width: 10rem}
.row05{width: 11rem}
.row06{width: 10rem}
.row07{width: 10rem}
.row08{width: 10rem}
.selection{
    width: 1.3rem;
    height: 1.3rem;
    background-color: #fff;
    border-radius: 0.5rem;
    margin-left: 15px;
    cursor: pointer;
}
.selection.active{
    background-color: #000;
}
.tw-table-list{
    font-size: 1.2rem;
    text-align: left;
    tr{
        border-bottom: 1px solid #c9cfd1;
        th,td{
            // padding: 10px 0;
            height: 3rem;
        }
    }
}
.sortable{
    &>div{
        display: inline-block;
        border-radius: 10px;
        padding: 0 5px;
        cursor: pointer;
        &>span:last-child{
            margin-left: 5px;
            opacity: 0;
        }
    }
    &>div:hover{
        background-color: #fff;
        &>span:last-child{
            opacity: 1;
        }
    }
}

</style>


