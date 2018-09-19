<template>
  <el-tabs @tab-click="innerTabPanelOnClick" tab-position="top" type="card">
    <el-tab-pane label="非收费站桥隧道"></el-tab-pane>
    <el-tab-pane label="收费站桥隧道"></el-tab-pane>
    <!-- 根据currentView动态切换组件 -->
    <component @tabStatusChange="changeTabStatus" :activeInnerPanel="activePanel" :is="currentView"></component>
  </el-tabs>
</template>

<script>
  import scTollLoad from '@/components/tableEdit/scTollLoad';
  import scTollOverLoad from '@/components/tableEdit/scTollOverLoad';
  export default {
    name: 'innerTab',
    components: { scTollLoad, scTollOverLoad },
    props: ['currentActive'],
    data() {
      return {
        // 当前要加载的组件;
        currentView: null,
        activePanel: 1
      }
    },

    computed: {},

    methods: {
      changeTabStatus (eData) {
        this.$emit('tabStatusChange', eData);
      },

      innerTabPanelOnClick(e) {
        // 这样写的原因是为了调换tab页的显示顺序而不改变内部逻辑的处理;
        this.activePanel = parseInt(e.index) === 1 ? 0 : 1;
        // 销毁组建(对于两次同时加载同一个组件只能在第一个加载时执行的解决办法);
        this.currentView = null;
        this.$nextTick(() => {
          this.currentView = this.copyView;
          this.activePanel = parseInt(e.index) === 1 ? 0 : 1;
        });
        // 如果是情报作业，发事件给父组件，更新信息来源
        const isBridge = this.activePanel == 1 ? false : true;
        this.$emit('refreshInfoSource', isBridge);
      }
    },

    mounted() {
      // 根据父组件点击的tab页来判断改加载哪个组件;  
      this.currentView = this.currentActive === 2 ? scTollLoad : scTollOverLoad;
      this.copyView = Object.assign({}, this.currentView);
    }
  }
</script>

<style scoped></style>