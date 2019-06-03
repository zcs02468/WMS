<!-- dialogTab -->
<template>
    <div class="dialog-table editor-delay">
        <div class="table-head-box">
            <table cellspacing="0" cellpadding="0" border="0" class="table-header">
                <thead>
                    <tr>
                        <th v-for="(item,i) in headData" :key="i" >{{ item}}</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body-box">
            <table cellspacing="0" cellpadding="0" border="0" class="table-header">
                <tbody>
                    <tr v-for="(item,i) in bodyData" :key="i">
                        <td class="dialog-table-column-0">{{item.OrderCode}}</td>
                        <td class="dialog-table-column-1"> {{item.ContactPerson}}</td>
                        <td class="dialog-table-column-2">{{item.EndTime | dateToDate}}</td>
                        <td class="dialog-table-column-3">
                            <input type="text" v-model="item.note">
                        </td>
                        <td class="dialog-table-column-4">
                            <el-date-picker v-model="item.delayTime" :editable="false"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd" type="date" placeholder="請選擇日期" class="change-date"></el-date-picker>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-box">
            <div class="btns">
                <tw-btn title="確認" @click="confirm"></tw-btn>
                <tw-btn title="取消" @click="calcel"></tw-btn>
            </div>
        </div>
    </div>
</template>

<script>
import API from '../../../../api/index.js'
import TwBtn from '../../../tw-btn'

export default {
    name: "editorDelay",
    data() {
        return {
            headData:[
                '叫修編號',
                '報修人',
                '原預計完成日',
                '備註',
                '修改日期'
            ],
            bodyData:[],
            isClick:true,
        };
    },

    created() {
        let data = JSON.parse( JSON.stringify(this.$store.state.storageSelectData));
        data.forEach( item => {
            item.delayTime = '',
            item.note = ''
        })
        this.bodyData = data;
    },

    components: {
        TwBtn
    },

    methods: {
        confirm() {
            if( !this.isClick ) return;
            this.isClick = false;
            let data = this.getData()
            if( !data.isOk ) {
                this.$alert('請至少選擇一個延後完成日進行提交', {
                    confirmButtonText: '確定',
                    callback: action => {
                        // this.ajaxData( data.data )
                    }
                });
                this.isClick = true;
            }else {
                this.ajaxData( data.data )
            }
        },
        throttle() {
            this.isClick = false;
            this.throttleTime = setTimeout( () => {
                this.isClick = true;
            },2000)
        },
        getData() {
            let arr = [],isOk = true;
            this.bodyData.forEach( item => {
                item.delayTime == '' && (isOk = false);
                console.log( item.delayTime)
                let arr1 = item.delayTime.split('-');
                let time = new Date(arr1[0],arr1[1],arr1[2],12,0,0)
                arr.push({
                    ID: item.ID,
                    EndTime:time,
                    Remark:item.note,
                    DeptType:this.$store.state.userData.DeptType
                })
            })
            return {
                data:arr,
                isOk:isOk
            };
        },
        ajaxData(_data) {
            this.$axios.post( API.getDelaySignedData,_data ).then( res => {
                console.log( 'aaaaaaaa')
                this.$alert('修改延後完成日成功', '提示', {
                    confirmButtonText: '確定',
                    callback: action => {
                        this.calcel();
                    }
                });
                this.$store.state.upDateSign = true;
            })
            .catch( err => {
                this.isClick = true;
                this.$alert('修改延後完成日失敗', '提示', {
                    confirmButtonText: '確定',
                });
            })
        },
        calcel() {
            this.$store.commit('SET_IS_SHOW_DIALOG',false);
        }
    },

    computed: {},

    filters: {
        dateToDate(date){
            if(!date) return ;
            const _date = date.split('T')[0]
            const __date = _date.split('-')
            __date[0] =  __date[0] - 1911
            return __date.join('/')
        }
    },
};
</script>
<style lang="less" scoped>
.dialog-table {
    margin-top: 2rem;
    tr {
        border-bottom: 2px solid #ebebeb;
    }
    th,td {
        height: 3rem;
        line-height: 3rem;
        font-size: 1.1rem;
        text-align: left;
        &:nth-child(1){
            width: 10rem;
        }
        &:nth-child(2){
            width: 10rem;
        }
        &:nth-child(3){
            width: 10rem;
        }
        &:nth-child(4){
            width: 20rem;
        }
        &:nth-child(5){
            width: 10rem;
            text-align: center;
        }
    }
    input {
        font-weight: 100;
        height: 100%;
        width: 100%;
        border-radius: 5px;
        padding: 0 1rem;
        text-overflow: ellipsis; /*以省略号...显示*/
        &:focus {
            border: 1px solid #ccc;
        }
    }

}
.btn-box {
    margin-top: 4rem;
    text-align: center;
    .btns {
        display: inline-block;
    }
}
</style>
