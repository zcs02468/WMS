<template>
    <!-- 巡檢清單 -->
    <div class="inspection-list-page">
        <div class="page-head">
            <div class="head-picker">
                <date-picker ref="datePicker" reset @click="handleSearch"></date-picker>
            </div>
            <div>
                <tw-search type="listing" :searchList="searchList"></tw-search>
            </div>
            <div class="head-select">
                <span>處理狀態</span>
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
                            <div class="sortable" @click="sortByOrderCode">
                                <span>巡檢編號</span>
                                <span class="iconfont icon-bArrow"></span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>召集人</span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByArea">
                                <span>區域</span>
                                <span class="iconfont icon-bArrow"></span>

                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByPlace">
                                <span>缺失地點</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': codeSort}"></span>

                            </div>
                        </th>
                        <th>
                            <div>
                                <span>缺失項目</span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>備註</span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>處理狀態</span>
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
                        <td>{{item.CreatedUser}}</td>
                        <td>{{item.Area}}</td>
                        <td>{{item.Place}}</td>
                        <td>{{item.Desc}}</td>
                        <td>{{item.Remark}}</td>
                        <td>
                            <div class="typBtn" :class="[{'orange': item.StatusValue == 'N'},{'green': item.StatusValue == 'T'}]" @click="openDialog(item)">{{item.Status}}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="tab-paging">
            <tw-pagination type="listing" @upDatePageIndex="upDatePageIndex"></tw-pagination>
        </div>
        <div class="page-button">
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
            pageIndex: 1,
            codeSort: false,
            areaSort: false,
            placeSort: false,
            searchList:[
                {key:'OrderCode',value:'巡檢編號'},
                {key:'Area',value:'區域'},
                {key:'Place',value:'缺失地點'},
            ],
            selectList: new Map(),
            deleteBtnType: true,
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
        getInspectByDate(start,end){
            this.$axios.get(API.getInspectByDate+start+'_'+end)
            .then(res => {
                const data = res.data;
                const _data = data.filter(item => item.StatusValue !== 'D');
                this.disposeData(_data);
                this.retain = false;
            })
            .catch(err => {
                console.error(err,"巡检清单接口錯誤")
            })
        },
        resetData(){
            this.retain = true;
            this.$refs.datePicker.selectDate();
        },
        disposeData(data){
            const _index = this.pageIndex;
            this.$store.commit('addData',{key: 'listingAllData',value: data})
            this.$store.commit('addData',{key: 'listingFilterData',value: data})
            this.$store.commit('addData',{key: 'listingFindData',value: data.slice((_index - 1)*12,_index*12)})
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
                    data = this.$store.state.listingAllData
                    this.$store.commit('addData',{key: 'listingFilterData',value: data})
                    break;
                case 1:
                    data = this.filterData('N');
                    this.$store.commit('addData',{key: 'listingFilterData',value: data});
                    break;
                case 2:
                    data = this.filterData('T');
                    this.$store.commit('addData',{key: 'listingFilterData',value: data});
                    break;
            }
            this.$store.commit('addData',{key: 'listingFindData',value: data.slice(0,12)})
            this.$store.commit('addData',{key: 'isUpdateSortNum',value: true});
        },
        filterData(_type) {
            let data = this.$store.state.listingAllData;
            let arr= []
            data.forEach( item => {
                if( item.StatusValue == _type ) {
                    arr.push( item );
                }
            })
            return arr;
        },
        //分頁組件回調
        upDatePageIndex(index){
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('active');
            })
            this.selectList.clear();
            this.$store.commit('addData',{key: 'storageSelectData',value: []})
            this.pageIndex = index;
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
                        return axios.delete(API.deleteInspectionById+_id)
                    }
                    fnArr.push(fn)
                })
            }
            axios.all([...fnArr].map(item => item()))
            .then(axios.spread(function(){
                self.resetData();
                self.$alert('刪除成功','提示')
                self.selectList.clear();
                self.deleteBtnType = true;
            }))
            .catch(err => {
                self.$alert('刪除失敗','提示')
            })
        },
        openDialog(obj){
            if(obj.StatusValue === 'N'){
                this.$store.commit('addData',{key: 'signedData',value: obj});
                this.$store.state.inspectionTabIndex = 1;
            }
        },
        sortByOrderCode(){
            if(this.codeSort){
                this.$store.commit('reverseList','listing')
                this.codeSort = false;
            }else{
                this.$store.commit('sortByOrderCode','listing')
                this.codeSort = true;
            }
            this.areaSort = false;
            this.placeSort = false;
        },
        sortByArea(){
            if(this.areaSort){
                this.$store.commit('reverseList','listing')
                this.areaSort = false;
            }else{
                this.$store.commit('sortByArea','listing')
                this.areaSort = true;
            }
            this.codeSort = false;
            this.placeSort = false;
        },
        sortByPlace(){
            if(this.placeSort){
                this.$store.commit('reverseList','listing')
                this.placeSort = false;
            }else{
                this.$store.commit('sortByPlace','listing')
                this.placeSort = true;
            }
            this.codeSort = false;
            this.areaSort = false;
        }
    },
    computed: {
        dataList(){
            return this.$store.state.listingFindData
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
            }
            th,td {
                font-size: 1.2rem;
            }
            th:nth-child(1){
                width: 5%;
                width: 5.4rem;
            }
            th:nth-child(2){
                width: 12%;
                width: 9rem;
            }
            th:nth-child(3){
                width: 10%;
                width: 8rem;
            }
            th:nth-child(4){
                width: 10%;
                width: 8.5rem;
            }
            th:nth-child(5){
                width: 15%;
                width: 11rem;
            }
            th:nth-child(6){
                width: 20%;
                width: 22rem;
            }
            th:nth-child(7){
                width: 20%;
                width: 49.5rem;
            }
            th:nth-child(8){
                width: 8%;
                width: 6.9rem;
            }
        }
    }
}
.tab-paging {
    margin-top: 10px;
    text-align: center;
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
.typBtn{
    width: 5rem;
    height: 2.4rem;
    border-radius: 5px;
    line-height: 2.4rem;
    text-align: center;
    color: #fff;
    cursor: pointer;
}
.tab-paging{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
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

