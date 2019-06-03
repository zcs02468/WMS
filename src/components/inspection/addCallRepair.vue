<template>
    <!-- 新增叫修單 -->
    <div class="call-repair-box">
        <div class="title">叫修基本資料</div>
        <div class="call-repair-data">
            <div class="from-data">
                <div class="from from-time">
                    <span>填表時間</span>
                    <span>{{time}}</span>
                </div>
                <div class="from from-user">
                    <span>報修人姓名</span>
                    <input type="text" value="" placeholder="請輸入姓名" v-model="ContactPerson">
                </div>
                <div class="from from-num">
                    <span>分機號碼</span>
                    <input type="text" value="" placeholder="請輸入分機號碼" v-model="ContactExtension">
                </div>
                <div class="from from-dep">
                    <span>報修部門</span>
                    <input type="text" value="" placeholder="請輸入報修部門" v-model="FromDept">
                </div>
                <div class="from from-location">
                    <span>報修地點</span>
                    <input type="text" value="" placeholder="請輸入報修地點" v-model="Floor">
                </div>
                <div class="from from-project">
                    <span>報修項目</span>
                    <!-- <input type="text" value="" placeholder="請輸入報修項目" v-model="AssCategoryCode">  -->
                    <drop-down-box style="left:-0.4rem;top:0.3rem;"  wSize="12.5" hSize="1.7" title="請選擇" :selectData="selectData" prop="Work"  @selectCallback="selectCallback"></drop-down-box>
                </div>
                <!-- <div class="from from-degree">
                    <span>緊急程度</span>
                    <span class="radio-box">
                        <i :class="{'select-color' : EmergencyLevel >= 1 }" @click="changeEmergencyLevel(1)"></i>
                        <i :class="{'select-color' : EmergencyLevel >= 2 }" @click="changeEmergencyLevel(2)"></i>
                        <i :class="{'select-color' : EmergencyLevel >= 3}" @click="changeEmergencyLevel(3)"></i>
                        <i :class="{'select-color' : EmergencyLevel >= 4}" @click="changeEmergencyLevel(4)"></i>
                        <i :class="{'select-color' : EmergencyLevel == 5}" @click="changeEmergencyLevel(5)"></i>
                    </span>
                </div>
                <div class="from from-complete-time">
                    <span>預計完成日</span>
                    <el-date-picker
                        v-model="finishDate"
                        :editable="false"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </div> -->
                <div class="from from-note">
                    <span class="note">備註</span>
                    <textarea placeholder="請輸入內容" v-model="Remark"></textarea>
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
                            <span class="iconfont icon-guanbi" v-show="item.complete != '100%'" @click="deleteImg(i)"></span>
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
        <div class="call-repair-btns">
            <div class="btn-box">
                <tw-btn title="送出" @click="confirm"></tw-btn>
                <tw-btn class="calcel" title="取消" @click="cancel"></tw-btn>
            </div>
        </div>
    </div>
</template>

<script>
import API from '../../api/index.js'
import TwBtn from '../tw-btn.vue'
import DropDownBox from '../dialog/inspectionDialogContent/child/dropDownBox'

