<template>
    <div class="app-site">
        <div class="site-title">
            <div class="app-title" @click="skipSite">場地租借管理系統</div>
        </div>
        <div class="calendar-content">
            <div class="activity-top">
                <div class="activity-left">
                    <form class="activity-from">
                        <div class="activity-from-item">
                            <label class="from-label">申請使用場地</label>
                            <div class="from-content from-item1">
                                <div v-for="(item,i) in siteArr"  class="radio-item">
                                    <span>
                                        <span class="round" :class="{'select-color' : BookingSiteID == item.ID}" v-show="item.SubSites.length == 0" @click="changeSite(item)"></span>
                                        <span class="title">{{item.MainSite}}</span>
                                        <span class="interval" v-show="i != 0">(</span>
                                    </span>
                                    <span v-for="(ele,index) in item.SubSites">
                                        <span class="round" :class="{ 'select-color' : BookingSiteID == ele.ID }" @click="changeSite( ele )"></span>
                                        <span class="title">{{ele.SubSite}}</span>
                                    </span>
                                    <span class="interval" v-show="i != 0">)</span>
                                </div>
                            </div>
                        </div>
                        <div class="activity-from-item from-input1">
                            <label class="from-label">舉辦活動名稱</label>
                            <div class="from-content">
                                <input type="text" placeholder="請輸入活動名稱" v-model="ActivityTitle">
                            </div>
                        </div>
                        <div class="activity-from-item from-activity">
                            <label class="from-label">舉辦活動性質</label>
                            <ul class="from-content">
                                <li v-for="(item,i) in activityArr">
                                    <span class="round" :class="{'select-color' : ActivityTypeID == item.ID }" @click="activityClick(item)"></span>
                                    <span class="title">{{item.TypeName}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="activity-from-item from-input1">
                            <label class="from-label">舉辦活動內容</label>
                            <div class="from-content">
                                <input type="text" placeholder="請輸入活動內容" v-model="ActivityContent">
                            </div>
                        </div>
                        <div class="activity-from-item" v-for="(item,i) in dateArr">
                            <label class="from-label">{{item.title}}</label>
                            <div class="from-content from-date-tiem">
                                <div class="select-date">
                                    <span>{{item.date | filterDate}}</span>
                                    <span class="iconfont icon-bArrow"></span>

                                    <el-date-picker v-model="item.date" :editable="false" type="date" placeholder="选择日期" class="change-date">
                                    </el-date-picker>
                                </div>
                                <div class="select-time">
                                    <span>{{item.time | filterTime}}</span>
                                    <span class="iconfont icon-bArrow"></span>
                                    <el-time-select placeholder="起始时间" v-model="item.time" :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:59'
                                    }" class="change-time">
                                    </el-time-select>
                                </div>
                            </div>
                        </div>
                        <div class="activity-from-item from-input" v-for="(item,i) in inputArr">
                            <label class="from-label">{{item.title}}</label>
                            <div class="from-content">
                                <input v-if="item.verify == 'number'" type="text" v-model="item.value" @input="numberInput(item)" @change="numberInput(item)" :placeholder=" '請輸入'+ item.title">
                                <input v-else-if="item.verify == 'email'" type="text" v-model="item.value" :placeholder=" '請輸入'+ item.title">
                                <input v-else type="text" v-model="item.value" :placeholder=" '請輸入'+ item.title">
                            </div>
                        </div>
                        <div class="activity-from-item">
                            <label class="from-label">申請日期</label>
                            <div class="from-content">
                                <span class="now-day">107年12月30日</span>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="activity-right">
                    <div class="note">
                        <span class="title">備註</span>
                        <div class="note-content">
                            <textarea v-model="Remark"></textarea>
                        </div>
                    </div>

                    <div class="img-data">
                        <div class="operation-area">
                            <span class="headline">附件</span>
                            <div class="area" @click="upLoadImg">
                                <span class="iconfont icon-upload"></span>
                                <span>請拖拽檔案至此區塊</span>
                                <input @change="inputChange" ref="upLoadImg" type="file" name="file" multiple="multiple">
                            </div>
                        </div>
                        <div class="img-progress" v-for="(item,i) in fileData" :key="i">
                            <div class="look-img">
                                <img :src="item.content" alt="">
                            </div>
                            <div class="look-progress">
                                <div class="img-name">
                                    <span class="name">{{item.name}}</span>
                                    <span class="iconfont icon-guanbi"  v-show="item.complete != '100%'" @click="deleteImg(i)"></span>
                                </div>
                                <div class="file-size">{{item.size}}</div>
                                <div class="grogress">
                                    <span class="grogress-success" :style="{ width: item.complete,transition: 'linear .3s' }"></span>
                                </div>
                                <div class="proportion">
                                    <span>{{item.complete}}</span>
                                    <span v-show="item.errorIsShow">檔案傳送失敗</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="activity-link">
                    <div class="table" @click="downloadClick">
                        <span class="iconfont icon-download"></span>
                        <span class="title">附件下载</span>
                    </div>
                    <!-- <div class="light">
                        <span class="iconfont icon-light"></span>
                        <span class="title">灯光租借</span>
                    </div> -->
                </div>
            </div>
            <div class="activity-foot">
                <div class="btn-box">
                    <tw-btn title="送出" @click="confirm"></tw-btn>
                    <tw-btn class="calcel" title="取消" @click="cancel"></tw-btn>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import API from '../api/index.js'
