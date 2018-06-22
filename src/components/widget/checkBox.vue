<template>
	<el-checkbox-group @change="onCheckChange" v-model="checkGroup">
		<el-checkbox v-if="checkType=='border'" border v-for="(item, index) in dataList" :label="item.label" :key="index"></el-checkbox>
		<el-checkbox v-if="checkType=='normal'" v-for="(item, index) in dataList" :label="item.label" :key="index"></el-checkbox>
		<el-checkbox-button v-if="checkType=='button'" v-for="(item, index) in dataList" :label="item.label" :key="index">{{item.label}}</el-checkbox-button>
	</el-checkbox-group>
</template>

<script>
  export default {
    data () {
      return {
        checkGroup: [],
        cities: this.dataList,
				checkType: this.type
      };
    },
    props: {
        dataList: Array,
				type: {
					type: String,
					default: 'normal'
				}
    },
    methods: {
			onCheckChange(e) {
				console.log(e);
				this.$emit('change',e);
			}
    }
  }
</script>