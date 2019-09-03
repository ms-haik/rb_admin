<template>
  <div id="app">
    <!-- <router-view :key="$route.fullPath"/> -->
    <!-- <router-view :key="$route.path"/> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
</style>
