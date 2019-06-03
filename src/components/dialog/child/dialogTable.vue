<!-- dialogTab -->
<template>
    <div class="dialog-table">
        <div class="table-head-box">
            <table cellspacing="0" cellpadding="0" border="0" class="table-header" style="width: 1140px;">
                <colgroup>
                    <col v-for="(item,i) in widthData" :key="i" :name=" 'dialog-table-column-'+ i " :width="item.width">
                </colgroup>
                <thead>
                    <tr>
                        <th v-for="(item,i) in headData" :key="i" :class="[ 'dialog-table-column-' + i , item.isCenter ? 'isCenter' : '' ]">{{ item.title}}</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body-box">
            <table cellspacing="0" cellpadding="0" border="0" class="table-header" style="width: 1140px;">
                <colgroup>
                    <col v-for="(item,i) in widthData" :key="i" :name=" 'dialog-table-column-'+ i" :width="item.width">
                </colgroup>
                <tbody>
                    <tr v-for="(item,i) in bodyData" :key="i">
                        <!-- <td class="dialog-table-column-0"  rowspan="1" colspan="1" width="140">{{item.Code}}</td> -->
                        <td class="dialog-table-column-0"  rowspan="1" colspan="1" width="140">
                            <input type="text" disabled class="isDisabled" v-model="item.Code">
                        </td>
                        <td class="dialog-table-column-1"  rowspan="1" colspan="1" width="214">
                            <input type="text" disabled class="isDisabled" v-model="item.Name">
                        </td>
                        <td class="dialog-table-column-2"  rowspan="1" colspan="1" width="100">
                            <input type="text" disabled class="isDisabled" v-model="item.Quantity">
                        </td>
                        <td class="dialog-table-column-3"  rowspan="1" colspan="1" width="114">
                            <input type="text" :disabled="type != 'change'" :class="[ type != 'change' ? 'isDisabled' : '' ]" v-model="item.Limit">
                        </td>
                        <td class="dialog-table-column-4"  rowspan="1" colspan="1" width="66">
                            <input type="text" :disabled="type != 'change'" :class="[ type != 'change' ? 'isDisabled' : '' ]" v-model="item.Spec">
                        </td>
                        <td class="dialog-table-column-5"  rowspan="1" colspan="1" width="128">
                            <input type="text" :disabled="type != 'change'" :class="[ type != 'change' ? 'isDisabled' : '' ]" v-model="item.Location">
                        </td>
                        <td class="dialog-table-column-6"  rowspan="1" colspan="1" width="232">
                            <input type="text" :disabled="type != 'change'" :class="[ type != 'change' ? 'isDisabled' : '' ]" v-model="item.Remark">
                        </td>
                        <td class="dialog-table-column-7"  rowspan="1" colspan="1" width="146" v-if="type != 'change'"> 
                            <input-number v-if="type != 'replenishment'" v-model="item.stockoutnNum" :max="item.Quantity" :min="0" :index="i"></input-number>
                            <input-number v-else v-model="item.stockoutnNum" :max="99999" :min="0" :index="i"></input-number>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import inputNumber from '../../inputNumber'

export default {
    name: "dialogTable",
    props:{
        widthData:{
            type:Array,
            default:[]
        },
        headData:{
            type: Array,
            default:[]
        },
        type:{
            type:String,
            default:''
        }
        // bodyData:{
        //     type:Array,
        //     default:[]
        // }
    },
    data() {
        return {};
    },

    components: {
        "inputNumber" : inputNumber
    },

    methods: {},

    computed: {
        bodyData() {
            this.$store.commit('updateStorageSelectData');
            return this.$store.state.storageSelectData;
        },
    }
};
</script>
<style lang="less" scoped>
.dialog-table {
    th,td {
        height: 35px;
        border-bottom: 2px solid #ebebeb;
        text-align: left;
        font-weight: 100;
        padding: 0px 5px 0px 0;
        line-height: 35px;
        font-size: 14px;
    }
    th {
        font-size: 17px;
    }
    td {
        font-size: 14px;
    }
    td {
        input {
            font-weight: 100;
            line-height: 35px;
            font-size: 14px;
            height: 100%;
            width: 100%;
            border-radius: 5px;
            &:focus {
                border: 1px solid #ccc;
            }
        }
    }
    .isDisabled {
        background: transparent;
    }
    .isCenter {
        text-align: center;
    }
}
</style>
