<template>
  <d2-container class="page">
    <div class="welcome">
      <div><img src="http://admin.rnbtcg.com/img/logo.png"></div>
      <div>欢迎使用红与蓝管理端</div>
      <div><a href="http://www.rnbtcg.com" target="_blank">前往红与蓝网站</a></div>
    </div>
  </d2-container>
</template>

<script>
</script>

<style lang="scss" scoped>
.page {
  .welcome {
    padding: 50px;
    text-align: center;
    font-size: 40px;
    letter-spacing: 2px;
    .logo {
      width: 600px;
      margin-bottom: 30px;
    }
    >div {
      margin-bottom: 40px;
      a {
        color:darkblue;
        text-decoration: underline !important;
        font-size: 20px;
      }
    }
  }
  .page__logo {
    width: 120px;
  }
  .page__btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    span {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>
