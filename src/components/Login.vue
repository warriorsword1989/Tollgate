<template>
  <div v-bind:style="bgDivStyle">
    <video class="bgVideo" poster="../assets/firstframes.png">
    </video>
  </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            const standardWidth = 1920;
            const width = document.documentElement.clientWidth;
            let widthPercent = 1;
            if (width < 1920) {
                widthPercent = width / standardWidth;
            }
            return {
                bgDivStyle: {
                    heightStyle : `970 * ${widthPercent}px`,
                    widthStyle : `1920 * ${widthPercent}px`,
                    position : 'fixed'
                }
            }
        }
    }
</script>

<style scoped>
  .bgVideo{
    overflow: hidden;
    object-fit: fill;
  }
</style>