import TwBtn from "../components/tw-btn";
export default {
    data() {
        return {
            BookingID: null,
            BookingSiteID: null,//申請使用場地
            ActivityTypeID: null,//舉辦活動性質
            ActivityTitle: null,//活動名稱
            ActivityContent: null,//活動內容
            dateArr: [],
            inputArr: [],
            siteArr : [],
            activityArr:[],
            Remark:'',//備註
            nowTime: "",
            //上傳附件
            fileData:[],
            isRouteLease:false,
        };
    },
    components: {
        TwBtn
    },

    created() {
        const nowDate = new Date();
        let year = nowDate.getFullYear() - 1911;
        let month = nowDate.getMonth();
        let date = nowDate.getDate();
        this.nowTime = `${year}年${month}月${date}日`;
        if( this.$store.state.storageSelectData != null &&  this.$store.state.storageSelectData.length != 0) {
            this.updateData()
        }else {
            let id = this.getUrlKey('id')
            if( id != undefined ) {
                this.$axios.get(API.addAndGetLendingSite + '/' + id ).then( res => {
                    this.$store.state.storageSelectData = res.data
                    this.updateData()
                }).catch( err => {
                    this.initData();
                })
            }else {
                this.initData();
            }   
        }
        this.getSite();
        this.getActivityType();
        if( this.BookingID != null ) {
            this.isRouteLease = true;
        }
    },

    mounted() {
        const dropbox = document.querySelector('.area');
        dropbox.addEventListener('dragenter', this.onDrag, false);
        dropbox.addEventListener('dragover', this.onDrag, false);
        dropbox.addEventListener('drop', this.onDrop, false);
    },

    methods: {
        skipSite() {
            if( this.$store.state.query.System == null && this.$store.state.query.Ticket == null) {
                this.$router.push({path:'/site'})
            }else {
                this.$router.push({path:'/site',query:{
                    System : this.$store.state.query.System,
                    Ticket : this.$store.state.query.Ticket,
                }})
            }
        },
        //送出
        confirm() {
            let isSuccess = this.judgeData();
            if( isSuccess != 'isOk') {
                this.$alert(isSuccess, '提示', {
                    confirmButtonText: '確定',
                    callback: action => {}
                });
            }else {
                if( this.BookingID == null) {
                    this.ajaxAddsite();
                }else {
                    this.editorLendingSiteData();
                }
            }
        },
        //取消
        cancel() {
            if( this.isRouteLease ) {
                // this.$router.push({path:'/lease'})
                this.$router.push({path:'/lease',query:{
                    System : this.$store.state.query.System,
                    Ticket : this.$store.state.query.Ticket,
                }})
            }else {
                this.initData();
            }
        },
        //活动场地选择
        changeSite(_item) {
            this.BookingSiteID = _item.ID;
        },
        //活动性质选择
        activityClick(_item) {
            this.ActivityTypeID = _item.ID;
        },
        //点击附件下载
        downloadClick() {
            let src = '/download/site_attached'
            var eleLink = document.createElement('a');
            eleLink.download = src;
            eleLink.style.display = 'none';
            eleLink.href = src;
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
        },
        //
        numberInput(_item) {
            _item.value=_item.value.replace(/[^\d]/g,'');
        },
        //初始化页面数据
        initData( ) {
            let date = new Date()
            this.BookingID = null
            this.BookingSiteID = null//申請使用場地
            this.ActivityTypeID = null//舉辦活動性質
            this.ActivityTitle = null//活動名稱
            this.ActivityContent = null//活動內容
            this.inputArr =  [
                { title: "申請單位", value: "",judgeEmpty : true, verify : '' },
                { title: "聯絡人", value: "",judgeEmpty : true, verify : '' },
                { title: "聯絡地址", value: "",judgeEmpty : true, verify : '' },
                { title: "連絡電話", value: "",judgeEmpty : true, verify : 'number' },
                { title: "E-mail", value: "",judgeEmpty : true, verify : 'email' },
                { title: "手機", value: "",judgeEmpty : true, verify : 'number' },
                { title: "傳真電話", value: "",judgeEmpty : false, verify : 'number' },
                { title: "銀行帳戶", value: "",judgeEmpty : false, verify : ''},
            ],
            this.dateArr = [
                { title: "起始時間(場佈)", date: date, time: "00:00" },
                { title: "正式活動時間", date: date, time: "00:00" },
                { title: "活動結束時間", date: date, time: "00:00" },
                { title: "終止時間", date: date, time: "00:00" }
            ]
        },
        updateData() {
            this.BookingID = this.selectData.ID
            this.BookingSiteID = this.selectData.LendingSiteID//申請使用場地
            this.ActivityTypeID = this.selectData.ActivityTypeID//舉辦活動性質
            this.ActivityTitle = this.selectData.ActivityTitle//活動名稱
            this.ActivityContent = this.selectData.ActivityContent//活動內容
            let LendingContact = this.selectData.LendingContact;
            this.inputArr =  [
                { title: "申請單位", value: LendingContact.Dept,judgeEmpty : true, verify : '' },
                { title: "聯絡人", value: LendingContact.Dept,Name : true, verify : '' },
                { title: "聯絡地址", value: LendingContact.Address,judgeEmpty : true, verify : '' },
                { title: "連絡電話", value: LendingContact.Phone,judgeEmpty : true, verify : 'number' },
                { title: "E-mail", value: LendingContact.Email,judgeEmpty : true, verify : 'email' },
                { title: "手機", value: LendingContact.CellPhone,judgeEmpty : true, verify : 'number' },
                { title: "傳真電話", value: LendingContact.Fax,judgeEmpty : false, verify : 'number' },
                { title: "銀行帳戶", value: LendingContact.BankAccount,judgeEmpty : false, verify : ''},
            ];
            let BeginTime = this.judgeTime( this.selectData.BeginTime )
            let AcBeginTime = this.judgeTime( this.selectData.AcBeginTime )
            let AcEndTiem = this.judgeTime( this.selectData.AcEndTiem )
            let EndTime = this.judgeTime( this.selectData.EndTime )
            this.dateArr = [
                { title: "起始時間(場佈)", date: this.selectData.BeginTime, time: BeginTime },
                { title: "正式活動時間", date: this.selectData.AcBeginTime, time: AcBeginTime },
                { title: "活動結束時間", date: this.selectData.AcEndTiem, time: AcEndTiem },
                { title: "終止時間", date: this.selectData.EndTime, time: EndTime }
            ]
        },
        judgeTime(val) {
            let time =  val.split('T')[1].split(':');
            return `${time[0]}:${time[1]}`
        },
        //新增借用單
        ajaxAddsite() {
            let data = this.getAjaxData();
            data.BookingID = this.BookingID;
            this.$axios.post(API.addAndGetLendingSite,data).then( res =>{
                this.BookingID = res.data.ID;
                this.$alert('新增成功！請繼續上傳右側附件', '提示', {
                    confirmButtonText: '確定',
                    callback: action => {}
                });
            }).catch( err => {
                this.$alert('新增失敗!請重試', '提示', {
                    confirmButtonText: '確定',
                    callback: action => {}
                });
            })
        },
        //更新借用單數據
        editorLendingSiteData() {
            let data = this.getAjaxData();
            this.$axios.patch(API.addAndGetLendingSite+'/'+this.BookingID,data).then(res => {
                this.$alert('更新借用單數據成功', '提示', {
                    confirmButtonText: '確定',
                    callback: action => {}
                });
            }).catch( err => {
                this.$alert('更新借用單數據失敗，請重試', '提示', {
                    confirmButtonText: '確定',
                    callback: action => {}
                });
            })
        },
        //判断参数是否传输
        judgeData() {
            if( this.BookingSiteID == '' || this.BookingSiteID == null) return '請選擇使用場地';
            if( this.ActivityTitle == '' || this.ActivityTitle == null) return '請輸入活動名稱';
            if( this.ActivityTypeID == '' || this.ActivityTypeID == null) return '請選擇活動性質';
            if( this.ActivityContent == '' || this.ActivityContent == null) return '請輸入活動內容';
            let arr = [
                '請輸入申請單位',
                '請輸入聯絡人',
                '請輸入聯絡地址',
                '請輸入連絡電話',
                '請輸入E-mail',
                '請輸入手機號碼',
                '請輸入傳真電話',
                '請輸入銀行賬號',
                '請輸入正確的E-mail格式'
            ]
            let info = 'isOk';
            for (let i = 0; i < this.inputArr.length; i++) {
                if( this.inputArr[i].verify == 'email' ) {
                    if( !this.verifyEmail(this.inputArr[i].value) ) {
                        info = arr[arr.length-1]
                    }
                }
                if(this.inputArr[i].judgeEmpty &&  (this.inputArr[i].value == '' || this.inputArr[i] == null )) {
                    info = arr[i]
                    break;
                }   
            }
            return info;
        },
        //郵箱地址判斷
        verifyEmail(_value) {
            console.log(_value)
            let mal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(!(mal.test(_value))) {
                return false;
            }else{
                return true;
            }
        },
        //获取后台所需的数据
        getAjaxData() {
            let arr = JSON.parse(JSON.stringify( this.dateArr ));
            arr.forEach( item => {
                let date = new Date( item.date );
                let time = item.time.split(':');
                let y = date.getFullYear(),
                    m = date.getMonth(),
                    d = date.getDate(),
                    h = time[0],
                    i = time[1],
                    s = '00';
                let dd = `${y}-${m+1}-${d}T${h}:${i}:${s}`;
                item.date = dd;
            })
            let data = {
                "LendingSiteID": this.BookingSiteID,//申請使用場地
                "ActivityTypeID": this.ActivityTypeID,//舉辦活動性質
                "ActivityTitle": this.ActivityTitle,//活動名稱
                "ActivityContent": this.ActivityContent,//活動內容
                "BeginTime": arr[0].date,//場佈時間
                "AcBeginTime": arr[1].date,//正式活動時間
                "AcEndTime": arr[2].date,//正式活動間
                "EndTime": arr[3].date,//中止時間
                "LendingDept": this.inputArr[0].value,//申請單位
                "Contact": {
                    "Name": this.inputArr[1].value,//聯絡人
                    "Address": this.inputArr[2].value,//地址
                    "Phone": this.inputArr[3].value,//電話
                    "Email": this.inputArr[4].value,//信箱
                    "CellPhone": this.inputArr[5].value,//手機
                    "Fax": this.inputArr[6].value,//傳真
                    "BankAccount" : this.inputArr[7].value//銀行賬號
                },
                "Remark": this.Remark,//備註
                "ToBooking": true
            }
            return data;
        },
        getSite() {
            this.$axios.get(API.getSite).then( res => {
                console.log( res,'場地')
                this.siteArr = res.data;
            })
        },
        getActivityType() {
            this.$axios.get(API.getActivityType).then( res => {
                console.log( res,'類別')
                this.activityArr = res.data;
            })
        },
        //上傳附件 ------
        upLoadImg() {
            this.$refs.upLoadImg.click()
        },
        inputChange(e) {
            let files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                // let typeArr = files[i].type.split('/')
                // if( typeArr[0] == 'image' && this.screenImg( typeArr[1] ) ) {
                    this.previewImg(files[i])
                // }else {
                //     this.openInfo('僅支援jpg, jpeg, png, gif圖片檔案')
                // }
            }
        },
        deleteImg(i) {
            this.fileData.splice(i,1);
        },
        onDrag: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        onDrop: function (e) {
            if( this.BookingID == null ) {
                this.$alert('請先填寫左側的資料送出後再進行上傳附件', '提示', {
                    confirmButtonText: '確定',
                    callback: action => {}
                });
            }
            e.stopPropagation();
            e.preventDefault();
            var dt = e.dataTransfer;
            for (var i = 0; i !== dt.files.length; i++) {
                let typeArr = dt.files[i].type.split('/')
                // if( typeArr[0] == 'image' && this.screenImg( typeArr[1] ) ) {
                    this.previewImg(dt.files[i])
                // }else {
                //     this.$alert('请上传文件类型为 jpg, jpeg, png, gif 的图片', '提示', {
                //         confirmButtonText: '確定',
                //         callback: action => {}
                //     });
                // }
            }
        },
        screenImg(_imgType) {
            let arr = ['jpg', 'jpeg', 'png', 'gif'];
            return arr.some( item => {
                return item == _imgType
            })
        },
        uploadFile(data,_index) {
            var fd = new FormData();
            fd.append('myFile', data);
            let _data = fd;
            var config = {
                async: true,
                contentType: false,
                processData: false,
                //上传进度查看
                onUploadProgress: progressEvent => {
                    var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                    this.fileData[_index].complete = complete;
                }
            }
            this.$axios.post(API.addAndGetLendingSite+'/'+this.BookingID,_data,config).then( res => {
                
            })
            .catch(err => {
                this.fileData[_index].errorIsShow = true;
                this.fileData[_index].complete = '0%';
                this.$alert('附件上傳失敗', '提示', {
                    confirmButtonText: '確認',
                    callback: action => {
                        let data = this.fileData;
                        let arr =[]
                        data.forEach( item => {
                            if( !item.errorIsShow ) {
                                arr.push( item )
                            }
                        })
                        this.finishDate = arr;
                    }
                });
            })
        },
        // 图片yulan
        previewImg(_fileData) {
            let reader = new FileReader();
            let obj = {
                name:_fileData.name,
                size: Math.floor((_fileData.size/1024)*100)/100 + 'KB',
                complete:'0%',
                errorIsShow:false,
            }
            reader.readAsDataURL(_fileData);
            reader.onload = (e) => {
                obj.content = e.target.result
                this.fileData.push( obj )
                let len = this.fileData.length - 1;
                this.uploadFile( _fileData ,len)

            }
        },
        //自動添加假數據
        falseData() {
            this.BookingSiteID = 2,//申請使用場地
            this.ActivityTypeID = 2,//舉辦活動性質
            this.ActivityTitle = '測試活動名稱1',//活動名稱
            this.ActivityContent = '測試活動內容',//活動內容
            this.inputArr =  [
                { title: "申請單位", value: "測試申請單位" },
                { title: "聯絡人", value: "測試聯絡人" },
                { title: "聯絡地址", value: "測試聯絡地址" },
                { title: "連絡電話", value: "測試聯絡電話" },
                { title: "E-mail", value: "123@aa.com" },
                { title: "手機", value: "110120119" },
                { title: "傳真電話", value: "1234566" },
                { title: "銀行賬號", value: "1123468" },
            ]
        },
        getUrlKey(name) {
            return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null;
        },
    },

    computed:{
        selectData() {
            return this.$store.state.storageSelectData[0]
        }
    },

    filters: {
        //日期
        filterDate(value) {
            console.log( value,'00000000000' )
            const date = new Date(value);
            let dayArr = ["日", "一", "二", "三", "四", "五", "六"];
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes(),
                // s = date.getSeconds(),
                w = date.getDay(); //注:0-6对应为星期日到星期六
            Y = Y - 1911;
            const t = `${Y}年${m}月${d}日  星期${dayArr[w]}`;
            return t;
        },
        //時間
        filterTime(val) {
            if(val == '' ) return '';
            let arr = val.split(":");
            let time = "上午",
                h = arr[0];
            if (arr[0] > 12) {
                time = "下午";
                h = h -12
                if( h <10 ) {
                    h = `0${h}`;
                }
            }
            return `${time}  ${h}:${arr[1]}`;
        }
    },

    watch: {}
};
</script>

