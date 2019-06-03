<!--  -->
<template>
    <div class="dialog-content">
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
                            <i class="round default-color" :class="{'select-color' : signedData.EmergencyLevel >= 1}"></i>
                            <i class="round default-color" :class="{'select-color' : signedData.EmergencyLevel >= 2}"></i>
                            <i class="round default-color" :class="{'select-color' : signedData.EmergencyLevel >= 3}"></i>
                            <i class="round default-color" :class="{'select-color' : signedData.EmergencyLevel >= 4}"></i>
                            <i class="round default-color" :class="{'select-color' : signedData.EmergencyLevel >= 5}"></i>
                        </span>
                    </li>
                    <li>
                        <span class="name">預計完成日</span>
                        <span class="content">{{signedData.EndDate | filterDate}}</span>
                    </li>
                </ul>
            </div>
            <div class="show-data-right">
                <div class="img-box">
                    <span class="title">附件</span>
                    <ul>
                        <li v-for="(item,i) in signedData.Images" :key="i"><img :src="item" alt=""></li>
                    </ul>
                </div>
                <div class="note">
                    <span class="title">備註</span>
                    <div>{{signedData.Remark}}</div>
                </div>
            </div>
        </div>
        <div class="content-bottom">
            <div class="show-singnd-one">
                <div class="singed-dialog-bottom">
                    <div class="singed-left">
                        <div class="title">簽核人順序</div>
                        <div class="content">
                            <ul>
                                <li>
                                    <div class="btns">
                                        <button class="btn-success" v-if="signedData.StatusValue == 'T'" >{{signedData.Status}}</button>
                                        <button class="btn-danger" v-else-if="signedData.StatusValue == 'P'">{{signedData.Status}}</button>
                                        <button class="btn-untreated" v-else type="untreated">{{signedData.Status}}</button>
                                        <span class="type-index">1.</span>
                                    </div>
                                    <div class="signed-name">
                                        <span>{{signedData.Person}}&nbsp;</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="singed-right">
                        <div class="radio-text-box">
                            <div class="title-box">
                                <span class="select" :class="[selectNum == 1 ? 'select-color' :  '' ]" @click="selectNum = 1"></span>
                                <span class="type" @click="selectNum = 1">核准</span>
                            </div>
                            <div class="txt-input">
                                <textarea name="" placeholder="備註" id="" cols="30" rows="10" v-model="throughData"></textarea>
                            </div>
                        </div>
                        <div class="radio-text-box" style="margin-top:27px;">
                            <div class="title-box">
                                <span class="select" :class="[selectNum == 2 ? 'select-color' :  '' ]" @click="selectNum = 2"></span>
                                <span class="type"  @click="selectNum = 2">不核准</span>
                            </div>
                            <div class="txt-input">
                                <textarea name="" placeholder="備註" id="" cols="30" rows="10" v-model="notThroughData"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-btns">
            <div class="btn-box">
                <tw-btn class="confirm" title="確認" @click="confirm"></tw-btn>
                <tw-btn title="取消" @click="close"></tw-btn>
            </div>
        </div>
    </div>
</template>

<script>
import API from '../../../../api/index.js';
import TwBtn from '../../../tw-btn';

