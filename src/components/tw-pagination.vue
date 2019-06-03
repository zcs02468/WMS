<!-- 分页功能 -->
<template>
    <div class="pagination-box" v-show="total>12">
    <!-- <div class="pagination-box"> -->
        <span class="prev-title">上一頁</span>
        <el-pagination background layout="prev, pager, next" :current-page="num" :page-size="12" :total="total" class="pagination-page" @prev-click="prevClick" @next-click="nextClick" @current-change="currentChange">
        </el-pagination>
        <span class="next-title">下一頁</span>
    </div>
</template>

<script>
export default {
	name: "twPagination",
	props: {
		type: {
			type: String,
			default: "master" // master---主仓分页  slave---备仓分页 sign---签核分页  listing---巡检清单分页  callRepair---巡检叫修分页  taskting---派工分页
		}
	},
	data() {
		return {
			num: 1
		};
	},

	components: {},
	
	created() {
		this.$store.state.nowPageIndex = 1;
	},

	methods: {
		prevClick(_index) {
		},
		nextClick(_index) {
		},
		currentChange(_index) {
			this.num = _index;
			this.$emit("upDatePageIndex", _index);
			this.$store.state.nowPageIndex = _index;
			this.$store.commit("addData", { key: "storageSelectData", value: [] });
			let startNum = (_index - 1) * 12;
			let endNum = startNum + 12;
			endNum > this.total && (endNum = this.total);
			// this[this.type + "Paging"](startNum, endNum);

			let findData = this.$store.state[this.type+'FilterData'].slice(
				startNum,
				endNum
			);
			this.$store.commit("addData", {
				key: this.type+"FindData",
				value: findData
			});
		},
	},
	computed: {
		total() {
			// master---主仓分页  slave---备仓分页 sign---签核分页  listing---巡检清单分页  callRepair---巡检叫修分页  taskting---派工分页
			return this.$store.state[this.type + "FilterData"].length;
		},
		//是否更新分页参数
		isUpdateSortNum() {
			return this.$store.state.isUpdateSortNum;
		}

	},
	watch: {
		//分页初始化
		isUpdateSortNum(val) {
			if (val) {
				this.num = 1;
				this.$store.commit("addData", { key: "isUpdateSortNum", value: false });
			}
		}
	}
};
</script>
<style lang="less" scoped>
.pagination-page {
	display: inline-block;
	padding: 2px 38px;
}
.pagination-box {
	height: 34px;
	display: inline-block;
	line-height: 34px;
	position: relative;
	z-index: 10;
	left: 20px;
}
.prev-title {
	display: inline-block;
	height: 34px;
	position: absolute;
	z-index: -1;
}
.next-title {
	display: inline-block;
	height: 34px;
	position: absolute;
	z-index: -1;
	right: 45px;
	top: 0;
}
</style>
