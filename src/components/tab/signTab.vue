<template>
    <div class="main-tab">
        <div class="tab-search">
            <div class="tab-search-search">
                <storage-search type="sign"></storage-search>
            </div>
            <div class="tab-search-date">
                <div class="block">
                    <span class="demonstration">請選擇年度月份</span>
                    <el-date-picker
                        v-model="beginDate"
                        :editable="false"
                        type="date"
                        format="yyyy/MM/dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                    <span class="demonstration">&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                    <el-date-picker
                        v-model="endDate"
                        :editable="false"
                        type="date"
                        format="yyyy/MM/dd"
                        value-format="yyyy/MM/dd"
                        placeholder="选择日期">
                    </el-date-picker>
                    <div class="tab-search-date-btn" @click="searchByDate">確認</div>
                </div>
            </div>
            <div class="tab-search-type">
                <span>審查狀態</span>
                <tw-select class="select" :datas="typeList" @change="changeSelectType"></tw-select>
            </div>
        </div>
        <div class="signed-table">
            <table>
                <thead>
                    <tr>
                        <th class="round">
                            <span class="selection" @click="checkAllEvent($event)"></span>
                        </th>
                        <th class="pointer">
                            <span class="sort-box" @click="codeSort">轉移代碼
                                <span class="iconfont arrow" :class="{'icon-tArrow': isCodeSort == 2 ,'icon-bArrow' : isCodeSort == 1}"></span>
                            </span>
                        </th>
                        <th class="pointer">
                            <span class="sort-box" @click="timeSort">申請日期
                                <span class="iconfont arrow" :class="{'icon-tArrow': isTimeSort == 2 ,'icon-bArrow' : isTimeSort == 1}"></span>
                            </span>
                        </th>
                        <th class="pointer">
                            <span class="sort-box" @click="userSort">申請人
                                <span class="iconfont arrow" :class="{'icon-tArrow': isUserSort == 2 ,'icon-bArrow' : isUserSort == 1}"></span>
                            </span>
                        </th>
                        <th>品名</th>
                        <th>数量</th>
                        <th>安全庫存量</th>
                        <th>單位</th>
                        <th>存放位置</th>
                        <th>備註</th>
                        <th>審查狀態 </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in datas" :key="i">
                        <td class="round">
                            <span class="selection" @click="theRadioEvent($event,item)"></span>
                        </td>
                        <td>{{item.OrderCode}}</td>
                        <td>{{item.CreatedTime | filterDate}}</td>
                        <td>{{item.CreatedUser}}</td>
                        <td>
                            <div v-for="(ele,i) in item.Materials" :key="i">{{ele.Name}}</div>
                        </td>
                        <td>
                            <div v-for="(ele,i) in item.Materials" :key="i">{{ele.Quantity}}</div>
                        </td>
                        <td>
                            <div v-for="(ele,i) in item.Materials" :key="i">{{ele.Limit}}</div>
                        </td>
                        <td>
                            <div v-for="(ele,i) in item.Materials" :key="i">{{ele.Spec}}</div>
                        </td>
                        <td>
                            <div v-for="(ele,i) in item.Materials" :key="i">{{ele.Location}}</div>
                        </td>
                        <td>
                            <div v-for="(ele,i) in item.Materials" :key="i">{{ele.Remark}}</div>
                        </td>
                        <td>
                            <tw-button
                            class="type-btn"
                            :type="item.StatusValue == 'N' ? 'danger' : item.StatusValue == 'T' ? 'success' : 'warning' "
                            :title="item.Status"
                            w-size="small"
                            h-size="small"
                            @click="openDialog(item)">
                            </tw-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="info-table" v-if="datas.length == 0">
            <div class="info">暫無數據</div>
        </div>
        <div class="tab-paging">
            <tw-pagination type="sign" @upDatePageIndex="upDatePageIndex"></tw-pagination>
        </div>
        <div class="tab-button">
            <tw-button title="匯出" isShadow ></tw-button>
        </div>
    </div>
</template>

<script>
import StorageSearch from '../storageSearch'
import TwButton from '../tw-button.vue';
import API from '../../api/index.js';
import TwPagination from '../tw-pagination';
import TwSelect from '../tw-select2.vue';

