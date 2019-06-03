<template>
    <!-- 巡檢叫修總覽-->
    <div class="inspection-list-page">
        <div class="page-head">
            <div class="">
                <date-picker ref="datePicker" reset @click="handleSearch"></date-picker>
            </div>
            <div>
                <tw-search type="callRepair" :searchList="searchList"></tw-search>
            </div>
            <div class="head-select">
                <span>簽核狀態</span>
                <tw-select :datas="typeList" @change="selectType"></tw-select>
            </div>
        </div>
        <div class="page-content">
            <table>
                <thead>
                    <tr>
                        <th>
                            <div class="selection" @click="selectAll"></div>
                        </th>
                        <th>
                            <div class="sortable"  @click="sortBySource">
                                <span>來源</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': sourceSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByOrderCode">
                                <span>叫修編號</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': orderCodeSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>報修人</span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByEndTime">
                                <span>預計完成日</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': endTimeSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByContactDept">
                                <span>報修部門</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': contactDeptSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByFloor">
                                <span>報修樓層</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': floorSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>報修項目</span>
                            </div>
                        </th>
                         <th>
                            <div class="sortable" @click="sortByEmergencyLevel">
                                <span>緊急程度</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': emergencyLevelSort}"></span>
                            </div>
                        </th>
                         <th>
                            <div>
                                <span>備註</span>
                            </div>
                        </th>
                         <th>
                            <div>
                                <span>延後完成日</span>
                            </div>
                        </th>
                         <th>
                            <div>
                                <span>簽核狀態</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in dataList" :key="item.ID">
                        <td>
                            <div class="selection" @click="select($event,item)"></div>
                        </td>
                        <td>{{item.Source}}</td>
                        <td>{{item.OrderCode}}</td>
                        <td>{{item.ContactPerson}}</td>
                        <td>{{item.EndTime | dateToDate}}</td>
                        <td>{{item.ContactDept}}</td>
                        <td>{{item.Floor}}</td>
                        <td>{{item.Work}}</td>
                        <td>
                            <div>
                                <i class="round default-color" :class="{'select-color' : item.EmergencyLevel >= 1}"></i>
                                <i class="round default-color" :class="{'select-color' : item.EmergencyLevel >= 2}"></i>
                                <i class="round default-color" :class="{'select-color' : item.EmergencyLevel >= 3}"></i>
                                <i class="round default-color" :class="{'select-color' : item.EmergencyLevel >= 4}"></i>
                                <i class="round default-color" :class="{'select-color' : item.EmergencyLevel >= 5}"></i>
                            </div>
                        </td>
                        <td>{{item.Remark}}</td>
                        <td>
                            <div class="typeBtn" v-if="item.EdidingInfo" :class="[
                                {'orange': item.EdidingInfo.StatusValue == 'N'},
                                {'green': item.EdidingInfo.StatusValue == 'T'}
                                ]" @click="openPane(item)">{{item.EdidingInfo.Status}}</div>
                        </td>
                        <td>
                            <div class="typeBtn" :class="[
                                {'orange': item.StatusValue == 'N'},
                                {'green': item.StatusValue == 'T'},
                                {'green': item.StatusValue == 'P'}
                                ]" @click="openDialog(item)">
                                {{item.Status}}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-paging">
            <tw-pagination type="callRepair" @upDatePageIndex="upDatePageIndex"></tw-pagination>
        </div>
        <div class="page-button">
            <tw-button title="修改" @click="changeInspection"></tw-button>
            <tw-button title="刪除" @click="deteleInspection"></tw-button>
            <tw-button title="匯出" @click=""></tw-button>
        </div>
    </div>
</template>