export default {
    name: "AddCallRepair",
    data() {
        return {
            time:null,
            //预计完成日
            finishDate:null, 
            fileData:[],
            selectData:[],
            selectProjectTitle:null,

            InspectionID:null,//叫修单ID
            FromDept:null,//报修部门
            Floor:null,//报修楼层,
            AssCategoryCode:null,//报修项目
            ContactPerson:null,//报修人
            ContactExtension:null,//分机号码
            EmergencyLevel:1,// 紧急程度
            Remark:null,//备注
        };
    },
    created() {
        this.time = this.formatData();
        this.getWork()
        this.ContactExtension = this.userData.Phone;
        this.FromDept = this.userData.Dept;
        this.ContactPerson = this.userData.Name//报修人
        if(this.signedData != null) {
            this.InspectionID = this.signedData.ID//叫修单ID
            // this.ContactPerson = this.signedData.CreatedUser//报修人
            this.Floor = this.signedData.Floor//报修楼层,
            this.Remark = this.signedData.Remark//备注
            
            this.signedData.Images.forEach( item => {
                let img = JSON.parse(JSON.stringify( item ))
                let arr = img.split('/')
                let name = arr[arr.length-1]
                this.fileData.push({
                    name:name,
                    size: 0,
                    complete:'100%',
                    errorIsShow:false,
                    content:item
                })
            })


        }
    },

    mounted() {
        var dropbox = document.querySelector('.area');
        dropbox.addEventListener('dragenter', this.onDrag, false);
        dropbox.addEventListener('dragover', this.onDrag, false);
        dropbox.addEventListener('drop', this.onDrop, false);
    },

    components: {
        TwBtn,
        DropDownBox
    },

    methods: {
        //緊急程度
        changeEmergencyLevel(_index) {
            this.EmergencyLevel = _index;
        },
        //所有工作项目
        selectCallback(_item) {
            this.AssCategoryCode = _item.CategoryCode
        },
        //取消
        cancel() {
            this.initData()
        },
        //确认送出
        confirm() {
            let data = {
                "InspectionID": this.InspectionID,
                "FromDept": this.FromDept,  //报修部门
                "Floor": this.Floor,//报修楼层
                "AssCategoryCode":this.AssCategoryCode,//报修项目
                "ContactPerson": this.ContactPerson, //报修人
                "ContactExtension": this.ContactExtension, //分机号码
                // "EmergencyLevel": this.EmergencyLevel,    //紧急程度
                "Remark": this.Remark,  //备注
            }
            if( this.InspectionID == null) {
                this.addCallRepair(data)
            }else {
                this.editCallRepair(data)
            }
        },
        //新增叫修单
        addCallRepair(_data) {
            this.$axios.post(API.editCallRepair,_data).then( res => {
                this.InspectionID = res.data.ID;
                this.openInfo('送出成功!請繼續上傳附件信息')
            })
        }, 
        //修改叫修单
        editCallRepair(_data) {
            this.$axios.post(API.editCallRepair,_data).then( res => {
                this.openInfo('修改成功')
            })
        },
        //取得派工项目
        getWork() {
            this.$axios.get(API.getAllCategory).then( res => {
                this.selectData = res.data;
            })
        },
        deleteImg(i) {
            this.fileData.splice(i,1);
        },
        upLoadImg() {
            this.$refs.upLoadImg.click()
        },
        inputChange(e) {
            let files = e.target.files;
            console.log( e,'@@@@@@@@@@')
            for (let i = 0; i < files.length; i++) {
                let typeArr = files[i].type.split('/')
                if( typeArr[0] == 'image' && this.screenImg( typeArr[1] ) ) {
                    this.previewImg(files[i])
                }else {
                    this.openInfo('僅支援jpg, jpeg, png, gif圖片檔案')
                }
            }
        },
        onDrag: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        onDrop: function (e) {
            if( this.InspectionID == null ) {
                this.$alert('請先填寫左側的資料送出後再進行上傳附件', '提示', {
                confirmButtonText: '確認',
                callback: action => {
                    this.fileData = []
                }
                });
            }
            e.stopPropagation();
            e.preventDefault();
            let dt = e.dataTransfer;
            for (var i = 0; i !== dt.files.length; i++) {
                let typeArr = dt.files[i].type.split('/')
                if( typeArr[0] == 'image' && this.screenImg( typeArr[1] ) ) {
                    this.previewImg(dt.files[i])
                }else {
                    this.openInfo('僅支援jpg, jpeg, png, gif圖片檔案')
                }
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
                    // this.progress = complete
                    this.fileData[_index].complete = complete;
                }
            }
            this.$axios.post(API.editCallRepair+'/'+this.InspectionID,_data,config).then( res => {
                
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
        initData() {
            let data = JSON.parse(JSON.stringify( this.selectData ))
            this.selectData.splice(0,this.selectData.length)
            setTimeout(()=> {
                this.selectData = data;
            },500)
            this.fileData=[]
            this.selectProjectTitle = null

            this.InspectionID = null//叫修单ID
            this.FromDept = null//报修部门
            this.Floor = null//报修楼层,
            this.AssCategoryCode = null//报修项目
            this.ContactPerson = null//报修人
            this.ContactExtension = null//分机号码
            this.EmergencyLevel = 1// 紧急程度
            this.Remark = null//备注
        },
        openInfo(title) {
            this.$alert(title, '提示', {
                confirmButtonText: '確認',
                callback: action => {}
            });
        },
        //时间转换
        formatData() {
            const date = new Date();
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes();
            // s = date.getSeconds(),
            // w = date.getDay();//注:0-6对应为星期日到星期六
            Y = Y - 1911;
            let amAndPm = "上午";
            if (H > 12) {
                amAndPm = "下午";
                H = H - 12;
            }
            const t = `${Y}年${m}月${d}日  ${amAndPm}${H}:${i}`;
            return t;
        }
    },

    computed: {
        signedData() {
            return this.$store.state.signedData;
        },
        userData() {
            return this.$store.state.userData;
        }
    },

    watch:{
        finishDate(val) {
        }
    }
};
</script>

<style lang="less" scoped>
.call-repair-box {
    padding: 2rem 8.8rem 4rem 8.8rem;
    .title {
        font-size: 1.8rem;
    }
    .call-repair-data {
        min-width: 76rem;
        min-height: 43rem;
        margin-top: 0.5rem;
        .from-data {
            float: left;
            width: 32rem;
            height: 37rem;
            .from {
                width: 100%;
                font-size: 1.2rem;
                position: relative;
                span {
                    display: inline-block;
                }
                span:nth-child(1) {
                    width: 9rem;
                    font-size: 1.4rem;
                    line-height: 2.5rem;
                }
                input {
                    width: 12.5rem;
                    height: 1.7rem;
                    background: #e8e8e8;
                    border-radius: 0.8rem;
                    padding-left: 0.8rem;
                    position: absolute;
                    top: 0.4rem;
                }
                .note {
                    vertical-align: top;
                }
                textarea {
                    width: 19.2rem;
                    height: 15.8rem;
                    border-radius: 0.8rem;
                    background: #e8e8e8;
                    padding: 0.8rem;
                    resize: none;
                    position: absolute;
                    top: 0.4rem;
                }
            }
            .from-degree {
                .radio-box {
                    cursor: pointer;
                    i {
                        display: inline-block;
                        width: 1.2rem;
                        height: 1.2rem;
                        border-radius: 50%;
                        background: #e8e8e8;
                        cursor: pointer;
                    }
                    .select-color {
                        background: #000;
                    }
                }
            }
            .from-note {
                margin-top: 0.5rem;
            }
        }
        .img-data{
            float: left;
            width: 43.5rem;
            height: 30rem;
            .operation-area {
                height: 7.8rem;
                .headline {
                    font-size: 1.4rem;
                    display: inline-block;
                    width: 8.6rem;
                    text-align: center;
                }
                .area {
                    height: 7.8rem;
                    width: 34.6rem;
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
                padding-left: 8.6rem;
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
                    .img-name,.proportion{
                        width: 100%;
                        span:nth-child(1) {
                            width: 25rem;
                            display: inline-block;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        span:nth-child(2) {
                            float: right;
                        }
                    }
                    .file-size{
                        font-size: 12px;
                        line-height: 1.4rem;
                    }
                    .icon-guanbi {
                        font-size: 12px;
                        line-height: 1.4rem;
                        cursor: pointer;
                    }
                    .grogress{
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
                    .proportion{
                        font-size: 12px;
                        line-height: 1.4rem;
                    }
                }
            }
        }
    }
    .call-repair-btns {
        margin-top: 4rem;
        .btn-box {
            margin-left: 28rem;
            .calcel {
                margin-left: 1.6rem;
            }
        }
    }
}
</style>

