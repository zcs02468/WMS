/**
 * @file 状态管理
 * @author
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { stat } from 'fs';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 地址栏参数
        query:{
            System:null,
            Ticket:null,
            qrcode:null
        },
        //登录用户信息
        userData:{
            Name:null,
            Phone:null,
        },
        query:{
            qrcode : null,
            System : null,
            Ticket : null,
        },
        Hash:null,
        masterAllData: [],//主仓所有数据
        masterFindData: [],//主仓实际显示数据
        masterFilterData:[],

        slaveAllData: [], //备仓所有数据
        slaveFindData: [], //备仓实际显示数据
        slaveFilterData:[], //过滤的数据

        signAllData: [],
        signFindData: [],
        signFilterData: [],

        //巡檢單數據
        listingAllData: [],
        listingFindData: [],
        listingFilterData: [],
        //巡檢叫修數據
        callRepairAllData: [],
        callRepairFindData: [],
        callRepairFilterData: [],
        //派工單數據
        tasktingAllData: [],
        tasktingFindData: [],
        tasktingFilterData: [],
        //历史清单
        historyAllData: [],
        historyFindData: [],
        historyFilterData: [],
        //場地清單
        leaseAllData: [],
        leaseFindData: [],
        leaseFilterData: [],
        //場地歷史清單
        leaseHistoryAllData: [],
        leaseHistoryFindData: [],
        leaseHistoryFilterData: [],

        isShowPaging: false,
        dialogType: null,
        isShowDialog: false,
        storageSelectData: [],//仓储系统中选中的物料数据
        signedData: null,//指定的签核数据
        upDateSign: false, //是否更新簽核頁面的數據 保留當前頁
        nowPageIndex: 1,//当前分页参数
        isUpdateSortNum: false,//是否更新分页序号
        fontSize: null,//记录1rem等于多少px
        clearSearchValue:false,//是否清空搜索框中的内容
        inspectionTabIndex:0,//巡检页面的 tab 页 index

        //日历页面参数
        calendarData:{
            index:0,
            nowData:null
        },
    },
    mutations: {
        addData(state,obj){
            state[obj.key] = obj.value
        },
        updateStorageSelectData(state) {
            state.storageSelectData.forEach( item => {
                item.stockoutnNum = 0;
            });
        },
        //用于主仓的变更操作 取消时回复默认值
        editorMasterData(state,data) {
            data.forEach( (item,i)=> {
                //Limit Spec Location Remark
                state.storageSelectData[i].Limit = item.Limit;
                state.storageSelectData[i].Spec = item.Spec;
                state.storageSelectData[i].Location = item.Location;
                state.storageSelectData[i].Remark = item.Remark;
            })
        },
        signCodeSort(state,value) {
            state.signFilterData.sort((a,b)=> {
                let nowEle = a.OrderCode.substr(3);
                let nextEle = b.OrderCode.substr(3);
                if( value ) {
                    //升序
                    return nowEle - nextEle
                }else {
                    //降序
                    return nextEle - nowEle
                }
            })
            state.isUpdateSortNum = true;
            state.signFindData = state.signFilterData.slice(0,12)
        },
        signTimeSort(state,value) {
            state.signFilterData.sort((a,b)=> {
                let nowEle = new Date(a.CreatedTime).getTime();
                let nextEle = new Date(b.CreatedTime).getTime();
                if( value ) {
                    //升序
                    return nowEle - nextEle;
                }else {
                    //降序
                    return nextEle - nowEle;
                }
            })
            state.isUpdateSortNum = true;
            state.signFindData = state.signFilterData.slice(0,12)
        },
        signUserSort(state,value) {
            //升序
            state.signFilterData.sort( (s1, s2)=> {
                let x1 = s1.CreatedUser.toUpperCase();
                let x2 = s2.CreatedUser.toUpperCase();
                if (x1 < x2) {
                    return -1;
                }
                if (x1 > x2) {
                    return 1;
                }
                return 0;
            })
            if( !value ) {
                //降序
                state.signFilterData.reverse()
            }
            state.isUpdateSortNum = true;//!!!
            state.signFindData = state.signFilterData.slice(0,12)
        },
        editStockoutNum(state,obj) {
            state.storageSelectData[obj.index][obj.key] = obj.value
        },
        SET_IS_SHOW_DIALOG(state,value) {
            if( value != undefined) {
                state.isShowDialog = value;
            }else {
                state.isShowDialog = !state.isShowDialog
            }
        },
        SET_DIALOG_TYPE(state,value) {
            state.dialogType = value
        },
        //序号排序
        sortByCode(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                let s1 = a.Code, s2 = b.Code;
                a = s1.split('-').join();
                b = s2.split('-').join();
                // a = a.Code.toUpperCase();
                // b = b.Code.toUpperCase();
                if(a<b) return -1;
                if(a>b) return 1;
                return 0;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)

        },
        //名称排序
        sortByName(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Name
                b = b.Name
                return a.localeCompare(b,'zh-CN');
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)
        },
        //
        sortByQuantity(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Quantity
                b = b.Quantity
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)
        },
        //
        sortByLimit(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Limit
                b = b.Limit
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //
        sortByLocation(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Location.toUpperCase();
                b = b.Location.toUpperCase();
                if(a<b) return -1;
                if(a>b) return 1;
                return 0;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //
        sortByOrderCode(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.OrderCode.substr(2)
                b = b.OrderCode.substr(2)
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)

        },
        //
        sortByArea(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Area
                b = b.Area
                return a.localeCompare(b,'zh-CN');
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //
        sortByPlace(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Place
                b = b.Place
                return a.localeCompare(b,'zh-CN');
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)
        },
        //预计完成日排序
        sortByEndTime(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.EndTime && new Date(a.EndTime).getTime();
                b = b.EndTime && new Date(b.EndTime).getTime();
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //完成日排序
        sortByCompleteDate(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.CompleteDate && new Date(a.CompleteDate).getTime();
                b = b.CompleteDate && new Date(b.CompleteDate).getTime();
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //部门排序
        sortByContactDept(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.ContactDept;
                b = b.ContactDept;
                return a.localeCompare(b,'zh-CN');
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)
        },
        //楼层排序
        sortByFloor(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Floor;
                b = b.Floor;
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //来源排序
        sortBySource(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Source;
                b = b.Source;
                return a.localeCompare(b,'zh-CN');
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
            console.log( state[str+'FindData'],'@@@@@@@@@')
        },
        //紧急程度排序
        sortByEmergencyLevel(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.EmergencyLevel;
                b = b.EmergencyLevel;
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //报修项目
        sortByWork(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.Work;
                b = b.Work;
                return a.localeCompare(b,'zh-CN');
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)
        },
        //开始日期排序
        sortByBeginTime(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.AcBeginTime && new Date(a.AcBeginTime).getTime();
                b = b.AcBeginTime && new Date(b.AcBeginTime).getTime();
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //结束日期排序
        sortByEndTime(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.AcEndTiem && new Date(a.AcEndTiem).getTime();
                b = b.AcEndTiem && new Date(b.AcEndTiem).getTime();
                return a - b;
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12);
        },
        //地点排序
        sortBySite(state,str){
            state[str+'FilterData'].sort((a,b)=>{
                a = a.LendingSite;
                b = b.LendingSite;
                return a.localeCompare(b,'zh-CN');
            })
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)
        },
        //倒序排序
        reverseList(state,str){
            state[str+'FilterData'].reverse();
            state.isUpdateSortNum = true;
            state[str+'FindData'] = state[str+'FilterData'].slice(0,12)
        }
    }
});

