<template>
    <div class="inspection-list-page">
        <div class="page-head">
            <div>
                <date-picker reset pusher @click="handleSearch"></date-picker>
            </div>
            <div>
               <tw-search type="leaseHistory" :searchList="searchList"></tw-search>
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
                            <div class="sortable" @click="sortByBeginTime">
                                <span>活動起始日</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': beginTimeSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortByEndTime">
                                <span>活動終止日</span>
                                <span class="iconfont icon-bArrow" :class="{'icon-tArrow': endTimeSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div class="sortable" @click="sortBySite">
                                <span>活動地點</span>
                                 <span class="iconfont icon-bArrow" :class="{'icon-tArrow': siteSort}"></span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>活動名稱</span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>活動內容</span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>使用單位</span>
                            </div>
                        </th>
                        <th>
                            <div>
                                <span>使用費</span>
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
                        <td>{{item.AcBeginTime | dateToDate}}</td>
                        <td>{{item.AcEndTiem | dateToDate}}</td>
                        <td>{{item.LendingSite}}</td>
                        <td>{{item.ActivityTitle}}</td>
                        <td>{{item.ActivityContent}}</td>
                        <td>{{item.LendingContact.Dept}}</td>
                        <td>{{item.Charge}}</td>
                        <td>
                            <div class="typeBtn"
                                :class="[
                                    {'orange': item.StatusValue == 'N'},
                                    {'green': item.StatusValue == 'T'},
                                    {'blue': item.StatusValue == ''},
                                    {'yellow': item.StatusValue == ''},
                                ]" @click="openDialog(item)">{{item.Status}}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-paging">
            <tw-pagination type="leaseHistory" @upDatePageIndex="upDatePageIndex"></tw-pagination>
        </div>
        <div class="page-button">
            <tw-button title="修改" @click="changeLease"></tw-button>
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
            selectList: new Map(),
            searchList:[],
            beginTimeSort: false,
            endTimeSort: false,
            siteSort: false,
            pageIndex: 1,
            searchList:[
                {key:'LendingSite',value:'活動地點'},
                {key:'ActivityTitle',value:'活動名稱'},
                {key:'LendingContact.Dept',value:'使用單位',type:'hierarchy'},
            ]
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
            this.$axios.get(API.getLeaseHistory+start+'_'+end)
            .then(res => {
                const data = res.data;
                this.disposeData(data);
            })
            .catch(err => {
                console.error("場地歷史清單接口錯誤")
            })
        },
        disposeData(data){
            this.$store.commit('addData',{key: 'leaseHistoryAllData',value: data})
            this.$store.commit('addData',{key: 'leaseHistoryFilterData',value: data})
            this.$store.commit('addData',{key: 'leaseHistoryFindData',value: data.slice(0,12)})
        },
        handleSearch(obj){
            this.getInspectByDate(obj.start,obj.end);
        },
        selectType(obj){
            let data;
            switch (obj.type) {
                case 0:
                    data = this.$store.state.leaseHistoryAllData;
                    this.$store.commit('addData',{key: 'leaseHistoryFilterData',value: data});
                    break;
                case 1:
                    data = this.filterData('N');
                    this.$store.commit('addData',{key: 'leaseHistoryFilterData',value: data});
                    break;
                case 2:
                    data = this.filterData('T');
                    this.$store.commit('addData',{key: 'leaseHistoryFilterData',value: data});
                    break;
            }
            this.$store.commit('addData',{key: 'leaseHistoryFindData',value: data.slice(0,12)})
            this.$store.commit('addData',{key: 'isUpdateSortNum',value: true});
        },
        filterData(_type) {
            let data = this.$store.state.leaseHistoryAllData;
            let arr= []
            data.forEach( item => {
                if( item.StatusValue == _type ) {
                    arr.push( item );
                }
            })
            return arr;
        },
        //分頁組件回調
        upDatePageIndex(){
            this.pageIndex = index;
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('active');
            })
            this.selectList.clear();
            this.$store.commit('addData',{key: 'storageSelectData',value: []})
        },
         //修改按钮
        changeLease(){
            if( this.selectList.size == 0 ) {
                this.$alert('請選中數據進行修改','提示')
                return;
            }
            if( this.selectList.size >1 ) {
                this.$alert('一次僅能修改一筆','提示')
                return;
            }
            // this.$router.push({path:'/addActivity'})
            this.$router.push({path:'/addActivity',query:{
                System : this.$store.state.query.System,
                Ticket : this.$store.state.query.Ticket,
                id: this.$store.state.storageSelectData[0].ID
            }})
            // this.$store.state.isShowDialog = true;
            // this.$store.state.dialogType = 'editorDelay';
        },
        //匯出
        remit() {
            this.$store.state.dialogType = 'remit';
            this.$store.state.isShowDialog = true;
        },
        //打开弹窗
        openDialog(obj){
            console.log('1111111')
            if(obj.StatusValue === 'N'){
                this.$store.commit('addData',{key: 'signedData',value: obj});
                this.$parent.showPane = true;
                return;
            }
            if( obj.StatusValue == 'T' ) {
                this.$store.commit('addData',{key: 'storageSelectData',value: []});
                this.$store.commit('addData',{key: 'storageSelectData',value: [obj]});
                this.$router.push({path:'/addActivity',query:{
                    System : this.$store.state.query.System,
                    Ticket : this.$store.state.query.Ticket,
                    id: this.$store.state.storageSelectData[0].ID
                }})
            }

        },
        sortByBeginTime(){
            if(this.beginTimeSort){
                this.$store.commit('reverseList','leaseHistory')
                this.beginTimeSort = false;
            }else{
                this.$store.commit('sortByBeginTime','leaseHistory')
                this.beginTimeSort = true;
            }
            this.endTimeSort = false;
            this.siteSort = false;
        },
        sortByEndTime(){
            if(this.endTimeSort){
                this.$store.commit('reverseList','leaseHistory')
                this.endTimeSort = false;
            }else{
                this.$store.commit('sortByEndTime','leaseHistory')
                this.endTimeSort = true;
            }
            this.beginTimeSort = false;
            this.siteSort = false;
        },
        sortBySite(){
            if(this.siteSort){
                this.$store.commit('reverseList','leaseHistory')
                this.siteSort = false;
            }else{
                this.$store.commit('sortBySite','leaseHistory')
                this.siteSort = true;
            }
            this.beginTimeSort = false;
            this.endTimeSort = false;
        }
    },
    computed: {
        dataList(){
            return this.$store.state.leaseHistoryFindData
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
    min-height: 45rem;
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
                width: 5.5rem;
            }
            th:nth-child(2){
                width: 9.5rem;
            }
            th:nth-child(3){
                width: 11rem;
            }
            th:nth-child(4){
                width: 13rem;
            }
            th:nth-child(5){
                width: 35rem;
            }
            th:nth-child(6){
                width: 9rem;
            }
            th:nth-child(7){
                width: 25.5rem;
            }
            th:nth-child(8){
                width: 5rem;
            }
            th:nth-child(9){
                width: 7.5rem;
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
.page-paging{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>