<script>
import DatePicker from '../units/DatePicker';
import API from '../../api/index.js';
import TwButton from '../tw-button';
import TwPagination from '../tw-pagination';
import TwSelect from '../tw-select2';
import TwSearch from '../units/tw-search';
export default {
    data(){
        return {
            typeList: [
                {
                    type: 0,
                    mes: '全選'
                },
                {
                    type: 1,
                    mes: '未處理'
                },
                {
                    type: 2,
                    mes: '已處理'
                }
            ],
            searchList:[
                {key:'EndTime',value:'預計完成日',type:'time'},
                {key:'ContactDept',value:'報修部門'},
                {key:'Floor',value:'報修樓層'}
            ],
            pageIndex: 1,
            selectList: new Map(),
            deleteBtnType: true,
            sourceSort: false,
            orderCodeSort: false,
            endTimeSort: false,
            contactDeptSort: false,
            floorSort: false,
            emergencyLevelSort: false,
            retain: false,
        }
    },
    components: {
        DatePicker,
        TwButton,
        TwPagination,
        TwSelect,
        TwSearch
    },
    methods:{
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
        resetData(){
            this.retain = true;
            this.$refs.datePicker.selectDate();
        },
        getInspectByDate(start,end){
            this.$axios.get(API.getAssignmentByDate+this.$store.state.userData.DeptType+ '/'+start+'_'+end)
            .then(res => {
                const data = res.data;
                const _data = data.filter(item => item.StatusValue !== 'D')
                this.disposeData(_data);
                this.retain = false;
            })
            .catch(err => {
                console.error(err,"巡檢叫修接口錯誤")
            })
        },
        disposeData(data){
            const _index = this.pageIndex;
            this.$store.commit('addData',{key: 'callRepairAllData',value: data})
            this.$store.commit('addData',{key: 'callRepairFilterData',value: data})
            this.$store.commit('addData',{key: 'callRepairFindData',value: data.slice((_index - 1)*12,_index*12)})
        },
        handleSearch(obj){
            this.$store.state.clearSearchValue = false;
            if(!this.retain){
                this.pageIndex = 1;
            }
            this.getInspectByDate(obj.start,obj.end);
        },
        selectType(obj){
            this.$store.state.clearSearchValue = false;
            let data;
            switch (obj.type) {
                case 0:
                    data = this.$store.state.callRepairAllData;
                    this.$store.commit('addData',{key: 'callRepairFilterData',value: data})
                    break;
                case 1:
                    data = this.filterData('N');
                    this.$store.commit('addData',{key: 'callRepairFilterData',value: data});
                    break;
                case 2:
                    data = this.filterData('T');
                    this.$store.commit('addData',{key: 'callRepairFilterData',value: data});
                    break;
            }
            this.$store.commit('addData',{key: 'callRepairFindData',value: data.slice(0,12)})
            this.$store.commit('addData',{key: 'isUpdateSortNum',value: true});
        },
        filterData(type) {
            let data = this.$store.state.callRepairAllData;
            let arr= []
            data.forEach( item => {
                if( item.StatusValue == type ) {
                    arr.push( item );
                }
            })
            return arr;
        },
        //分頁組件回調
        upDatePageIndex(index){
            this.pageIndex = index;
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('active');
            })
            this.selectList.clear();
            this.$store.commit('addData',{key: 'storageSelectData',value: []})
        },
        //修改按钮
        changeInspection(){
            this.$store.state.isShowDialog = true;
            this.$store.state.dialogType = 'editorDelay';
        },
        //刪除巡檢單
        deteleInspection(){
            if(!this.deleteBtnType) return;
            const fnArr = [];
            const self = this;
            const axios = this.$axios;
            const list = Array.from(this.selectList.values());
            if(list.length != 0){
                list.forEach(item => {
                    const _id = item.ID;
                    const fn = () => {
                        return axios.delete(API.getAssignmentByDate+this.$store.state.userData.DeptType+ '/'+_id)
                    }
                    fnArr.push(fn)
                })
            }
            axios.all([...fnArr].map(item => item()))
            .then(axios.spread(function(){
                self.resetData();
                self.selectList.clear();
                self.$alert('刪除成功','提示');
                self.deleteBtnType = true;
            }))
            .catch(err => {
                self.$alert('刪除失敗','提示')
            })
        },
        openDialog(obj){
            this.$store.commit('addData',{key: 'signedData',value: obj});
            if(obj.Signing.length){
                const a = obj.Signing[0]
                if(a.DispatchedStep){
                    this.$store.state.isShowDialog = true;
                    // this.$store.state.dialogType = 'appliedAsSigned';
                    this.$store.state.dialogType = 'callRepairPSigned';
                }else{
                    this.$store.state.isShowDialog = true;
                    this.$store.state.dialogType = 'callRepairPSigned';
                }
            }else{
                this.$store.state.isShowDialog = true;
                this.$store.state.dialogType = 'callRepairNSigned';
            }
        },
        openPane(obj){
            this.$store.commit('addData',{key: 'signedData',value: obj});
            this.$store.state.isShowDialog = true;
            this.$store.state.dialogType = 'delaySigned';
        },
        sortByOrderCode(){
             if(this.orderCodeSort){
                this.$store.commit('reverseList','callRepair')
                this.orderCodeSort = false;
            }else{
                this.$store.commit('sortByOrderCode','callRepair')
                this.orderCodeSort = true;
            }
            this.endTimeSort = false;
            this.contactDeptSor = false;
            this.floorSort = false;
            this.emergencyLevelSort = false;

        },
        sortBySource() {
            if(this.sourceSort){
                this.$store.commit('reverseList','callRepair')
                this.sourceSort = false;
            }else{
                this.$store.commit('sortBySource','callRepair')
                this.sourceSort = true;
            }
            this.orderCodeSort = false;
            this.endTimeSort = false;
            this.contactDeptSor = false;
            this.emergencyLevelSort = false;
            this.floorSort = false;
        },
        sortByEndTime(){
            if(this.endTimeSort){
                this.$store.commit('reverseList','callRepair')
                this.endTimeSort = false;
            }else{
                this.$store.commit('sortByEndTime','callRepair')
                this.endTimeSort = true;
            }
            this.orderCodeSort = false;
            this.contactDeptSor = false;
            this.floorSort = false;
            this.emergencyLevelSort = false;
        },
        sortByContactDept(){
            if(this.contactDeptSor){
                this.$store.commit('reverseList','callRepair')
                this.contactDeptSor = false;
            }else{
                this.$store.commit('sortByContactDept','callRepair')
                this.contactDeptSor = true;
            }
            this.orderCodeSort = false;
            this.endTimeSort = false;
            this.floorSort = false;
            this.emergencyLevelSort = false;
        },
        sortByFloor(){
            if(this.floorSort){
                this.$store.commit('reverseList','callRepair')
                this.floorSort = false;
            }else{
                this.$store.commit('sortByFloor','callRepair')
                this.floorSort = true;
            }
            this.orderCodeSort = false;
            this.endTimeSort = false;
            this.contactDeptSor = false;
            this.emergencyLevelSort = false;
        },
        sortByEmergencyLevel(){
            if(this.emergencyLevelSort){
                this.$store.commit('reverseList','callRepair')
                this.emergencyLevelSort = false;
            }else{
                this.$store.commit('sortByEmergencyLevel','callRepair')
                this.emergencyLevelSort = true;
            }
            this.orderCodeSort = false;
            this.endTimeSort = false;
            this.contactDeptSor = false;
            this.floorSort = false;
        },
    },
    computed: {
        dataList(){
            return this.$store.state.callRepairFindData
        },
        signType(){
            return this.$store.state.upDateSign
        }
    },
    filters: {
        dateToDate(date){
            if(!date) return ;
            const _date = date.split('T')[0]
            const __date = _date.split('-')
            __date[0] =  __date[0] - 1911
            return __date.join('/')
        }
    },
    watch: {
        signType(value){
            if(!value) return ;
            //请求数据
            this.resetData()
            //改变状态 允许下一次请求
            this.$store.state.upDateSign = false;
        }
    }
}
</script>


