<template>
  <!--主页面-->
  <div class="homeContainer">
    <el-tabs class="homeTabs" @tab-click="toggleWork" v-model="activeTab" tab-position="left">
      <el-tab-pane label="照片作业" name="photo"></el-tab-pane>
      <el-tab-pane label="情报作业" name="info"></el-tab-pane>
			<!-- 子路由 -->
      <router-view></router-view>
    </el-tabs>
    <user-tool class="userToolbar"></user-tool>
  </div>
</template>

<script>
import { appUtil } from '@/Application';
import UserTool from '@/components/widget/UserTool';
import { cityList } from '@/config/CityList';
import { getTollGateTipList, getTollGateInfoList, getAdminLoc } from '@/dataService/api';

export default {
	name: "Home",
	components: { UserTool },
	data() {
		return {
			activeTab: 'photo'
		};
	},
	methods: {
		toggleWork (e) {
			parseInt(e.index) ? this.$router.push({ path: '/home/infosWork' }) : this.$router.push({ path: '/home/photoWork' });
		}
	},
	mounted() {
		// 这里目的是从地图返回时也能回到进入时的路由;
		if (!this.$route.params.type || this.$route.params.type === 1) {
			this.activeTab = 'photo';
			return this.$router.push({ path: '/home/photoWork' });
		}
		this.activeTab = 'info';
		this.$router.push({ path: '/home/infosWork' });
	}
}
</script>

<style scoped>
	.homeContainer {
		height: 100%;
		background-color: #fff;
	}
	.homeTabs {
		height: 100%;
	}
</style>
