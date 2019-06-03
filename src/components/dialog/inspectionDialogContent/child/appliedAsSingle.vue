<!--  -->
<template>
    <div class="applie-content">
        <div class="applie-top">
			<div class="data-name">
				<span>来源</span>
				<span>叫修編號</span>
				<span>報修人</span>
				<span>預計完成日</span>
				<span>報修部門</span>
				<span>報修樓層</span>
				<span>報修項目</span>
				<span>緊急程度</span>
				<span>備註</span>
			</div>
			<div class="data-content">
				<span>{{signedData.Source}}</span>
				<span>{{signedData.OrderCode}}</span>
				<span>{{signedData.upPageType == 'DW_overview' ? signedData.Survey.ContactPerson : signedData.ContactPerson}}</span>
				<span>{{signedData.upPageType == 'DW_overview' ? signedData.EndDate : signedData.EndTime | dateToDate}}</span>
				<span>{{signedData.upPageType == 'DW_overview' ? signedData.Survey.ContactDept : signedData.ContactDept}}</span>
				<span>{{signedData.upPageType == 'DW_overview' ? signedData.Survey.Floor : signedData.Floor}}</span>
				<span>{{signedData.Work}}</span>
				<span class="level">
					<i class="round default-color" :class="{ 'select-color' : signedData.EmergencyLevel >=1 }"></i>
					<i class="round default-color" :class="{ 'select-color' : signedData.EmergencyLevel >=2 }"></i>
					<i class="round default-color" :class="{ 'select-color' : signedData.EmergencyLevel >=3 }"></i>
					<i class="round default-color" :class="{ 'select-color' : signedData.EmergencyLevel >=4 }"></i>
					<i class="round default-color" :class="{ 'select-color' : signedData.EmergencyLevel >=5 }"></i>
				</span>
				<div class="note-box">
					<span class="iconfont icon-bArrow" @click="isShowDetails = ! isShowDetails"></span>
					<span class="project-text" @click="isShowDetails = ! isShowDetails">{{signedData.Remark}}</span>
					<div class="text" v-show="isShowDetails">{{signedData.Remark}}</div>
				</div>
			</div>
		</div>
        <div class="applie-center">
			<div class="applie-search-box">
				<tw-search class="search" type="slave" :searchList="searchList" isShadow></tw-search>
			</div>
			<div class="data-table">
				<table>
					<thead>
						<tr>
							<th class="pointer">
								<span class="sort-box" @click="sortByCode">代號
									<span class="iconfont arrow"  :class="{'icon-tArrow': isCodeSort == 2 ,'icon-bArrow' : isCodeSort == 1}"></span>
								</span>
							</th>
							<th>品名</th>
							<th>備倉存量</th>
							<th>數量</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,i) in datas" :key="i">
							<td>{{item.Code}}</td>
							<td>{{item.Name}}</td>
							<td>{{item.Quantity}}</td>
							<td>
								<input type="text" class="isDisabled" :min="0" :max="item.Quantity" v-model="item.num" @input="inputChange($event,item)" @blur="inputBlur">
							</td>
						</tr>
					</tbody>
            	</table>
			</div>
			<div class="info" v-show="datas.length == 0">暫無數據</div>
			<div class="pagination-box">
				<tw-pagination type="slave"></tw-pagination>
			</div>
		</div>
        <div class="applie-bottom">
			<tw-btn class="btn" title="確認" @click="confirm"></tw-btn>
			<tw-btn class="btn" title="取消" @click="cancel"></tw-btn>
		</div>
    </div>
</template>

