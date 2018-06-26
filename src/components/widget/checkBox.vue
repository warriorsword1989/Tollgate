<template>
	<el-checkbox-group :style="comDisplay" @change="onCheckChange" v-model="checkGroup">
		<el-checkbox v-if="checkType=='border'" border v-for="(item, index) in dataList" :label="item.value" :key="index">{{item.label}}</el-checkbox>
		<el-checkbox v-if="checkType=='normal'" v-for="(item, index) in dataList" :label="item.value" :key="index">{{item.label}}</el-checkbox>
		<el-checkbox-button v-if="checkType=='button'" v-for="(item, index) in dataList" :label="item.value" :key="index">{{item.label}}</el-checkbox-button>
	</el-checkbox-group>
</template>

<script>
  export default {
    data () {
      return {
        checkGroup: this.checked,
        cities: this.dataList,
				checkType: this.type
      };
    },

    props: {
			dataList: Array,
			type: { type: String, default: 'normal' },
			isBox: { type: Boolean, default: true },
			checked: { type: Array, default: [] }
    },

		computed: {
			comDisplay() {
				if (this.isBox) return 'display: block';
				return 'display: inline-block';
			}
		},

    methods: {
			onCheckChange(selected) {
				this.$emit('change', selected);
			}
    }
  }
</script>