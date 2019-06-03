<template>
    <div class="tw-dialog-box" v-if="isShowDialog">
        <component :is="changeDialog" :type="dialogType"></component>
    </div>
</template>

<script>
import StorageDialog from "./child/storageDialog";
import InspectionDialog from "./inspectionDialogContent/inspectionDialog";
import LookActivity from "./venueRental/lookActivity";
import Remit from "./venueRental/remit";

export default {
    name: "dialogBox",
    data() {
        return {
            typeObj:{
                //仓储系统
                'picking' : 'storage',//領料
                'replenishment' : 'storage',//補貨
                'transfer' : 'storage',//轉移
                'change' : 'storage',//变更
                'signed' : 'storage',//簽核
                //巡检系统
                'callRepairNSigned' : 'inspection',//巡检叫修单 未处理 签核
                'callRepairPSigned' : 'inspection',//巡检叫修单 处理中 签核
                'appliedAsSigned' : 'inspection',  //施作单签核
                'delaySigned' : 'inspection',  //延后完成日签核
                'appliceCallSigned': 'inspection',//从施作单到签核2
                'tasktingSigned': 'inspection',//从施作单到签核2
                'lookActivity':'lookActivity',
                'remit': 'remit',//场地汇出弹窗
            }
        };
    },
    computed: {
        changeDialog() {
            if( this.typeObj[this.dialogType] == 'storage') {
                return StorageDialog;
            }else if( this.typeObj[this.dialogType] == 'lookActivity' ){
                return LookActivity;
            }else if(this.typeObj[this.dialogType] == 'remit') {
                return Remit
            }else {
                return InspectionDialog;
            }
        },
        dialogType() {
            return this.$store.state.dialogType
        },
        isShowDialog() {
            return this.$store.state.isShowDialog
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tw-dialog-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
}
</style>
