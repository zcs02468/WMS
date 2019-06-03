<!--  -->
<template>
    <div id="app-survey">
        <!-- 头部 -->
        <div class="survey-head">
            <div class="survey-head-title">滿意度調查表</div>
            <div></div>
        </div>
        <div class="survey-content-box">
            <div class="survey-content">
                <div class="content-top">
                    <div class="show-data-left">
                        <ul>
                            <li>
                                <span class="name">来源</span>
                                <span class="content">{{signedData.Source}}</span>
                            </li>
                            <li>
                                <span class="name">報修人姓名</span>
                                <span class="content">{{signedData.Survey.ContactPerson}}</span>
                            </li>
                            <li>
                                <span class="name">分機號碼</span>
                                <span class="content">{{signedData.Survey.ContactExtension}}</span>
                            </li>
                            <li>
                                <span class="name">報修部門</span>
                                <span class="content">{{signedData.Survey.ContactDept}}</span>
                            </li>
                            <li>
                                <span class="name">報修樓層</span>
                                <span class="content">{{signedData.Survey.Floor}}</span>
                            </li>
                            <li>
                                <span class="name">報修項目</span>
                                <span class="content">{{signedData.Work}}</span>
                            </li>
                            <li>
                                <span class="name">緊急程度</span>
                                <span class="content">
                                    <i class="round default-color" :class="{'select-color': signedData.EmergencyLevel >= 1}"></i>
                                    <i class="round default-color" :class="{'select-color': signedData.EmergencyLevel >= 2}"></i>
                                    <i class="round default-color" :class="{'select-color': signedData.EmergencyLevel >= 3}"></i>
                                    <i class="round default-color" :class="{'select-color': signedData.EmergencyLevel >= 4}"></i>
                                    <i class="round default-color" :class="{'select-color': signedData.EmergencyLevel >= 5}"></i>
                                </span>
                            </li>
                            <li>
                                <span class="name">預計完成日</span>
                                <span class="content">{{signedData.EndDate | filterDate}}</span>
                            </li>
                            <li>
                                <span class="name">完成日期</span>
                                <span class="content">{{signedData.CompleteDate | filterDate2}}</span>
                            </li>
                            <li>
                                <span class="name">維護部門</span>
                                <span class="content">{{signedData.DeptType}}</span>
                            </li>
                            <li>
                                <span class="name">維護員</span>
                                <span class="content">{{signedData.Person}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="show-data-right">
                        <div class="img-box">
                            <span class="title">附件</span>
                            <ul>
                                <li v-for="(item,i) in signedData.Images" :key="i"><img :src="'http://35.236.173.202/' + item" alt=""></li>
                                <!-- <li><img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=699762743,2778618696&fm=26&gp=0.jpg" alt=""></li> -->
                            </ul>
                        </div>
                        <div class="note">
                            <span class="title">備註</span>
                            <div>{{signedData.Remark}}</div>
                        </div>
                    </div>
                </div>
                <div class="content-bottom">
                    <div class="title">評分維護人員</div>
                    <div class="score">
                        <div class="score-box">
                            <span class="iconfont icon-silence" :class="{'select-color':Score>=1}" @click="Score = 1"></span>
                            <span class="iconfont icon-silence" :class="{'select-color':Score>=2}" @click="Score = 2"></span>
                            <span class="iconfont icon-silence" :class="{'select-color':Score>=3}" @click="Score = 3"></span>
                            <span class="iconfont icon-silence" :class="{'select-color':Score>=4}" @click="Score = 4"></span>
                            <span class="iconfont icon-silence" :class="{'select-color':Score>=5}" @click="Score = 5"></span>
                        </div>
                    </div>
                    <div class="writing-box">
                        <div class="signature">
                            <div class="signature-title">簽名欄</div>
                            <Painting v-model="isClearCanvas" @updateImgUrl="updateImgUrl"></Painting>
                        </div>
                        <div class="note">
                            <div class="note-title">備註</div>
                            <textarea v-model="Remark"></textarea>
                        </div>
                    </div>
                    <div class="btns">
                        <tw-btn class="btn" title="確認" @click="confirm"></tw-btn>
                        <tw-btn class="btn calcel" title="取消" @click="calcel"></tw-btn>
                        <tw-btn class="btn calcel" title="重簽" @click="calcelSignature"></tw-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TwBtn from "../components/tw-btn";
import Painting from "../components/units/painting";
import API from '../api/index.js'
export default {
    name: "survey",
    data() {
        return {
            ID : null,
            imgUrl:null,
            Score:0,//評價等級
            Remark:null,//备注
            isClick:false,//防止多次點擊
            isClearCanvas:false,
            isOk:false
        };
    },

    components: {
        TwBtn,
        Painting
    },

    created() {
        if( this.signedData == null) {
           this.routeUrl()
        }else {
            this.ID = this.signedData.ID;
        }
    },

    methods: {
        updateImgUrl(_imgUrl) {
            this.imgUrl = _imgUrl;
        },
        confirm() { 
            this.isClick = false;
            if( this.imgUrl == null || this.imgUrl == '' ) {
                this.isClick = true;
                this.openInfoDialog('請填寫簽名');
            }else {
                if(this.Score == 0) {
                    this.isClick = true;
                    this.openInfoDialog('請給維護人員進行評分');
                }else {
                    this.uploadContent();
                }
            }
        },
        calcel() {
           this.routeUrl()
        },
        routeUrl() {
            if( this.$store.state.query.qrcode == null ) {
                this.$router.push({path:'/inspection',query:{
                    System : this.$store.state.query.System,
                    Ticket : this.$store.state.query.Ticket,
                }})
            }else {
                this.$router.push({path:'/inspection',query:{
                    qrcode:this.$store.state.query.qrcode
                }})
            }
        },
        calcelSignature() {
            this.isClearCanvas = true;
        },
        //上传用户填写的数据
        uploadContent() {
            let data = {
                    "ID": this.ID,
                    "Score": this.Score,
                    "Remark": this.Remark,
                    "DeptType": this.signedData.Dept,
                }
            this.$axios.post(API.surverSigned,data).then( res => {
                this.isClick = true;
                this.uploadImg()
            }).catch( err => {
                this.openInfoDialog('評分與備註信息提交失敗')
            })
        },
        uploadImg() {
            let data = this.parsingBase64( this.imgUrl );
            let config = {
                async: true,
                contentType: false,
                processData: false,
            }
            this.$axios.post(`${API.surverSigned}/${this.$store.state.userData.DeptType}/${this.ID}`,data,config).then( res => {
                this.isClick = true;
                this.$alert('提交成功', '提示', {
                    confirmButtonText: '確定',
                    callback: action => {
                        this.routeUrl()
                    }
                });
            }).catch( err => {
                this.openInfoDialog('簽名提交失敗')
            })
        },
        parsingBase64(data) {
            // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
            data=data.split(',')[1];
            data=window.atob(data);
            let ia = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
            };
            
            // canvas.toDataURL 返回的默认格式就是 image/png
            let blob=new Blob([ia], {type:"image/png"});
            let fd=new FormData();
            fd.append('file',blob);
            return fd;
        },
        openInfoDialog(_content,_title = '提示') {
            this.isClick = true;
            this.$alert(_content, _title, {
                confirmButtonText: '確定',
            });
        },
        judgeDate(value,type) {
            const date = new Date(value);
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes();
            let amAndPm = "上午";
            if (H > 12) {
                amAndPm = "下午";
                H = H - 12;
            }
            let t = '';
            if( type ) {
                t = `${Y}年${m}月${d}日${amAndPm}${H}:${i}`;
            }else {
                t = `${Y}年${m}月${d}日`;
            }
            return t;
        }
    },

    mounted() {
    },

    
    filters: {
        filterDate(value){
            const date = new Date(value);
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes();
            let amAndPm = "上午";
            if (H > 12) {
                amAndPm = "下午";
                H = H - 12;
            }
            let t = '';
            t = `${Y}年${m}月${d}日`;
            return t;
        },
        filterDate2(value) {
            let t = '';
            const date = new Date(value);
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes();
            let amAndPm = "上午";
            if (H > 12) {
                amAndPm = "下午";
                H = H - 12;
            }
            if( value != null ) {
                t = `${Y}年${m}月${d}日${amAndPm}${H}:${i}`;
            }
           return t;
        }
    },

    computed: {
        fontSize() {
            return this.$store.state.fontSize;
        },
        signedData() {
            return this.$store.state.signedData;
        }
    },
    watch:{
        imgUrl(val) {
            console.log( val,this.isClearCanvas,'9999999999999')
        }
    }
};
</script>
<style lang="less" scoped>
#app-survey {
  width: 100%;
  height: auto;
  user-select: none;
  .survey-head {
    width: 100%;
    height: 7rem;
    height: 7rem;
    line-height: 7rem;
    font-size: 1.7rem;
    padding-left: 5rem;
    display: flex;
    justify-content: space-between;
    .survey-head-title {
      color: #ffee7b;
      font-size: 2.3rem;
    }
  }
  .survey-content-box {
    width: 100%;
    height: auto;
    padding: 0 4rem;
    border-radius: 3.5rem;
    background: #dfe6e9;
    box-shadow: 0 0.6rem 0 #b7b7b7;
    .survey-content {
      width: 100%;
      padding-top: 4.5rem;
      height: 63rem;
      .content-top {
        // height: 18.5rem;
        height: 22.5rem;
        font-size: 1.2rem;
        .show-data-left {
          float: left;
          width: 24rem;
          height: 100%;
          ul {
            li {
              padding: 2px 0;
              span {
                display: inline-block;
              }
              .name {
                padding-left: 1.5rem;
                width: 9rem;
              }
              .content {
                width: 14.5rem;
                padding-left: 2.5rem;
                .round {
                  width: 1.6rem;
                  height: 1.6rem;
                  display: inline-block;
                  border-radius: 50%;
                  vertical-align: bottom;
                }
                .default-color {
                  background: #e8e8e8;
                }
                .select-color {
                  background: #000;
                }
              }
            }
            .delay-day {
              color: red;
              position: relative;
            }
          }
        }
        .show-data-right {
          float: left;
          width: 49.5rem;
          height: 100%;
          .img-box {
            height: 4.2rem;
            float: left;
            width: 100%;
            .title {
              height: 6.1rem;
              text-align: center;
              width: 6.5rem;
              float: left;
            }
            ul {
              float: left;
              li {
                display: inline-block;
                padding-right: 0.7rem;
                img {
                  width: 6.1rem;
                  height: 4.2rem;
                  border-radius: 0.8rem;
                }
              }
            }
          }
          .note {
            margin-top: 1rem;
            display: flex;
            float: left;
            .title {
              float: left;
              height: 6.1rem;
              text-align: center;
              width: 6.5rem;
            }
            div {
              float: left;
              width: 42rem;
            }
          }
        }
      }
    }
  }
}

