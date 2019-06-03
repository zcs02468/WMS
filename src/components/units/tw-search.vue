<!-- storageSearch  后期自适应页面需求 搜索 -->
<template>
    <div class="search-box" :class="{'search-callRepair':type == 'callRepair'}">
        <span class="iconfont icon-search search"></span>
        <input type="text" :placeholder="title" @keyup.enter="inputEnter" v-model="inputValue" :class="{'input-shadow' : isShadow}">
        <span class="iconfont icon-colum nav" @click="changeSelect" :class="[ isShowSelectBox ? 'select-nav' : '']"></span>
        <div class="search-select" v-show="isShowSelectBox">
            <span class="radio-box" v-for="(item,i) in searchList" :key="i">
                <span class="radio" :class="[selectNum == i ? 'select-radio-color' : '']" @click="selectRadio(i,item)"></span>
                <span class="title" @click="selectRadio(i,item)">{{item.value}}</span>
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
            default:'',// listing---巡检清单搜索  callRepair---巡检叫修搜索  taskting---派工搜索
        },
        title:{
            type:String,
            default:'搜索巡檢單'
        },
        searchList:{
            type:Array,
            default:[{key:1,value:'代號'},{key:2,value:'品名'},{key:3,value:'存放位置'}]
        },
        isShadow:{
            type:Boolean,
        }
    },
    data() {
        return {
            inputValue: null,
            isShowSelectBox: false,
            selectNum: 0,
            selectItem:this.searchList[0],//查询关键字
        };
    },

    components: {},

    methods: {
        changeSelect() {
            this.isShowSelectBox = !this.isShowSelectBox;
        },
        selectRadio(_index,_item) {
            this.selectNum = _index;
            this.selectItem = {
                key:_item.key,
                type:_item.type || ''
            };
        
        },
        inputEnter() {
            let allData = this.$store.state[this.type+'AllData'];
            this.$store.commit('addData',{key:this.type+'FindData',value: []})
            if( this.inputValue == '' || this.inputValue == null) {
                this.$store.commit('addData',{key:this.type+'FilterData',value: allData})
                this.$store.commit('addData',{key:this.type+'FindData',value: allData.slice(0,12)})
            }else {
                let cutData;
                if( this.selectItem.type == 'time' ) {
                    cutData = this.dateSearch( allData, this.selectItem.key, this.inputValue )
                }else if(  this.selectItem.type == 'hierarchy' ){
                    let key = this.selectItem.key.split('.')
                    cutData = this.hierarchyQuery( allData, key, this.inputValue )
                }else {
                    cutData = this.fuzzyQuery( allData, this.selectItem.key, this.inputValue )
                }
                this.$store.commit('addData',{key:this.type+'FilterData',value:cutData})
                this.$store.commit('addData',{key:this.type+'FindData',value: cutData.slice(0,12)})
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
            keyValue = String(keyValue)
            let arr = [];
            list.forEach((item, i) => {
                if (String(item[keyWord]).indexOf(keyValue) >= 0) {
                    arr.push(item);
                }
            });
            return arr;
        },
        //日期模糊查詢
        dateSearch(list, keyWord, keyValue) {
            let arr = [];
            list.forEach( (item,i) => {
               let time=  this.formatData(item[keyWord])
               if( time.indexOf(keyValue) >= 0) {
                   arr.push(item)
               }
            })
            return arr;
        },
        //嵌套層級的模糊查詢
        hierarchyQuery(list, keyWord, keyValue) {
            keyValue = String(keyValue)
            let arr = [];
            list.forEach((item, i) => {
                if (String(item[keyWord[0]][keyWord[1]]).indexOf(keyValue) >= 0) {
                    arr.push(item);
                }
            });
            return arr;
            // let arr = [];
            // list.forEach( (item,i) => {
            //    let time=  this.formatData(item[keyWord])
            //    if( time.indexOf(keyValue) >= 0) {
            //        arr.push(item)
            //    }
            // })
            // return arr;
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
        },
        formatData(value) {
            const date = new Date(value);
            let Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes();
            // s = date.getSeconds(),
            // w = date.getDay();//注:0-6对应为星期日到星期六
            Y = Y - 1911;
            if (m <10) {
                m = '0'+m
            }
            if(d < 10) {
                d = '0' + d;
            }
            const t = `${Y}/${m}/${d}`;
            return t;
        }
    },
    computed: {
        clearSearchValue() {
            return this.$store.state.clearSearchValue;
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
    width: 23.8rem;
    position: relative;
    color: #000;
    input {
        width: 100%;
        height: 2.7rem;
        border-radius: 0.9rem 0.8rem 0.8rem 0.9rem;
        padding-left: 3rem;
        font-size: 1.2rem;
    }
    span { 
        height: 2.7rem;
        text-align: center;
        line-height: 2.7rem;
        cursor: pointer; 
    }
    .input-shadow {
        background: #e8e8e8;
    }
    .search {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 1.2rem;
        font-weight: 900;
        width: 3rem;
    }
    .nav {
        position: absolute;
        right: 0;
        top: 0;
        width: 3.1rem;
        font-size: 1.4rem;
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
        top: 3.2rem;
        z-index: 10;
        width: 100%;
        height: 2.7rem;
        padding-left: 1rem;
        border-radius: 6px;
        background: #fff;
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        box-shadow: 0 0px 10px rgba(0,0,0,0.2);
        .radio-box {
            display: inline-block;
            margin-left: 0.9rem;
            position: relative;
            .radio {
                display: inline-block;
                width: 1.1rem;
                height: 1.1rem;
                border-radius: 50%;
                background: #dfe6e9;
                vertical-align: middle;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            .title {
                display: inline-block;
                height: 2.7rem;
                line-height: 2.7rem;
                font-size: 1.2rem;
                padding-left: 1.4rem;
            }
            .select-radio-color {
                background: #2d3436;
            }
        }
    }
}
.search-callRepair {
    width: 25.8rem;
}
</style>