<style lang="less" scoped>
.inspection-list-page{
    width: 100%;
    height: auto;
    padding: 30px 50px;
    .page-head{
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        .head-select{
            display: flex;
            align-items: center;
            &>span{
                margin-right: 10px;
            }
        }
    }
}
.page-content{
    min-height: 40rem;
    table{
        width: 100%;
        text-align: left;
        tr{
            border-bottom: 1px solid #ccc;
            th,td{
                padding: 12px 0;
                font-size: 1.2rem;
            }
            th:nth-child(1){
                width: 5%;
                width: 5.4rem;
            }
            th:nth-child(2){
                width: 5%;
                width: 6.5rem;
            }
            th:nth-child(3){
                width: 10%;
                width: 10.5rem;
            }
            th:nth-child(4){
                width: 8%;
                width: 9rem;
            }
            th:nth-child(5){
                width: 10%;
                width: 10rem;
            }
            th:nth-child(6){
                width: 8%;
                width: 9.5rem;
            }
            th:nth-child(7){
                width: 8%;
                width: 8.8rem;
            }
            th:nth-child(8){
                width: 8%;
                width: 9.8rem;
            }
            th:nth-child(9){
                width: 10%;
                width: 9.8rem;
            }
            th:nth-child(10){
                width: 10%;
                width: 27.5rem;
            }
            th:nth-child(11){
                width: 8%;
                width: 6rem;
            }
            th:nth-child(12){
                width: 8%;
                width: 7.2rem;
            }
        }
    }
}

.page-button{
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &>div{
        margin: 0 10px;
    }
}
.typeBtn{
    width: 5rem;
    height: 2.4rem;
    border-radius: 5px;
    line-height: 2.4rem;
    text-align: center;
    color: #fff;
    cursor: pointer;
}
.page-paging{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.round {
    width: 1.2rem;
    height: 1.2rem;
    display: inline-block;
    border-radius: 50%;
    vertical-align: bottom;
}
.default-color {
    background: #fff;
}
.select-color {
    background: #000;
}
.sortable{
    display: inline-block;
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    .iconfont{
        margin-left: 10px;
        opacity: 0;
    }
}
.sortable:hover{
    background-color: #fff;
    .iconfont{
        opacity: 1;
    }
}

</style>


