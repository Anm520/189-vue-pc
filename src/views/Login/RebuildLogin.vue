<template>
  <div class="rebuildLogin">
    <div class="login_from_warp">
      <LoginFrom/>
    </div>

  </div>
</template>
<script setup>
  import LoginFrom from './login.vue'
</script>
<style scoped lang="less">
.rebuildLogin {
  width: 100%;
  height: 100%;
  background: url("@/assets/img/jin.jpg") no-repeat;
  background-size: cover;
  position: relative;

  .login_from_warp {
    position: absolute;
    right: 150px;
    top: 260px;
    width: 300px;
    height: 180px;
    //border: 1px solid red;
    background: rgba(255, 255, 255, .8);
    border-radius: 8px 8px;
    padding: 30px 30px;
  }
}
</style>