export default {
    name: "tasktingSigned",
    data() {
        return {
            notThroughData:null,
            throughData:null,
            selectNum:null,
            isClick:true
        };
    },

    components: {
        TwBtn
    }, 
    created() {},

    methods: {
        //确认事件
        confirm() {
            if( !this.isClick ) return;
            if( this.selectNum == null ) {
                this.openInfoDialog(false,'請選中簽核狀態')
            }else {
                this.takingSigned()
            }
        },
        takingSigned() {
            this.isClick = false;
            let data = {
                "ID": this.signedData.ID,
                "DeptType": this.$store.state.userData.DeptType,
                "Result": null,
                "Feedback": null
            }
            if( this.selectNum == 1 ) {
                data.Result = true;
                data.Feedback = this.throughData;
            }
            if( this.selectNum == 2 ) {
                data.Result = false;
                data.Feedback = this.notThroughData;
            }
            
            this.$axios.post(API.takingSigned,data).then( res => {
                this.openInfoDialog(true,'簽核成功')
                this.$store.state.upDateSign = true;
                this.isClick = true;
                
            }).catch( err => {
                this.openInfoDialog(false,'簽核失敗')
                this.isClick = true;
            })
        },
        openInfoDialog(_status,_content,_title = '提示') {
            this.$alert(_content, _title, {
            confirmButtonText: '確定',
            callback: action => {
               if(_status) {
                   this.close();
               }
            }
            });
        },
        close() {
            this.$store.commit('SET_IS_SHOW_DIALOG',false);
        },
        throttle() {
            this.isClick = false;
            this.throttleTime = setTimeout( () => {
                this.isClick = true;
            },2000)
        },
    },

    computed: {
        dialogType() {
            return this.$store.state.dialogType;
        },
        signedData() {
            return this.$store.state.signedData;
        }
    },
    filters: {
        filterDate(value){
            const date = new Date(value);
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes();
            // s = date.getSeconds(),
            // w = date.getDay();//注:0-6对应为星期日到星期六
            // Y = Y - 1911;
            let amAndPm = "上午";
            if (H > 12) {
                amAndPm = "下午";
                H = H - 12;
            }
            const t = `${Y}年${m}月${d}日`;
            return t;
        }
    },
};
</script>
<style lang="less" scoped>
.dialog-content {
    font-size: 1.2rem;
  .content-top {
    // height: 18.5rem;
    height: 20.5rem;
    margin-top: 2.5rem;
    border-bottom: 1px solid #000;
    .show-data-left {
      float: left;
      width: 24rem;
      height: 100%;
      ul {
        li {
        //   padding: 4px 0;
          span {
            display: inline-block;
          }
          .name {
            padding-left: 1.5rem;
            width: 9rem;
            overflow: hidden;
          }
          .content {
            width: 14.5rem;
            padding-left: 2.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
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
      float: right;
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


.singed-dialog-bottom {
    margin-top: 2rem;
    height: 21rem;
    width: 100%;
    .singed-left {
        float: left;
        height: 100%;
        width: 32.5rem;
        .title {
            width: 8.2rem;
            line-height: 2.6rem;
            float: left;
            font-size: 1.2rem;
        }
        .content {
            float: left;
            width: 24rem;
            li {
                width: 24rem;
                font-size: 1.7rem;
                margin-bottom: 0.3rem;
                .btns {
                    display: inline-block;
                    button {
                        width: 7rem;
                        height: 2.2rem;
                        border-radius: 0.5rem;
                        font-size: 1.2rem;
                        color: #fff;
                    }
                    span {
                        font-size: 1.2rem;
                        margin-left: 0.8rem;
                        line-height: 2.2rem;
                    }
                }
                .signed-name {
                    width: 13.2rem;
                    display: inline-block;
                    span {
                        font-size: 1.2rem;
                        line-height: 2.2rem;
                    }
                }
            }
        }
    }
    .singed-right {
        float: right;
        width: 33rem;
        height: 21rem;
        .radio-text-box {
            width: 100%;
            height: 9rem;
            .title-box {
                width: 6.6rem;
                height: 100%;
                float: left;
                font-size: 1.2rem;
                padding-top: 0.5rem;
                span {
                    display: inline-block;
                }
                .select {
                    width: 1.3rem;
                    height: 1.3rem;
                    border-radius: 0.5rem;
                    background: #e8e8e8;
                    vertical-align: middle;
                    cursor: pointer;
                }
                .type {
                    width: 4.6rem;
                    cursor: pointer;
                }
                .select-color {
                    background: #2d3436;
                }
            }
            .txt-input {
                float: left;
                width: 25.7rem;
                height: 9.2rem;
                textarea {
                    width: 100%;
                    height: 100%;
                    background: #e8e8e8;
                    resize: none;
                    border-radius: 0.8rem;
                    padding: 0.8rem;
                    font-size: 1.2rem;
                }
            }
        }
    }
    .singed2-right {
        float: right;
        width: 35rem;
        height: 21rem;
        .select-box {
            .group {
                font-size: 1.2rem;
                margin-right: 0.7rem;
            }
            .group-select {
                margin-right: 1.4rem;
                height: 2.2rem;
                vertical-align: middle;
            }
            .project {
                font-size: 1.2rem;
            }
            .project-select {
                margin-right: 0.6rem;
                width: 12.6rem;
                height: 2.2rem;
                border-radius: 0.8rem;
                background: #e8e8e8;
                display: inline-block;
                vertical-align: middle;
                position: relative;
                cursor: pointer;
                .project-text {
                    display: inline-block;
                    width: 100%;
                    padding: 0 2rem 0 0.8rem;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    line-height: 2.2rem;    
                    overflow: hidden;
                    height: 2.2rem;
                }
                .icon-bArrow {
                    position: absolute;
                    right: 0.5rem;
                    font-size: 1.2rem;
                    line-height: 2.2rem;
                    font-size: 1.2rem;
                }
                .text {
                    display: inline-block;
                    width: 12.6rem;
                    position: absolute;
                    top: 2.7rem;
                    background: #e8e8e8;
                    word-wrap:break-word;
                    box-shadow: 0 0 5px rgba(0,0,0,.3);
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                    font-size: 1.2rem;
                }
            }
        }
        .note {
            width: 28.7rem;
            height: 14.7rem;
            background: #e8e8e8;
            border-radius: 0.8rem;
            resize: none;
            padding: 8px;
            font-size: 1.2rem;
            margin-left: 5.8rem;
            margin-top: 1.8rem;
        }
    }
}
.content-btns {
    text-align: center;
    padding-top: 3.5rem;
    .btn-box {
        display: inline-block;
        .confirm {
            margin-right:1.5rem;
        }
    }
}

//按钮颜色
.btn-warning {
    background:  #FDCB6E;
}
.btn-danger {
    background: #E17055;
}
.btn-success {
    background: #00B894;
}
.btn-aprimary {
    background: #2FBEEA;
}
.btn-untreated {
    background: #e8e8e8;
}

</style>
