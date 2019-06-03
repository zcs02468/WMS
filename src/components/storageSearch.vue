<!-- storageSearch -->
<template>
    <div class="search-box">
        <span class="iconfont icon-search search"></span>
        <input type="text" :placeholder="info" @keyup.enter="inputEnter" v-model="inputValue">
        <span class="iconfont icon-colum nav" @click="changeSelect" :class="[ isShowSelectBox ? 'select-nav' : '' ]"></span>
        <div class="search-select" v-if="type != 'sign'" v-show="isShowSelectBox">
            <span class="radio-box" v-for="(item,i) in selects" :key="i">
                <span class="radio" :class="[selectNum == i ? 'select-radio-color' : '']" @click="selectRadio(i)"></span>
                <span class="title">{{item.title}}</span>
            </span>
        </div>
        <div class="search-select" v-show="isShowSelectBox" v-else>
            <span class="radio-box" v-for="(item,i) in signSelects" :key="i">
                <span class="radio" :class="[selectNum == i ? 'select-radio-color' : '']" @click="selectRadio(i)"></span>
                <span class="title">{{item.title}}</span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "storageSearch",
    props:{
        type:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            inputValue: null,
            isShowSelectBox: false,
            selects: [
                {title: '代號',keyWord:'Code'},
                {title: '品名',keyWord:'Name'},
                {title: '存放位置',keyWord:'Location'}
            ],
            signSelects:[
                {title: '轉移代碼',keyWord:'OrderCode'},
                {title: '品名',keyWord:'Name'},
                {title: '存放位置',keyWord:'Location'}
            ],
            selectNum: 0
        };
    },

    components: {},

    methods: {
        changeSelect() {
            this.isShowSelectBox = !this.isShowSelectBox;
        },
        selectRadio(index) {
            this.selectNum = index;
        },
        inputEnter() {
            let fun = this.type+'Enter';
            this[fun]();
        },
        masterEnter() {
            let masterAllData = this.$store.state.masterAllData;
            this.$store.commit('addData',{key:'masterFindData',value: []})
            if( this.inputValue == '' || this.inputValue == null ) {
                this.$store.commit('addData',{key:'masterFilterData',value: masterAllData})
                this.$store.commit('addData',{key:'masterFindData',value: masterAllData.slice(0,12)})
            }else {
                let cutData = this.fuzzyQuery( masterAllData, this.selects[this.selectNum].keyWord, this.inputValue )
                this.$store.commit('addData',{key:'masterFilterData',value:cutData})
                this.$store.commit('addData',{key:'masterFindData',value: cutData.slice(0,12)})
            }
        },
        slaveEnter() {
            this.$store.commit('addData',{key:'slaveFindData',value: []})
            let slaveAllData = this.$store.state.slaveAllData;
            if( this.inputValue == '' || this.inputValue == null ) {
                this.$store.commit('addData',{key:'slaveFilterData',value:slaveAllData})
                this.$store.commit('addData',{key:'slaveFindData',value: slaveAllData.slice(0,12)})
            }else {
                let cutData = this.fuzzyQuery( slaveAllData, this.selects[this.selectNum].keyWord, this.inputValue )
                this.$store.commit('addData',{key:'slaveFilterData',value:cutData})
                this.$store.commit('addData',{key:'slaveFindData',value: cutData.slice(0,12)})
            }
        },
        signEnter() {
            this.$store.commit('addData',{key:'signFindData',value: []})
            let signAllData = this.$store.state.signAllData;
            if( this.inputValue == '' || this.inputValue == null ) {
                this.$store.commit('addData',{key:'signFilterData',value:signAllData})
                this.$store.commit('addData',{key:'signFindData',value: signAllData.slice(0,12)})
            }else {
                let cutData;
                if( this.selectNum == 0 ) {
                    cutData = this.fuzzyQuery( signAllData, this.signSelects[this.selectNum].keyWord, this.inputValue )
                }else {
                    cutData = this.signFuzzQuery( signAllData, this.signSelects[this.selectNum].keyWord, this.inputValue )
                }
                this.$store.commit('addData',{key:'signFilterData',value:cutData})
                this.$store.commit('addData',{key:'signFindData',value: cutData.slice(0,12)})
            }
        },
        /**
         * 模糊查询数据  使用与主仓和备仓的模糊查询  以及签核的转移代码的模糊查询
         * @param  {Array}  list     进行查询的数组
         * @param  {String} keyWord  查询的关键词
         * @param  {String} keyValue  查询的内容
         * @return {Array}           查询的结果
         */
        fuzzyQuery(list, keyWord, keyValue) {
            let arr = [];
            list.forEach((item, i) => {
                if (item[keyWord].indexOf(keyValue) >= 0) {
                    arr.push(item);
                }
            });
            return arr;
        },
        //适用于 签核tab页 中的 品名与存放位置的模糊搜索
        signFuzzQuery(list, keyWord, keyValue ) {
            let arr = [];
            list.forEach( item => {
                let isOk =  item.Materials.some( ele => {
                    return ele[keyWord].indexOf(keyValue) >= 0
                });
                if( isOk ) {
                    arr.push( item )
                }
            })
            return arr;
        }
    },
    computed: {
        clearSearchValue() {
            return this.$store.state.clearSearchValue;
        },
        info() {
            switch (this.type) {
                case 'master':
                    return '搜索主倉'
                case 'slave':
                    return '搜索備倉'
                case 'sign':
                    return '搜索簽核單'
                default:
                    return '不支持的type類型'
            }
        }
    },
    watch:{
        clearSearchValue(val) {
            if( val ) {
                this.inputValue = null;
                this.$store.state.clearSearchValue = false;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.search-box {
    width: 504px;
    position: relative;
    color: #000;
    input {
        width: 100%;
        height: 50px;
        border-radius: 6px;
        padding-left: 60px;
        font-size: 17px;
    }
    span {
        height: 50px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
    }
    .search {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 20px;
        font-weight: 900;
        width: 60px;
    }
    .nav {
        position: absolute;
        right: 0;
        top: 0;
        width: 60px;
        font-size: 28px;
        background: #959ea2;
        color: #fff;
        border-radius: 0 6px 6px 0;
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
    }
    .select-nav {
        background: #fbcb6e;
    }
    .search-select {
        position: absolute;
        top: 60px;
        z-index: 10;
        width: 100%;
        height: 50px;
        padding-left: 16px;
        border-radius: 6px;
        background: #fff;
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        box-shadow: 0 0px 6px rgba(0,0,0,0.4);
        .radio-box {
            display: inline-block;
            margin-left: 20px;
            .radio {
                display: inline-block;
                width: 20px;
                height: 20px;
                border-radius: 8px;
                background: #dfe6e9;
                vertical-align: middle;
            }
            .title {
                display: inline-block;
                height: 20px;
                line-height: 20px;
                margin-left: 15px;
                font-size: 14px;
            }
            .select-radio-color {
                background: #2d3436;
            }
        }
    }
}
</style>