.content-bottom {
  width: 72rem;
  height: 34rem;
  background: #fff;
  border-radius: 3.5rem;
  padding: 2rem 6rem 0 6rem;
  .title {
    height: 3.6rem;
    text-align: center;
    font-size: 1.6rem;
    line-height: 3.6rem;
  }
  .score {
    height: 2.5rem;
    text-align: center;
    .score-box {
        display: inline-block;
        cursor: pointer;
        user-select: none;
    }
    span {
        font-size: 3rem;
        border-radius: 50%;
    }
    .select-color {
        background: #EDC951;
    }
  }
  .writing-box {
    margin-top: 2.5rem;
    height: 13.8rem;
    .signature {
      width: 27.1rem;
      height: 14.8rem;
      border-radius: 1rem;
      background: #f4f4f4;
      float: left;
      overflow: hidden;
      // padding: 1rem;
      .signature-title {
        height: 2.6rem;
        font-size: 1.2rem;
        line-height: 3.6rem;
        text-align: center;
      }
    }
    .note {
      width: 27.1rem;
      height: 14.8rem;
      border-radius: 1rem;
      background: #f4f4f4;
      float: right;
      padding: 0 1rem;
      .note-title {
        height: 2.6rem;
        font-size: 1.2rem;
        line-height: 3.6rem;
        text-align: center;
      }
      textarea {
        width: 100%;
        height: 11.2rem;
        resize: none;
        padding-top: 1rem;
        background: #f4f4f4;
      }
    }
  }
  .btns {
    text-align: center;
    margin-top: 3.5rem;
    .btn {
        margin: 0 0.7rem;
    }
  }
}
</style>