<template>
  <div class="article-preview">
    <div class="title">{{ title }}</div>
    <div class="text" v-html="text"></div>
  </div>
</template>

<script>
export default {
  props: ['title', 'text']
}
</script>

<style lang="scss">
.article-preview {
  width: 100%;
  max-width: 784px;
  margin: 0 auto;
  padding: 10px 20px;
  font-size: 16px;
  min-height: 848px;
  background-color: #111111;
  color: #AAAAAA;
  box-sizing: border-box;
  .title {
    color: #B8B2A2;
    text-align: center;
  }
  .text {
    margin-top: 30px;
    font-size: 16px;
    color: #AAAAAA;
    p {
      margin-top: 20px;
      line-height: 1.7;
    }
    img {
      max-width: 100%;
      display: block;
      margin: 10px auto;
    }
    .fr-img-wrap>span { // 图片标题
      margin: auto;
      display: block;
      padding: 5px 5px 10px;
      font-size: 14px;
      font-weight: 400;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-opacity: .9;
      -moz-opacity: .9;
      opacity: .9;
      width: 100%;
      text-align: center;
    }
    video {
      display: block;
      margin: 10px auto;
    }
    blockquote {
      border-left: solid 2px #5e35b1;
      margin-left: 0;
      padding-left: 5px;
      color: #5e35b1;
    }
    a {
      color: #1A73E8;
      cursor: pointer;
    }
  }
}
</style>