<script>
import API from '../../../../api/index.js';
import InputNumber from '../../../inputNumber';
import TwPagination from '../../../tw-pagination';
import TwSearch from '../../../units/tw-search';
import TwBtn from '../../../tw-btn'
export default {
	name: "appliedAsSingle",
	data() {
		return {
            isCodeSort : 0,
			isShowDetails:false,
			searchList:[
				{key:'Code',value:'代號'},
				{key:'Name',value:'品名'},
				{key:'Quantity',value:'備倉存量'},
			],
			selectData:[],
			isClick:true,
			idArr: new Map()
		};
	},

	components: {
		InputNumber,
		TwPagination,
		TwSearch,
		TwBtn
	},

	created() {
		this.getSlaveMaterial()
	},

	methods: {
		//input change 事件
		inputChange(e,_item) {
			e.target.value = e.target.value.replace(/[^\d]/g, "");
			if( e.target.value > _item.Quantity ) {
				e.target.value = _item.Quantity;
			}
		},
		//input 失焦事件
		inputBlur() {
			this.getChangeData()
		},
		getChangeData() {
			this.datas.forEach( item => {
				if( item.num != 0 ) {
					this.idArr.set( item.ID , {
						MaterialID: item.ID,
						Quantity: item.num,
						Remark: ""
					})
					// this.selectData.push({
					// 	MaterialID: item.ID,
					// 	Quantity: item.num,
					// 	Remark: ""
					// })
				}
			})
		},
		//确认事件
		confirm() {
			if(!this.isClick) return;
			this.isClick = false;
			let selectData = [...this.idArr.values()]
			let data = {
				Materials : selectData,
				Remark : ''
			}
			this.$axios.put(`${API.getSlaveOutByDate}${this.$store.state.userData.DeptType}/${this.signedData.BOMID}`,data).then( res => {
				if( this.signedData.upPageType == 'DW_overview' ) {
					this.$store.state.dialogType = 'tasktingSigned'
				}else {
					this.$store.state.dialogType = 'callRepairPSigned'
				}
            	this.isClick = true;
            }).catch( err => {
            	this.isClick = true;
				this.openInfoDialog('修改備倉出庫單失敗')
			})
		},
		//取消時間
		cancel() {
			if( this.signedData.upPageType == 'DW_overview') {
				this.$store.state.dialogType = 'tasktingSigned'
			}else {
				this.$store.state.dialogType = 'callRepairPSigned'
			}
		},
		 //代碼排序
        sortByCode() {
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

            });
		},
		openInfoDialog(_content,_title = '提示') {
			this.$alert(_content, _title, {
			confirmButtonText: '確定',
			callback: action => {
				this.close();
			}
			});
		},
        throttle() {
            this.isClick = false;
            this.throttleTime = setTimeout( () => {
                this.isClick = true;
            },2000)
        },
	},
    filters: {
        dateToDate(date){
            if(!date) return ;
            const _date = date.split('T')[0]
            const __date = _date.split('-')
            __date[0] =  __date[0] - 1911
            return __date.join('/')
        }
    },

	computed: {
		datas() {
			let data = this.$store.state.slaveFindData;
			data.forEach( item => {
				item.num = 0
			})
			return data;
		},
        signedData() {
            return this.$store.state.signedData;
        }
	}
};
</script>
<style lang="less" scoped>
.applie-content {
	width: 72rem;
	width: 86rem;
	font-size: 1.2rem;
	.applie-top {
		width: 100%;
		height: 7.3rem;
		border-radius: 1rem;
		background: #DFE6E9;
		margin-top: 1rem;
		.data-name,.data-content {
			span {
				display: inline-block;
				&:nth-child(1) {
					width: 5.5rem;
					text-align: center;
				}
				&:nth-child(2) {
					width: 6.8rem;
					width: 10.8rem;
				}
				&:nth-child(3) {
					width: 5rem;
					width: 8rem;
				}
				&:nth-child(4) {
					width: 6.8rem;
				}
				&:nth-child(5) {
					width: 6rem;
					width: 8rem;
				}
				&:nth-child(6) {
					width: 6.5rem;
				}
				&:nth-child(7) {
					width: 12.2rem;
				}
				&:nth-child(8) {
					width: 7.8rem;
				}
				&:nth-child(9) {
					width: 16rem;
				}
			}
			.note-box {
				margin-right: 0.6rem;
				width: 15rem;
				border-radius: 0.8rem;
				display: inline-block;
				vertical-align: middle;
				position: relative;
				cursor: pointer;
				&:hover {
					.icon-bArrow {
						color: #fff;
					}
				}
				.project-text {
					display: inline-block;
					width: 100%;
					padding: 0 2rem 0 0rem;
					overflow: hidden;
					line-height: 2rem;
					height: 4rem;
					word-wrap:break-word;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.icon-bArrow {
					position: absolute;
					right: 0.5rem;
					font-size: 1.2rem;
					line-height: 2.2rem;
					font-size: 1.2rem;
					width: auto;
				}
				.text {
					display: inline-block;
					width: 15rem;
					position: absolute;
					top: 2.7rem;
					background: #e8e8e8;
					word-wrap:break-word;
					box-shadow: 0 0 5px rgba(0,0,0,.3);
					border-radius: 0.5rem;
					padding: 0.5rem;
					font-size: 1.2rem;
					z-index: 100;
				}
			}
		}
		.data-content {
			span {
				
				overflow: hidden;
				line-height: 1.7rem;
			}
		}

		.data-name {
			height: 2.5rem;
			line-height: 2.5rem;
		}
		.data-content {
			height: 4.8rem;
			line-height: 2.5rem;
			.level {
				.round {
					width: 0.9rem;
					height: 0.9rem;
					display: inline-block;
					border-radius: 50%;
				}
				.default-color {
					background: #fff;
				}
				.select-color {
					background: #000;
				}
			}
		}
	}
	.applie-center {
		width: 100%;
		height: 43rem;
		.applie-search-box {
			position: relative;
			padding-left: 56.4rem;
			padding-top: 2rem;
		}
		.data-table {
			text-align: center;
			table {
				display: inline-block;
			}
			tr{
				border-bottom: 1px solid #cdd3d6;
				td,th{
					text-align: left;
					height: 2.2rem;
					line-height: 2.2rem;
					font-size: 1.2rem;
					overflow: hidden;
					&:nth-child(1) {width: 14.5rem;}
					&:nth-child(2) {width: 16rem;}
					&:nth-child(3) {width: 33.4rem;}
					&:nth-child(4) {width: 8rem;}
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
				input {
					padding-left: 1rem;
					width: 5.1rem;
					height: 2rem;
					background: #e8e8e8;
					border-radius: 0.5rem;
				}
			}
		}
		.info {
			width: 100%;
			text-align: center;
			font-size: 1.4rem;
			line-height: 4rem;
			border-bottom: 1px solid #ccc;
		}
		.pagination-box {
			text-align: center;
			margin-top: 8px;
		}
	}
	.applie-bottom {
		width: 100%;
		height: 3rem;
		text-align: center;
		.btn {
			margin: 0 0.7rem;
		}
	}
}
</style>
