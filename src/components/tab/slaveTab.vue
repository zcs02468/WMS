<template>
    <div class="main-tab">
        <div class="tab-search">
            <storage-search type="slave"></storage-search>
        </div>
        <div class="slave-table">
            <table>
                <thead>
                    <tr>
                        <th class="round">
                            <span class="selection" @click="selectAll($event)"></span>
                        </th>
                        <th class="pointer">
                            <span class="sort-box" @click="sortByCode">代號
                                <span class="iconfont arrow" :class="{'icon-tArrow': isCodeSort == 2 ,'icon-bArrow' : isCodeSort == 1}"></span>
                            </span>
                        </th>
                        <th class="pointer">
                            <span class="sort-box" @click="sortByName">品名
                                <span class="iconfont arrow" :class="{'icon-tArrow': isNameSort == 2 ,'icon-bArrow' : isNameSort == 1}"></span>
                            </span>
                        </th>
                        <th class="pointer">
                            <span class="sort-box" @click="sortByQuantity">備倉存量
                                <span class="iconfont arrow" :class="{'icon-tArrow': isQuantitySort == 2 ,'icon-bArrow' : isQuantitySort == 1}"></span>
                            </span>
                        </th>
                        <th>單位</th>
                        <th class="pointer">
                            <span class="sort-box" @click="sortByLocation">存放位置
                                <span class="iconfont arrow" :class="{'icon-tArrow': isLocationSort == 2 ,'icon-bArrow' : isLocationSort == 1}"></span>
                            </span>
                        </th>
                        <th>備註</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in datas" :key="i">
                        <td class="round">
                            <span class="selection" @click="select($event,item)"></span>
                        </td>
                        <td>{{item.Code}}</td>
                        <td>{{item.Name}}</td>
                        <td>{{item.Quantity}}</td>
                        <td>{{item.Spec}}</td>
                        <td>{{item.Location}}</td>
                        <td>{{item.Remark}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="info-table" v-if="datas.length == 0">
            <div class="info">暫無數據</div>
        </div>
        <div class="tab-paging">
            <tw-pagination type="slave" @upDatePageIndex="upDatePageIndex"></tw-pagination>
        </div>
        <div class="tab-button">
            <tw-button title="匯出" isShadow @click="remit"></tw-button>
        </div>
    </div>
</template>

<script>
import StorageSearch from "../storageSearch";
import TwButton from "../tw-button.vue";
import API from "../../api/index.js";
import TwPagination from "../tw-pagination";
export default {
    data() {
        return {
            isCodeSort : 0,
            isNameSort : 0,
            isQuantitySort : 0,
            isLocationSort : 0,
            selectList: new Map()
        }
    },
    computed: {
        datas() {
        return this.$store.state.slaveFindData;
        }
    },
    methods: {
        //汇出
        remit() {
            let data = Array.from(this.selectList.keys()).join(',')
            this.$axios.get(API.exportMaterial+this.$store.state.userData.DeptType+'?IDs='+data).then(res => {
                console.log( res )
            }).catch( err => {
                console.log(err)
            })
        },
        select(e,selection){
            if(e.target.classList.contains('active')){
                //取消選中
                this.selectList.delete(selection.ID)
                this.$el.querySelector('.selection').classList.remove('active');
            }else{
                //選中
                this.selectList.set(selection.ID,selection)
                this.selectList.size == this.datas.length && this.$el.querySelector('.selection').classList.add('active')
            }
            e.target.classList.toggle('active');
            this.$store.commit('addData',{key: 'storageSelectData',value: Array.from(this.selectList.values())})
        },
        selectAll(e){
            if(e.target.classList.contains('active')){
                //取消選中
                Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                    item.classList.remove('active')
                })
                this.selectList.clear()
            }else{
                //選中
                Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                    item.classList.add('active')
                })
                this.datas.forEach(item => {
                    this.selectList.set(item.ID,item)
                })
            }
            this.$store.commit('addData',{key: 'storageSelectData',value: Array.from(this.selectList.values())})
        },
        upDatePageIndex(_index) {
            Array.from(this.$el.querySelectorAll('.selection')).forEach(item => {
                item.classList.remove('active')
            })
            this.selectList.clear()
            this.$store.commit('addData',{key: 'storageSelectData',value:[]})
        },
        //代碼排序
        sortByCode() {
            // isCodeSort : 0,
            // isNameSort : 0,
            // isQuantitySort : 0,
            // isLocationSort : 0,
            this.isNameSort = 0;
            this.isQuantitySort = 0;
            this.isLocationSort = 0;
            //降序
            if( this.isCodeSort == 0 || this.isCodeSort == 2 ) {
                this.$store.commit('reverseList','slave');
                this.isCodeSort = 1;
                return;
            }
            //升序
            if( this.isCodeSort == 1 ) {
                this.$store.commit('sortByCode','slave');
                this.isCodeSort = 2;
            }
        },
        //品名排序
        sortByName() {
            this.isCodeSort = 0;
            this.isQuantitySort = 0;
            this.isLocationSort = 0;
            //降序
            if( this.isNameSort == 0 || this.isNameSort == 2 ) {
                this.$store.commit('sortByName','slave');
                this.$store.commit('reverseList','slave');
                this.isNameSort = 1;
                return;
            }
            //升序
            if( this.isNameSort == 1 ) {
                this.$store.commit('sortByName','slave');
                this.isNameSort = 2;
            }
        },
        //存量排序
        sortByQuantity() {
            this.isCodeSort = 0;
            this.isNameSort = 0;
            this.isLocationSort = 0;
            //降序
            if( this.isQuantitySort == 0 || this.isQuantitySort == 2 ) {
                this.$store.commit('sortByQuantity','slave');
                this.$store.commit('reverseList','slave');
                this.isQuantitySort = 1;
                return;
            }
            //升序
            if( this.isQuantitySort == 1 ) {
                this.$store.commit('sortByQuantity','slave');
                this.isQuantitySort = 2;
            }
        },
        //存放位置排序
        sortByLocation() {
            this.isCodeSort = 0;
            this.isNameSort = 0;
            this.isQuantitySort = 0;
            //降序
            if( this.isLocationSort == 0 || this.isLocationSort == 2 ) {
                this.$store.commit('sortByLocation','slave');
                this.$store.commit('reverseList','slave');
                this.isLocationSort = 1;
                return;
            }
            //升序
            if( this.isLocationSort == 1 ) {
                this.$store.commit('sortByLocation','slave');
                this.isLocationSort = 2;
            }
        },
        // 获取备仓所有物料信息
        getSlaveMaterial() {
            this.$axios
            .get(API.slaveMaterial + this.$store.state.userData.DeptType)
            .then(res => {
                const data = res.data;
                this.$store.commit("addData", { key: "slaveAllData", value: data });
                this.$store.commit("addData", {
                    key: "slaveFilterData",
                    value: data
                });
                this.$store.commit("addData", {
                    key: "slaveFindData",
                    value: data.slice(0, 12)
                });
            })
            .catch(err => {
                console.error(err);
            });
        },
        // 获取备仓指定物料信息
        getSlaveMaterialById(id) {
            this.$axios
                .get(API.slaveMaterial + this.$store.state.userData.DeptType +"/" + id)
                .then(res => {
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 修改备仓物料信息
        patchSlaveMaterialById(id) {
            this.$axios
            .patch(API.slaveMaterial, {})
            .then(res => {
            })
            .catch(err => {
                console.error(err);
            });
        }
    },
    components: {
        TwButton,
        StorageSearch,
        TwButton,
        TwPagination
    },
    created() {
        this.getSlaveMaterial();
    }
};
</script>

<style lang="less" scoped>
.slave-table {
    .round {
        span{
            width: 1.3rem;
            height: 1.3rem;
            display: inline-block;
            background: #fff;
            border-radius: 0.4rem;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
        .active {
            background: #000;
        }
    }
    tr{
        border-bottom: 1px solid #cdd3d6;
        td,th{
            text-align: left;
            // height: 4rem;
            // line-height: 4rem;
            font-size: 1.2rem;
            overflow: hidden;
            &:nth-child(1) {width: 5.4rem;position: relative;}
            &:nth-child(2) {width: 13rem;}
            &:nth-child(3) {width: 20.8rem;}
            &:nth-child(4) {width: 15.7rem;}
            &:nth-child(5) {width: 11.5rem;}
            &:nth-child(6) {width: 15.8rem;}
            &:nth-child(7) {width: 45rem;}
        }
        td {
            // padding: 10px 0;
            height: 3rem;
        }
        td{
            &:nth-child(2) {padding-left: 0.8rem;}
            &:nth-child(3) {padding-left: 0.8rem;}
            &:nth-child(4) {padding-left: 0.8rem;}
            &:nth-child(6) {padding-left: 0.8rem;}
        }
        .type-btn {
            top: 0.7rem;
        }
        .arrow {
            font-size: 1.2rem;
        }
        .pointer{
            cursor: pointer;
            user-select:none;
            .sort-box {
                width: 8rem;
                height: 3rem;
                border-radius: 0.8rem;
                display: inline-block;
                line-height: 3rem;
                padding-left: 0.8rem;
                &:hover {
                    background: #f7f7f7;
                }
            }
        }
    }
}
.info-table {
    width: 100%;
    min-height: 30rem;
    .info {
        width: 100%;
        font-size: 1.4rem;
        text-align: center;
        height: 5rem;
        border-bottom: 1px solid #d7d7d7d7;
        line-height: 5rem;
    }
}


.main-tab {
  width: 100%;
  height: 100%;
//   height: 60rem;
  position: relative;
  display: flex;
  flex-direction: column;
  .tab-search {
    width: 100%;
    height: 100px;
  }
  .tab-list {
    width: 100%;
    flex: 1;
  }
  .tab-paging {
    text-align: center;
    height: 162px;
    line-height: 126px;
    // height: 15rem;
    // line-height: 8rem;
  }
  .tab-button {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
  }
}

</style>