export default {
    name:'signTab',
    data(){
        return {
            typeList: [
                {type: 0,mes: '全選'},
                {type: 1,mes: '未審核'},
                {type: 2,mes: '已審核'},
                {type: 3,mes: '審核中'}
            ],
            beginDate: '',
            endDate: '',
            pageIndex: 1,
            selectType: {
                type: 0
            },
            isCodeSort:0,// 转移代码排序 0--默认不排序状态  1--降序  2--升序
            isTimeSort:0,//日期排序
            isUserSort:0,//申请人排序
            selectList:new Map(),//选中数据
        }
    },
    computed: {
        datas(){
            let signFindData = this.$store.state.signFindData;
            return signFindData
        },
        signType(){
            return this.$store.state.upDateSign
        }
    },
    methods: {
        //全选
        checkAllEvent(e) {
            if(e.target.classList.contains('sign-select-color')){
                //取消選中
                Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                    item.classList.remove('sign-select-color')
                })
                this.selectList.clear()
            }else{
                //選中
                Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                    item.classList.add('sign-select-color')
                })
                this.datas.forEach(item => {
                    this.selectList.set(item.ID,item)
                })
            }
        },
        //单选
        theRadioEvent(e,_item) {
             if(e.target.classList.contains('sign-select-color')){
                //取消選中
                this.selectList.delete(_item.ID)
                this.$el.querySelector('.selection').classList.remove('sign-select-color');
            }else{
                //選中
                this.selectList.set(_item.ID,_item)
                this.selectList.size == this.datas.length && this.$el.querySelector('.selection').classList.add('sign-select-color')
            }
            e.target.classList.toggle('sign-select-color');
        },
        //转移代码排序
        codeSort() {
            //降序
            this.isTimeSort = 0;
            this.isUserSort = 0;
            this.currentPage = 1;
            if( this.isCodeSort == 0 || this.isCodeSort == 2 ) {
                this.$store.commit('signCodeSort',false);
                this.isCodeSort = 1;
                return;
            }
            //升序
            if( this.isCodeSort == 1 ) {
                this.$store.commit('signCodeSort',true);
                this.isCodeSort = 2;
            }
        },
        //时间排序
        timeSort() {
            this.isCodeSort = 0;
            this.isUserSort = 0;
            //降序
            if( this.isTimeSort == 0 || this.isTimeSort == 2 ) {
                this.$store.commit('signTimeSort',false);
                this.isTimeSort = 1;
                return;
            }
            //升序
            if( this.isTimeSort == 1 ) {
                this.$store.commit('signTimeSort',true);
                this.isTimeSort = 2;
            }
        },
        //申请人排序
        userSort() {
            this.isCodeSort = 0;
            this.isTimeSort = 0;
            //降序
            if( this.isUserSort == 0 || this.isUserSort == 2 ) {
                this.$store.commit('signUserSort',false);
                this.isUserSort = 1;
                return;
            }
            //升序
            if( this.isUserSort == 1 ) {
                this.$store.commit('signUserSort',true);
                this.isUserSort = 2;
            }
        },
        upDatePageIndex(index){
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('sign-select-color')
            })
            this.selectList.clear()
            this.pageIndex = index;
        },
        getAllStockByDate(pageIndex = 1){
            const self = this;
            const start = this.beginDate
            const end = this.endDate;
            const axios = this.$axios;
            const store = this.$store;

            function getMasterInByDate(){
                return axios.get(API.getMasterInByDate+ store.state.userData.DeptType+ '/' + start + '_' + end)
            }
            function getMasterOutByDate(){
                return axios.get(API.getMasterOutByDate+ store.state.userData.DeptType+ '/' + start + '_' + end)
            }
            function getSlaveInByDate(){
                return axios.get(API.getSlaveInByDate+ store.state.userData.DeptType+ '/' + start + '_' + end)
            }
            function getSlaveOutByDate(){
                return axios.get(API.getSlaveOutByDate+ store.state.userData.DeptType+ '/' + start + '_' + end)
            }

            axios.all([getMasterInByDate(),getMasterOutByDate(),getSlaveInByDate()])
            .then(axios.spread(function (val1, val2, val3) {
                const datas = [...val1.data,...val2.data,...val3.data]
                store.commit('addData',{key: 'signAllData',value: datas})

                const _type = self.selectType.type
                let typeData = datas;
                switch (_type) {
                    case 1:
                        typeData = self.filterSigngData('N');
                        break;
                    case 2:
                        typeData = self.filterSigngData('T');
                        break;
                    case 3:
                        typeData = self.filterSigngData('P');
                        break;
                }
                store.commit('addData',{key: 'signFilterData',value: typeData})
                store.commit('addData',{key: 'signFindData',value: typeData.slice((pageIndex - 1)*12 ,pageIndex*12)})
            }));
        },
        openDialog(val){
            if(val.StatusValue == 'T') return ;
            this.$store.commit('addData',{key: 'signedData',value: val})
            this.$store.commit("SET_DIALOG_TYPE",'signed');
            this.$store.commit("SET_IS_SHOW_DIALOG");
        },
        changeSelectType(obj){
            let data;
            if(!obj) obj={type: 0}
            switch (obj.type) {
                case 0:
                    this.$store.commit('addData',{key: 'signFilterData',value: this.$store.state.signAllData})
                    break;
                case 1:
                    data = this.filterSigngData('N');
                    this.$store.commit('addData',{key: 'signFilterData',value: data});
                    break;
                case 2:
                    data = this.filterSigngData('T');
                    this.$store.commit('addData',{key: 'signFilterData',value: data});
                    break;
                case 3:
                    data = this.filterSigngData('P');
                    this.$store.commit('addData',{key: 'signFilterData',value: data});
                    break;
                default:
                    break;
            }
            this.selectType = obj;
            this.$store.commit('addData',{key: 'signFindData',value: this.$store.state.signFilterData.slice(0,12)})
            this.$store.commit('addData',{key:'isUpdateSortNum',value:true});
        },
        searchByDate(){
            const start = this.beginDate;
            const end = this.endDate;
            if(start && end){
                this.getAllStockByDate();
                store.commit('addData',{key:'isUpdateSortNum',value:true});
            }
        },
        filterDate(date){
            return [date.getFullYear(),date.getMonth()+1,date.getDate()]
        },
        filterSigngData(_type) {
            let data = this.$store.state.signAllData;
            let arr= []
            data.forEach( item => {
                if( item.StatusValue == _type ) {
                    arr.push( item );
                }
            })
            return arr;
        },
    },
    components: {
        TwButton,
        StorageSearch,
        TwButton,
        TwPagination,
        TwSelect
    },
    created(){
        const date = new Date;
        this.endDate = this.filterDate(date).join('-');
        const date2 = date.getTime() - 1000*60*60*24*30;
        this.beginDate = this.filterDate(new Date(date2)).join('-');
        this.getAllStockByDate();
    },
    filters: {
        filterDate(value){
            const val = value.split('T');
            const date = val[0].split('-');
            date[0] = date[0] - 1911;
            const str = date.join('/')
            return str
        }
    },
    watch: {
        signType(value){
            if(!value) return ;
            //请求数据
            this.getAllStockByDate(this.pageIndex);
            //改变状态 允许下一次请求
            this.$store.state.upDateSign = false;
        }
    }
};
</script>

