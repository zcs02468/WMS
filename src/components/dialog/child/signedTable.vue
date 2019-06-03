<!-- signedTable -->
<template>
    <div class="signed-table-box">
        <div class="signed-head-box">
            <table cellspacing="0" cellpadding="0" border="0" class="table-header" style="width: 1162px;">
                <colgroup>
                    <col v-for="(item,i) in widthData" :key="i" :name=" 'dialog-table-column-'+ i " :width="item.width">
                </colgroup>
                <thead>
                    <tr>
                        <th v-for="(item,i) in headData" :key="i" :class="[ 'dialog-table-column-' + i , item.isCenter ? 'isCenter' : '' ]">{{ item.title }}</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="signed-body-box">
            <table cellspacing="0" cellpadding="0" border="0" class="table-header" style="width: 1162px;">
                <colgroup>
                    <col v-for="(item,i) in widthData" :key="i" :name=" 'dialog-table-column-'+ i " :width="item.width">
                </colgroup>
                <tbody>
                    <tr v-for="(item,i) in bodyData.Materials" :key="i">
                        <td>{{ i == 0 ?  bodyData.OrderCode : '' }}</td>
                        <td v-if="i==0">{{bodyData.CreatedTime | filterDate }}</td>
                        <td v-else></td>
                        <td>{{ i == 0 ?  bodyData.CreatedUser : '' }}</td>
                        <td>{{ item.Name }}</td>
                        <td>{{ item.Amount }}</td>
                        <td>{{ item.Limit }}</td>
                        <td>{{ item.Spec }}</td>
                        <td>{{ item.Location }}</td>
                        <td>{{ item.Remark }}</td>
                        <td>
                            <input-number v-model="item.Quantity" :max="item.Quantity" :min="0" isBtn></input-number>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import InputNumber from '../../inputNumber'
export default {
    name: "signedTable",
    props:{
        widthData:{
            type:Array,
            default:[]
        },
        headData:{
            type: Array,
            default:[]
        },
        bodyData:{
            type:Object,
            default:[]
        }
    },
    data() {
        return {};
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
        
    components: {
        InputNumber
    },

    methods: {},

    computed: {}
};
</script>
<style lang="less" scoped>
.signed-table-box {
    th {
        text-align: left;
    }
    th,tr {
        height: 3.5rem;
        border-bottom: 2px solid #ebebeb;
    }
}
</style>