<template>
  <el-tabs class="scTollRdlinkBt" style="margin-right: 3px;" v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
    <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
      <rd-link-bt v-for="(itemContent, indexContent) in editableTabs"></rd-link-bt>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import rdLinkBt from './rdlinkBt'
  export default {
    name: 'scTollRdlinkBtTab',
    components: {rdLinkBt},
    data() {
      return {
        editableTabsValue: '1',
        editableTabs: [{
          title: '桥隧道收费',
          name: '1'
        }],
        tabIndex: 1,
      }
    },
    watch: {},
    methods: {
      // 新增一个tab;
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          if (this.editableTabs.length === 5) return;
          let newTabName = this.editableTabs.length + 1 + '';
          this.editableTabs.push({
            title: `桥隧道收费`,
            name: newTabName
          });

          this.editableTabsValue = newTabName;
        }

        // 删除一个tab;
        if (action === 'remove') {
          if (this.editableTabs.length === 1) return;

          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;

          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });

          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }

      }
    },
    mounted () {}
  }
</script>

<style scoped></style>
