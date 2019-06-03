/**
 * @file
 * @author
 */
// const base = 'http://project1842.icp-si.com';
const base = '';
export default {
    //登录
    login: base + '/user/login',//登录
    getProfile: base + '/user/profile',//获取用户信息
    login2: base + '/user/login2',
    /** 主仓管理 三个接口使用同一个地址 拼接的参数不同 **/
    masterMaterial: base + '/warehouse/master/material/', //获取主仓所有物料资讯 /{dept} 所有 /{dept}/{ID} 单个
    addMasterStock: base + '/warehouse/master/stockin/', //新增主仓入库单
    addMasterStockout:base + '/warehouse/master/stockout', //新增主仓出库单
    signedMaterStockin:base + '/warehouse/master/stockin/signing', //主仓入库签核
    signedMaterStockout:base + '/warehouse/master/stockout/signing', //主仓出库签核
    editMasterMaterial: base + '/warehouse/master/material',//修改主仓物料
    /** 备仓页面 **/
    slaveMaterial: base + '/warehouse/slave/material/', //获取备仓所有物料资讯 /{dept} 所有 /{dept}/{ID} 单个
    addSlaveStockin: base + '/warehouse/slave/stockin',// 备仓入库单
    signedSlaveStockin: base + '/warehouse/slave/stockin/signing',// 备仓入库签核


    /** 签核页面 **/
    getMasterInByDate: base + '/warehouse/master/stockin/', //查询 日期区间 主库入库单
    getMasterOutByDate: base + '/warehouse/master/stockout/', //查询 日期区间 主库出库单
    getSlaveInByDate: base + '/warehouse/slave/stockin/', //查询 日期区间 备库入库单
    getSlaveOutByDate: base + '/warehouse/slave/stockout/', //查询 日期区间 备库出库单

    getAllSet: base + '/warehouse/set/', // 获得所有签核 sop

    //下拉菜单数据
    getAllCode: base + '/warehouse/m-code', //取得所有物料代码



    //--------------------巡檢
    getInfo: base +'/inspection/check/info/',//取得問題清單
    addInspection: base + '/inspection/check',//新增巡检单

    //获取巡檢清單
    getInspectByDate: base + '/inspection/inspect/',
    //刪除巡檢單
    deleteInspectionById: base + '/inspection/inspect/',
    //巡检叫修总览
    getAssignmentByDate: base + '/inspection/assignment/',
    //派工单签核
    signedInspection : base + '/inspection/assignment/signing',
    //派工總覽
    getSurvey: base + '/inspection/dispatch/undone/',
    //派工总览签核
    takingSigned: base + '/inspection/dispatch',
    //巡检回馈单(满意度调查表上传签名图片)  巡檢回饋單填寫內容(满意度调查表上传内容)
    surverSigned:base + '/inspection/survey',
    //歷史清單
    getHistory: base + '/inspection/dispatch/done/',

    //新增叫修单
    editCallRepair: base + '/inspection/maintain', //新增--修改 叫修单
    getAllCategory: base + '/inspection/set-ass-category',//取得所有报修项目
    getInsCategory: base + '/inspection/set-ass-category',  //查询 指定部门  日期区间的已完成 派工单
    //延后完成日签核弹窗
    //获取签核资料
    getDelaySignedData: base + '/inspection/edit-assignment',
    delaySigned:base + '/inspection/edit-assignment/signing',
    //清單 ---- ---- ----
    getLease: base + '/site/lending/',
    getLeaseHistory: base + '/site/lending/done/',
    //场地 ---- ---- ----
    getBookingData: base +'/site/booking', //获取指定时间区间的预约资料
    getLendingData: base +'/site/booking', //获取指定时间区间的借用资料
    getSiteCalendar: base + '/site/calendar/',//獲取當月的數據
    addAndGetBookingSite: base + '/site/booking', //新增預約資料  以及查詢指定區間的數據
    addAndGetLendingSite: base + '/site/lending', //新增場地借用單  以及查詢指定區間的數據
    //場地簽核
    siteVerify: base + '/site/verify',

    //新增場地
    getSite: base + '/site/set-site', //獲取場地列表
    getActivityType: base +'/site/set-activity',//獲取活動類別

    //汇出
    exportMaster: base + '/export-w/master/',//主仓汇出
    exportMaterial: base + '/export-w/slave/',//备仓汇出
    exportSignedOutList: base + '/export-w/out-list/',//签核  物品核发统计表 汇出
    exportSignedInList: base + '/export-w/in-out-list/',//签核  物品收发月报表 汇出
    exportSignedStockList: base + '/export-w/stock-list/',//签核  物品盘点表 汇出
    exportInspection: base + '/export-i/inspection/', // 巡检  巡检清单汇出
    exportAssignment: base + '/export-i/assignment/', // 巡检  巡检叫修总览汇出
    exportDispatch: base + '/export-i/dispatch/', // 巡检  派工总览汇出
    exportHistory: base + '/export-i/survey/', // 巡检  历史清单汇出
    exportMonth: base + '/export-r/month/', // 场地  月报表汇出
    exportArrange: base + '/export-r/arrange/', // 场地  轮值表汇出
    exportQuick: base + '/export-r/quick', // 场地  速报表汇出
    exportAnnual: base + '/export-r/annual/', // 场地  年收入明细表汇出
    exportSurveyNon: base + '/export-r/survey-non', // 场地  会勘表- 不退保证金汇出
    exportSurvey: base + '/export-r/survey/', // 场地  会勘表- 退保证金汇出

};