<style lang="less" scoped>
.signed-table {
    .round {
        span{
            width: 1.3rem;
            height: 1.3rem;
            display: inline-block;
            background: #fff;
            border-radius: 0.4rem;
            position: absolute;
            top: 50%;
            // left: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
        .sign-select-color {
            background: #000;
        }
    }
    tr{
        border-bottom: 1px solid #cdd3d6;
        td,th{
            text-align: left;
            height: 3rem;
            line-height: 3rem;
            font-size: 1.2rem;
            overflow: hidden;
            &:nth-child(1) {width: 4.5rem;position: relative;}
            &:nth-child(2) {width: 13.4rem;}
            &:nth-child(3) {width: 12.3rem;}
            &:nth-child(4) {width: 11.5rem;}
            &:nth-child(5) {width: 17.5rem;}
            &:nth-child(6) {width: 11.2rem;}
            &:nth-child(7) {width: 12.6rem;}
            &:nth-child(8) {width: 8.7rem;}
            &:nth-child(9) {width: 13rem;}
            &:nth-child(10) {width: 16.1rem;}
            &:nth-child(11) {width: 7.8rem;}
        }
        .type-btn {
            top: 0.7rem;
        }
        .arrow {
            font-size: 1.2rem;
        }
        .pointer{
            cursor: pointer;
            user-select:none;
            .sort-box {
                width: 8rem;
                height: 3rem;
                border-radius: 0.8rem;
                display: inline-block;
                line-height: 3rem;
                padding-left: 0.8rem;
                &:hover {
                    background: #f7f7f7;
                }
            }
        }
    }
}
.info-table {
    width: 100%;
    min-height: 30rem;
    .info {
        width: 100%;
        font-size: 1.4rem;
        text-align: center;
        height: 5rem;
        border-bottom: 1px solid #d7d7d7d7;
        line-height: 5rem;
    }
}
.main-tab {
    width: 100%;
    min-height: 50rem;
    position: relative;
    .tab-search {
        width: 100%;
        height: 100px;
    }
    .tab-paging {
        text-align: center;
        height: 120px;
        line-height: 120px;
        // height: 15rem;
        // line-height: 8rem;
    }
}
.tab-search-search{
    float: left;
}
.tab-search-date{
    float: left;
    margin-left: 6rem;
}
.tab-search-type{
    float: right;
    &>span{
        line-height: 36px;
        margin-right: 10px;
        float: left;
    }
    .select {
        float: left;
    }
}
.zz-table-row-item{
    height: 30px;
    line-height: 30px;
}
.tab-search-date .block{
    display: flex;
    align-items: center;

}
.tab-search-date-btn{
    width: 8rem;
    height: 3rem;
    background-color: #636e72;
    border-radius: 8px;
    color: #fff;
    line-height: 3rem;
    text-align: center;
    margin-left: 10px;
    cursor: pointer;
}
.tab-button {
    text-align: center;
}
</style>

