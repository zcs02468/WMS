<template>
    <div class="date-picker">
        <span class="title">請選擇年度月份</span>
        <el-date-picker
            v-model="beginDate"
            :editable="false"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
        <span class="division">至</span>
        <el-date-picker
            v-model="endDate"
            :editable="false"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
        <div class="button" @click="searchByDate">確認</div>
        <div class="button" v-if="reset" @click="resetDate">清除</div>
    </div>
</template>
<script>
export default {
    props: {
        reset: {
            type: Boolean,
            default: false
        },
        pusher: {
            type:Boolean,
            default: false
        }

    },
    data(){
        return {
            beginDate: '',
            endDate: '',
        }
    },
    methods: {
        searchByDate(){
            this.$store.state.clearSearchValue = true;
            this.selectDate();
        },
        resetDate(){
            this.$store.state.clearSearchValue = true;
            this.initDate();
            this.selectDate();
        },
        initDate(){
            if( this.pusher ){
                const date = new Date;
                let endDate;
                this.beginDate = this.filterDate(date).join('-');
                    endDate = date.getTime() + 1000*60*60*24*30;
                this.endDate = this.filterDate(new Date(endDate)).join('-');
            }else {
                const date = new Date;
                this.endDate = this.filterDate(date).join('-');
                let date2;
                date2 = date.getTime() - 1000*60*60*24*30;
                this.beginDate = this.filterDate(new Date(date2)).join('-');
            }
        },
        filterDate(date){
            return [date.getFullYear(),date.getMonth()+1,date.getDate()]
        },
        selectDate(){
            const start = this.beginDate;
            const end = this.endDate;
            this.$emit('click',{start,end})
        }
    },
    created(){
        this.initDate();
        this.selectDate();
    },
}
</script>

<style lang="less" scoped>
.date-picker{
    width: auto;
    height: 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.title{
    padding: 0 5px;
}
.division{
    padding: 0 10px;
}
.button{
    width: 6rem;
    height: 2.4rem;
    background-color: #636e72;
    border-radius: 0.8rem;
    color: #fff;
    line-height: 2.4rem;
    text-align: center;
    margin-left: 10px;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
}

</style>

