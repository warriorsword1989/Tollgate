<template>
	<div class="photoWork">
		<!-- 头部内容 -->
		<div class="header">
			<div class="headerItem">
				<div>行政区划：</div>
				<el-select v-model="searchCondition.adminCode" placeholder="请选择">
					<el-option v-for="item in cityList" :key="item.adminCode" :label="item.cityName" :value="item.adminCode"></el-option>
				</el-select>
			</div>

			<div class="headerItem">
				<div>情报编码：</div>
				<el-input :v-model="searchCondition.infoCode" placeholder="请输入内容"></el-input>
			</div>

			<div class="headerItem">
				<div>更新时间：</div>
				<el-date-picker v-model="searchCondition.pushBeforeTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
				<div style="padding: 0 2px">至</div>
				<el-date-picker v-model="searchCondition.pushAfterTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
			</div>

			<div class="headerItem">
				<check-box :is-box='false' @change="checkBoxChanged($event)" type='button' :checked="searchCondition.complete" :data-list="statusArr"></check-box>
			</div>

			<div class="headerItem">
				<el-button icon="el-icon-search" @click="showData">查询</el-button>
			</div>
		</div>
		<!-- 表格(height属性必须卸载table上，如果写css，固定表头不起作用) -->
		<div v-loading="loading" element-loading-text="查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8);" style="height:calc(100% - 170px)" class="content">
			<el-table height="100%" :data="tableData" border>
				<el-table-column width="70" prop="id" label="序号" type="index" :index="indexMethod" align="center"></el-table-column>
				<el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.field" :label="item.label" align="center"></el-table-column>
				<el-table-column prop="operation" label="操作" align="center">
					<template slot-scope="scope">
						<el-button @click="handleClick(scope.row, 'dynamic')" disabled type="button" size="small">动态作业</el-button>
						<el-button @click="handleClick(scope.row, 'static')" type="button" size="small">静态作业</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 底部分页 -->
		<div class="footer">
			<el-pagination :style="pageStyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchCondition.currentPage" :page-size="searchCondition.pageSize" :page-sizes="[10, 15, 20]" layout="sizes, total, prev, pager, next" :total="pageTotal"></el-pagination>
		</div>
	</div>
</template>

<script>
	import utils from '@/tools/utils'
	import config from '@/config/index'
	import { appUtil } from '@/Application';
  import checkBox from '@/components/widget/checkBox'
	import { getTollGateInfoList, getAdminLoc } from '@/dataService/api';

	const tableHeader = [
		{ field: 'info_code', label: '情报编码' },
		{ field: 'url', label: '来源网址' },
		{ field: 'info_content', label: '新闻内容' },
		{ field: 'news_time', label: '发布日期' },
		{ field: 'public_time', label: '推送日期' },
		{ field: 'completeName', label: '完成状态' },
		{ field: 'memo', label: '备注' }
	];
  export default {
    name: 'photoWork',
    components: { checkBox },
    data() {
			const preDate = new Date();
			preDate.setDate(new Date().getDate() - 30);
      return {
        statusArr: [
					{ label: '未处理', value: 1 },
					{ label: '已处理', value: 2 },
					{ label: '无法处理', value: 3 }
				],
				cityList: config.cityList.cityList || [],
				searchCondition: {
					adminCode: '110000',
					infoCode: '',
					pushBeforeTime: utils.newDateFormat(preDate, 'yyyyMMdd'),
					pushAfterTime: utils.newDateFormat(new Date(), 'yyyyMMdd'),
					complete: [1, 2, 3],
					currentPage: 1,
					pageSize: 10
				},
				pageTotal: 0,
				loc: '',
				loading: false,
				tableData: [],
				tableHeader: tableHeader || []
      }
    },
    
    computed: {
			/**
				* 设置分页的样式;
			 */
			pageStyle() {
				return 'float: right; padding: 10px 50px';
			}
		},

    methods: {
			/**
				* 计算列表索引;
			 */
			indexMethod(index) {
				return (this.searchCondition.currentPage - 1) * this.searchCondition.pageSize + index + 1;
			},

			/**
				* 更新当前选中的值;
			 */
			checkBoxChanged(parma){
					this.searchCondition.complete = parma;
			},

			/**
				* 对返回数据的处理;
			 */
			transformData(data) {
				const result = data.map(item => {
						item.isAdoptedName = item.complete === 1 ? '未处理' : item.complete === 2 ? '已处理' : '无法处理';
						return item;
				});
				return result;
			},

			/**
				* 请求表格数据
			 */
			showData() {
				this.loading = true;
				getTollGateInfoList(this.searchCondition)
					.then((result) => {
						const { data, errorCode, total } = result;
						if (!errorCode) {
							this.tableData = this.transformData(data);
							this.pageTotal = total;
							if (this.tableData.length) {
								getAdminLoc({ adminCode: this.searchCondition.adminCode })
									.then(innerResult => {
										const { data, errorCode } = result;
										if (!errorCode) {
											this.loc = data[0].geometry;
										}
									});
							}
						}
					})
					.finally(() => {
						this.loading = false;
					})
					.catch(e => {
						throw new Error(e);
					});;
			},

			/**
				* 处理显示条数改变的情况
			 */
			handleSizeChange(val) {
				this.searchCondition.pageSize = val;
				this.showData();
			},

			/**
				* 处理页码改变的情况
			 */
			handleCurrentChange(val) {
				this.searchCondition.currentPage = val;
				this.showData();
			},

			/**
				* 进入作业界面;
			 */
			handleClick(data, type) {
				this.$router.push({
					name:'mainMap',
					params:{
						point:this.loc,
						type: 2, 
						data: {
							pushBeforeTime: this.searchCondition.pushBeforeTime,
							pushAfterTime: this.searchCondition.pushAfterTime,
							adminCode: this.searchCondition.adminCode,
							complete: this.searchCondition.complete,
							pageSize: this.searchCondition.pageSize,
							currentPage:this.searchCondition.currentPage,
							infoCode:this.searchCondition.infoCode
            }
					}
				});
				appUtil.setGolbalData({
					workType: type,
					adminCode: this.searchCondition.adminCode,
					dataSource: 2,
					infoCode: data.info_code
				});
			}
    },

    mounted() {
			this.showData();
    }
  }
</script>

<style scoped>
	.photoWork {
		height: 100%;
		display: flex;
		flex-direction: column
	}
	.header {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 10px
	}
	.headerItem {
		display: flex;
		padding: 5px;
		align-items: center;
	}
	.headerItem > div {
		display: table-cell; 
	}
	.headerItem .el-input {
		width: auto;
	}
	.content {
		flex: 1;
	}
	.content .el-table--border {
		overflow: auto;
	}
	.footer {
		height: 50px;
	}
</style>