<style lang="less" scoped>
.app-main {
}
.app-site {
    width: 100%;
    height: auto;
    .site-title {
        width: 100%;
        height: 7rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .app-title {
            color: #fff;
            font-size: 2.3rem;
            margin-left: 70px;
            cursor: pointer;
        }
    }
    .calendar-content {
        width: 100%;
        padding: 4rem 4rem 2rem 4rem;
        border-radius: 3.5rem;
        background: #dfe6e9;
        box-shadow: 0 0.6rem 0 #b7b7b7;
        .activity-top {
            min-height: 50rem;
            .activity-left {
                width: 53rem;
                // height: 59rem;
                float: left;
                .activity-from {
                }
                .activity-from-item {
                    margin-top: 0.5rem;
                }
                .from-label {
                    vertical-align: top;
                    width: 12.6rem;
                    font-size: 1.2rem;
                    display: inline-block;
                }
                .from-content {
                    display: inline-block;
                    // width: 46rem;
                    font-size: 1.1rem;
                    .now-day {
                        width: 30rem;
                        text-align: center;
                        line-height: 2.4rem;
                        font-size: 1.2rem;
                    }
                    .radio-item {
                        margin-bottom: 0.5rem;
                        user-select: none;
                    }
                    .interval {
                        margin-right: 0.2rem;
                    }
                    .title {
                        margin-right: 0.4rem;
                        vertical-align: middle;
                    }
                }
                .from-activity {
                    li {
                        display: inline-block;
                        margin-right: 0.5rem;
                    }
                }
                .from-item1 {
                    span {
                        display: inline-block;
                    }
                }
                .from-date-tiem {
                    .select-date,
                    .select-time {
                        display: inline-block;
                        position: relative;
                        background: #fff;
                        border-radius: 0.5rem;
                        line-height: 2.4rem;
                        text-align: center;
                        font-size: 1.2rem;
                    }
                    .select-date {
                        width: 18.8rem;
                        height: 2.4rem;
                    }
                    .select-time {
                        width: 10.2rem;
                        height: 2.4rem;
                        margin-left: 0.4rem;
                    }
                }
                .from-input {
                    input {
                        width: 29.7rem;
                        height: 2.4rem;
                        border-radius: 0.8rem;
                        padding: 0 1.3rem;
                    }
                }
                .from-input1 {
                    input {
                        width: 35.8rem;
                        height: 2.4rem;
                        border-radius: 0.8rem;
                        padding: 0 1.3rem;
                    }
                }
                .round {
                    display: inline-block;
                    width: 1.4rem;
                    height: 1.4rem;
                    border-radius: 0.5rem;
                    background: #fff;
                    vertical-align: middle;
                    cursor: pointer;
                    margin-right: 0.3rem;
                }
                .select-color {
                    background: #000;
                }
            }
            .activity-right {
                float: left;
                // height: 50rem;
            } 
            .activity-link {
                float: right;
                width: 4rem;
                height: 10rem;
                div {
                    display: inline-block;
                    text-align: center;
                    &:nth-child(2) {
                        margin-top: 2rem;
                    }
                    span {
                        font-size: 1rem;
                        text-align: center;
                        cursor: pointer;
                    }
                    .iconfont {
                        font-size: 2.8rem;
                    }
                    .title {
                        width: 4rem;
                        text-align: center;
                    }
                }
            }
        }
        .activity-foot {
            padding:2rem 0;
            .btn-box {
                margin-left: 40rem;
                .calcel {
                    margin-left: 0.5rem;
                }
            }
        }
    }
}
#app .el-date-editor.el-input.change-date {
    position: absolute;
    top: 0;
    left: 0;
    height: 2.4rem;
    width: 18.8rem;
    opacity: 0;
    .el-input__inner {
        cursor: pointer;
    }
}
#app .el-date-editor.el-input.change-time {
    position: absolute;
    top: 0;
    height: 2.4rem;
    width: 10.2rem;
    left: 0;
    opacity: 0;
    .el-input__inner {
        cursor: pointer;
    }
}
.note {
    height: 10rem;
    margin-bottom: 1.5rem;
    .title {
        font-size: 1.4rem;
        display: inline-block;
        width: 7.6rem;
        text-align: center;
    }
    .note-content {
        height: 10rem;
        width: 34.9rem;
        border-radius: 0.8rem;
        background: #e8e8e8;
        line-height: 7.8rem;
        text-align: center;
        float: right;
        overflow: hidden;
        textarea {
            width: 100%;
            height: 100%;
            padding: 1rem;
            resize: none;
        }
    }   
}
.img-data {
    float: left;
    width: 42.5rem;
    .operation-area {
        height: 7.6rem;
        .headline {
            font-size: 1.4rem;
            display: inline-block;
            width: 7.6rem;
            text-align: center;
        }
        .area {
            height: 7.8rem;
            width: 34.9rem;
            border-radius: 0.8rem;
            background: #e8e8e8;
            line-height: 7.8rem;
            text-align: center;
            float: right;
            cursor: pointer;
            .icon-upload {
                font-size: 2.5rem;
                color: #000;
                vertical-align: middle;
            }
            input {
                display: none;
            }
        }
    }
    .img-progress {
        width: 100%;
        padding-left: 7.6rem;
        margin-top: 0.8rem;
        height: 4.9rem;
        .look-img {
            width: 6.8rem;
            height: 4.9rem;
            border-radius: 0.5rem;
            overflow: hidden;
            float: left;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .look-progress {
            float: left;
            width: 26.6rem;
            margin-left: 1rem;
            font-size: 1.2rem;
            .img-name,
            .proportion {
                width: 100%;
                span:nth-child(1) {
                    display: inline-block;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
                span:nth-child(2) {
                    float: right;
                }
            }
            .file-size {
                font-size: 12px;
                line-height: 1.4rem;
            }
            .icon-guanbi {
                font-size: 12px;
                line-height: 1.4rem;
                cursor: pointer;
            }
            .grogress {
                width: 100%;
                background: #596569;
                border-radius: 0.3rem;
                height: 0.6rem;
                overflow: hidden;
                position: relative;
                .grogress-success {
                    display: inline-block;
                    height: 100%;
                    background: #fdca6c;
                    // width: 50px;
                    position: absolute;
                }
            }
            .proportion {
                font-size: 12px;
                line-height: 1.4rem;
            }
        }
    }
}
</style>

