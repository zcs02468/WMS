<template>
    <!-- 历史清单 -->
    <div class="inspection-list-page">
        <div class="page-head">
            <div>
                <date-picker reset @click="handleSearch"></date-picker>
            </div>
            <div>
               <tw-search type="history" :searchList="searchList"></tw-search>
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
                            <div>
                                <span>編號</span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>維護員</span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByCompleteDate">
                                <span>完成日</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': CompleteDateSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByWork">
                                <span>報修項目</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': workSort}"></span>
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
                                <span>績效</span>
                            </div>
                        </th>
                         <th>
                            <div>
                                <span>績效備註</span>
                            </div>
                        </th>
                        <th>
                            <div >
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
                        <td>{{item.OrderCode}}</td>
                        <td>{{item.Person}}</td>
                        <td>{{item.EndDate | dateToDate}}</td>
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
                            <div>
                                <i class="round iconfont icon-silence" :class="{'face-color' : item.Survey.Score >= 1}"></i>
                                <i class="round iconfont icon-silence" :class="{'face-color' : item.Survey.Score >= 2}"></i>
                                <i class="round iconfont icon-silence" :class="{'face-color' : item.Survey.Score >= 3}"></i>
                                <i class="round iconfont icon-silence" :class="{'face-color' : item.Survey.Score >= 4}"></i>
                                <i class="round iconfont icon-silence" :class="{'face-color' : item.Survey.Score >= 5}"></i>
                            </div>
                        </td>
                        <td>{{item.Survey.Remark2}}</td>
                        <td>
                            <div class="typeBtn" :class="[
                                {'orange': item.Survey.StatusValue == 'N'},
                                {'green': item.Survey.StatusValue == 'T'}
                                ]" @click="openDialog(item)">
                                {{item.Survey.Status}}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-paging">
            <tw-pagination type="history" @upDatePageIndex="upDatePageIndex"></tw-pagination>
        </div>
        <div class="page-button">
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
                {key:'EndDate',value:'預計完成日',type:'time'},
                {key:'Work',value:'報修項目'},
            ],
            selectList: new Map(),
            CompleteDateSort: false,
            workSort: false,
            emergencyLevelSort: false,
            retain: false,
            pageIndex: 1,
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
            this.$axios.get(API.getHistory+this.$store.state.userData.DeptType+ '/'+start+'_'+end)
            .then(res => {
                const data = res.data;
                this.disposeData(data);
                this.retain = false;
            })
            .catch(err => {
                console.error("派工總覽接口錯誤")
            })
        },
        disposeData(data){
            this.$store.commit('addData',{key: 'historyAllData',value: data})
            this.$store.commit('addData',{key: 'historyFilterData',value: data})
            this.$store.commit('addData',{key: 'historyFindData',value: data.slice(0,12)})
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
                    data = this.$store.state.historyAllData;
                    this.$store.commit('addData',{key: 'historyFilterData',value: data});
                    break;
                case 1:
                    data = this.filterData('N');
                    this.$store.commit('addData',{key: 'historyFilterData',value: data});
                    break;
                case 2:
                    data = this.filterData('T');
                    this.$store.commit('addData',{key: 'historyFilterData',value: data});
                    break;
            }
            this.$store.commit('addData',{key: 'historyFindData',value: data.slice(0,12)})
            this.$store.commit('addData',{key: 'isUpdateSortNum',value: true});
        },
        filterData(_type) {
            let data = this.$store.state.historyAllData;
            let arr= []
            data.forEach( item => {
                if( item.Survey.StatusValue == _type ) {
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
        openDialog(obj){
            if(obj.Survey.StatusValue === 'N'){
                this.$store.commit('addData',{key: 'signedData',value: obj});
                if( this.$store.state.query.qrcode == null ) {
                    this.$router.push({path:'/survey',query:{
                        System : this.$store.state.query.System,
                        Ticket : this.$store.state.query.Ticket,
                    }})
                }else {
                    this.$router.push({path:'/survey',query:{
                        qrcode:this.$store.state.query.qrcode
                    }})
                }
            }
        },
        sortByCompleteDate(){
            if(this.CompleteDateSort){
                this.$store.commit('reverseList','history')
                this.CompleteDateSort = false;
            }else{
                this.$store.commit('sortByCompleteDate','history')
                this.CompleteDateSort = true;
            }
            this.workSort = false;
            this.emergencyLevelSort = false;
        },
        sortByWork(){
            if(this.workSort){
                this.$store.commit('reverseList','history')
                this.workSort = false;
            }else{
                this.$store.commit('sortByWork','history')
                this.workSort = true;
            }
            this.CompleteDateSort = false;
            this.emergencyLevelSort = false;

        },
        sortByEmergencyLevel(){
            if(this.emergencyLevelSort){
                this.$store.commit('reverseList','history')
                this.emergencyLevelSort = false;
            }else{
                this.$store.commit('sortByEmergencyLevel','history')
                this.emergencyLevelSort = true;
            }
            this.CompleteDateSort = false;
            this.workSort = false;
        },

        searchListCallback(){
        }
    },
    computed: {
        dataList(){
            return this.$store.state.historyFindData
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
                width: 5.5rem;
            }
            th:nth-child(2){
                width: 12%;
                width: 8rem;
            }
            th:nth-child(3){
                width: 10%;
                width: 12rem;
            }
            th:nth-child(4){
                width: 10%;
                width: 10.9rem;
            }
            th:nth-child(5){
                width: 15%;
                width: 11rem;
            }
            th:nth-child(6){
                width: 20%;
                width: 10.5rem;
            }
            th:nth-child(7){
                width: 20%;
                width: 17rem;
            }
            th:nth-child(8){
                width: 8%;
                width: 12rem;
            }
            th:nth-child(9){
                width: 8%;
                width: 24.5rem;
            }
            th:nth-child(10){
                width: 8%;
                width: 8.8rem;
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
.page-paging {
    text-align: center;
    height: 100px;
    line-height: 100px;
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
.face-color{
    background: #ffee60;
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



