<template>
	<div class="tollList">
		<!-- 头部内容 -->
		<div class="header">
			<div class="headerItem" style="flex: 1"><div><i class="el-icon-tickets"></i> 桥梁隧道列表</div></div>
			<div class="headerItem" style="width: 50px; text-align: center;font-size: 18px;"><i style="cursor: pointer" @click="closeDataList" class="el-icon-close"></i></div>
		</div>

		<el-form style="margin-bottom: -22px;padding: 10px;" size="small" :inline="true" class="demo-form-inline">
			<el-form-item label="桥梁隧道名称">
				<el-input v-model="searchName" placeholder="桥梁隧道名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">查询</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格(height属性必须卸载table上，如果写css，固定表头不起作用) -->
		<div v-loading="loading" element-loading-text="查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8);" style="height:calc(100% - 170px)" class="content">
			<el-table height="100%" :data="tableData.slice((pagination.currentPage-1)*pagination.pageSize,pagination.currentPage*pagination.pageSize)" border>
				<el-table-column width="50" prop="id" label="序号" type="index" :index="indexMethod" align="center"></el-table-column>
				<el-table-column width="90" prop="group_id" label="Pid" align="center"></el-table-column>
				<el-table-column prop="name_bt" label="桥梁隧道名称" align="center"></el-table-column>
				<el-table-column width="70" prop="operation" label="操作" align="center">
					<template slot-scope="scope">
						<span class="editPoint" @click="handleClick(scope.row, $event)"><i class="el-icon-edit"></i>编辑</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 底部分页 -->
		<div class="footer">
			<el-pagination :style="pageStyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :page-sizes="[10, 15, 20]" layout="sizes, total, prev, pager, next" :total="pagination.pageTotal"></el-pagination>
		</div>
	</div>
</template>

<script>
	import { getBridgeAndTunnel } from '@/dataService/api';
  export default {
    data () {
      return {
				loading: false,
				searchName: '',
				tableData: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
					pageTotal: 0
				},
				eventController: fastmap.uikit.EventController()
      };
    },

    props: {},

		computed: {
			/**
				* 设置分页的样式;
			 */
			pageStyle() {
				return 'float: right; padding: 10px 50px';
			}
		},

    methods: {
			closeDataList() {
				this.$emit('closeList');
			},
			/**
				* 计算列表索引;
			 */
			indexMethod(index) {
				return (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1;
			},
			handleSizeChange(val){
				this.pagination.pageSize = val;
			},
			handleCurrentChange(val){
				this.pagination.currentPage = val;
			},
			onSubmit() {
				this.showDataList();
			},
			handleClick(param, event) {
				const updateId = [param.group_id];
				this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, {
					features: updateId,
					event: event,
					flag:'update',
					sourceFlag: 3 
				});
			},
			showDataList() {
				this.loading = true;
				getBridgeAndTunnel({searchName: this.searchName})
				.then(result => {
					let { errorCode, data } = result;
					if (!errorCode) {
						this.tableData = data;
						this.pagination.pageTotal = data.length;
					}
				})
				.finally(() => {
					this.loading = false;
				})
				.catch(err => {
					throw new Error(err);
				});
			}
    },
		mounted() {
			this.showDataList();
		}
  }
</script>

<style scope>
  .tollList {
     position:absolute;
     z-index:12;
     height:100%;
		 width: 400px;
     background: #fff;
		 display: flex;
		 flex-direction: column;
  }
	.tollList .header {
		height: 40px;
		display: flex;
		background: #636ef5;
    padding-left: 10px;
		flex-direction: row;
	}
	.tollList .header .headerItem{
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		height: 40px;
		line-height: 40px;
	}
	.tollList .content {
		flex: 1;
	}
	.tollList .content .editPoint {
		color: #636ef5;
		cursor: pointer;
	}
	.tollList .content .editPoint:hover{
		text-decoration: underline;
	}
	.tollList .footer {
		height: 50px;
	}
</style>