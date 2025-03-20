<template>
  <div class="router-view-warp">
    <router-view class="router-view"></router-view>
  </div>
</template>

<script setup></script>
<style lang="less" scoped>
  .router-view-warp {
    width: 100%;
    height: 100%;
    padding: 20px 20px;
  }
  .router-view {
    background-color: #fff;
    width: 100%;
    height: 100%;
    padding: 20px 20px;
  }
</style>
