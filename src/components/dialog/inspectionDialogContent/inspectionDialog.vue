<!--  -->
<template>
	<div class="inspection-dialog" :style="inspectionStyle">
		<div class="dialog-head">
			<span class="close iconfont icon-guanbi" @click="close"></span>
			<div class="title-box">
				<!-- <span class="icon iconfont" :class="'icon-'+type"></span> -->
				<span class="icon iconfont icon-signed"></span>
				<span class="title">{{title}}</span>
			</div>
		</div>
        <component :is="changContent"></component> 
	</div>
</template>

<script>
import Singned from './child/singned'
import DelaySingned from './child/delaySigned'
import AppliedAsSingle from './child/appliedAsSingle'
import TasktingSigned from './child/tasktingSigned'
import EditorDelay from './child/editorDelay'

export default {
    name: "inspectionDialog",
    data() {
        return {
            titleObj:{ 
                'callRepairNSigned' : '簽核1',//巡检叫修单 未处理 签核
                'callRepairPSigned' : '簽核2',//巡检叫修单 处理中 签核
                'appliedAsSigned' : '施作單',  //施作单签核
                'delaySigned' : '延後完成日簽核',  //延后完成日签核
                'appliceCallSigned': '签核2',//从施作单到签核2
                'tasktingSigned': '回饋施作單內容',//派工签核
                'editorDelay':'修改延后完成日',//修改延后完成日
            }
        };
    },
    //inspection/set-ass-category
    components: {
		Singned,
        AppliedAsSingle,
        DelaySingned,
        EditorDelay
	},

    methods: {
        close() {
            this.$store.commit("SET_IS_SHOW_DIALOG");
        },
    },

    computed: {
        dialogType() {
            return this.$store.state.dialogType
        },
        changContent() {
            // this[this.dialogType]()
            if( this.dialogType == 'appliedAsSigned') {
                //施作单
                return AppliedAsSingle;
            }else if( this.dialogType == 'delaySigned'){
                //延后完成日签核
                return DelaySingned;
            }else if( this.dialogType == 'tasktingSigned'){
                //派工总览签核
                return TasktingSigned
            }else if(this.dialogType == 'editorDelay'){
                //签核
                return EditorDelay;
            }else {
                //签核
                return Singned;
            }
        },
        title() {
            return this.titleObj[this.dialogType]
        },
        inspectionStyle() {
            if( this.dialogType != 'appliedAsSigned' &&  this.dialogType != 'editorDelay' ) {
                return 'width:90rem;';
            }
        }
    }
};
</script>
<style lang="less" scoped>
.inspection-dialog {
    position: absolute;
    left: 50%;
    top: 50%;
    // width: 1338px;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    background: #fff;
    padding: 40px 57px;
    // width: 85rem;
    // height: 60rem;
    .dialog-head {
        .close {
            position: absolute;
            right: -1.6rem;
            top: -1.6rem;
            display: inline-block;
            width: 3.2rem;
            height: 3.2rem;
            color: #44484c;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0px 0px 10px #ccc;
            font-size: 1.4rem;
            font-weight: 900;
            text-align: center;
            line-height: 3.2rem;
            cursor: pointer;
        }
        .icon {
            font-size: 30px;
            color: #587ee0;
            margin-right: 15px;
        }
        .title-box {
            .title {
                font-size: 30px;
                color: #587ee0;
            }
        }
    }
}
</style>