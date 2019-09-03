<template>
  <d2-container class="article-edit">
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <div class="article-input">
            <el-input v-model="title" placeholder="请输入文章标题(必填)"><template slot="prepend">标题</template></el-input>
          </div>
          <froala :tag="'div'" :config="config" v-model="text"></froala>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <articlePreview :title="title" :author="author" :text="text" />
        </div>
      </el-col>
    </el-row>
    <template slot="footer">
      <el-button type="primary" @click="save()">保存</el-button>
      <el-button v-if="visible === 2" type="primary" @click="cancelRelease()">撤回移至待发布</el-button>
      <el-button v-else type="primary" @click="release()">发布</el-button>
    </template>
  </d2-container>
</template>

<script>
import jquery from 'jquery'
import articlePreview from '@/components/ArticlePreview.vue'
// import Cropper from '@/components/Cropper.vue'
import { createArticle, getArticle, updateArticle, updateArticleStatus } from '@/api/article/index.js'
export default {
  props: {
    id: Number
  },
  data () {
    return {
      articleId: '',
      cover: '',
      title: '',
      authorName: '',
      authorId: '',
      author: '',
      text: '',
      goodsName: '',
      goodsId: '',
      visible: 0,
      config: {
        editorClass: 'richtext',
        autofocus: true,
        widthMax: 744,
        height: 600,
        enter: jquery.FroalaEditor.ENTER_P,
        toolbarButtons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'fontSize',
          // 'color',
          '|',
          'paragraphFormat',
          'align',
          'formatOL',
          'formatUL',
          // 'outdent',
          // 'indent',
          'quote',
          '|',
          // '-',
          'insertLink',
          'insertImage',
          'insertVideo',
          'embedly',
          '|',
          'specialCharacters',
          'insertHR',
          '|',
          'undo',
          'redo',
          'clearFormatting',
          'fullscreen'
        ],
        placeholderText: '请输入内容',
        language: 'zh_cn', // 语言
        imageUploadURL: process.env.VUE_APP_API + '/file/upload', // 上传url
        imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
        imagePaste: false,
        imageAddNewLine: true,
        imageMaxSize: 100 * 1024 * 1024,
        imageDefaultWidth: 700,
        videoUploadURL: process.env.VUE_APP_API + '/file/upload',
        videoMaxSize: 500 * 1024 * 1024,
        fileUploadURL: process.env.VUE_APP_API + '/file/upload', // 上传url 更多上传介绍 请访问https://www.froala.com/wysiwyg-editor/docs/options
        quickInsertButtons: ['image', 'table', 'ul', 'ol', 'hr'], // 快速插入项
        pastePlain: true,
        // toolbarVisibleWithoutSelection: true, // 是否开启 不选中模式
        // disableRightClick: true, // 是否屏蔽右击
        colorsHEXInput: false, // 关闭16进制色值
        toolbarSticky: false, // 操作栏是否自动吸顶
        zIndex: 2,
        events: {
          // // 初始化方法
          // 'froalaEditor.initialized': function (e, editor) {
          //   this.editor = editor
          // },
          // // 内容改变方法
          // 'froalaEditor.contentChanged': function (e, editor) {
          //   // 可以向父组件传递数据
          // }
        }
      }
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    id: 'getData'
  },
  methods: {
    getData () {
      if (this.id) {
        this.articleId = this.id
        getArticle({
          id: this.articleId
        }).then((res) => {
          this.title = res.article.title
          this.authorId = res.article.authorId
          this.goodsId = res.article.itemId
          this.text = res.article.content
          this.visible = res.article.visible
        })
      }
    },
    searchAuthor (queryString, cb) {
      // searchUser({
      //   nickname: queryString
      // }).then((res) => {
      //   let results = []
      //   res.forEach(element => {
      //     element.value = element.nickname
      //     results.push(element)
      //   })
      //   cb(results)
      // })
    },
    handleSelectAuthor (item) {
      this.authorName = item.nickname
      this.authorId = item.id
      this.author = item.nickname
    },
    coverCallBack () {
      this.cover = this.$refs.articlecover.imgurl
    },
    save () {
      if (this.id) { // 修改更新
        let postArgs = {
          id: this.articleId,
          title: this.title,
          itemId: this.goodsId,
          authorId: this.authorId,
          content: this.text,
          cover: this.cover,
          version: parseInt(new Date().getTime() / 1000)
        }
        updateArticle(postArgs).then((res) => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
            center: true
          })
        })
      } else { // 创建文章
        let postArgs = {
          title: this.title,
          itemId: this.goodsId,
          authorId: this.authorId,
          content: this.text,
          cover: this.cover,
          visible: 0
        }
        createArticle(postArgs).then((res) => {
          this.articleId = res.article.id
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
            center: true
          })
        })
      }
    },
    release () {
      this.$confirm('文章将被发布, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.articleId && this.articleId !== '') {
          // releaseArticle({
          //   articleId: this.articleId,
          //   releaseTime: 0,
          //   visible: 2
          // }).then((res) => {
          //   this.visible = 2
          //   this.$message({
          //     type: 'success',
          //     message: '发布成功!'
          //   })
          // })
        } else {
          let postArgs = {
            title: this.title,
            itemId: this.goodsId,
            authorId: this.authorId,
            content: this.text,
            cover: this.cover,
            visible: 2
          }
          createArticle(postArgs).then((res) => {
            this.articleId = res.article.id
            this.visible = 2
            this.$message({
              showClose: true,
              message: '发布成功',
              type: 'success',
              center: true
            })
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    cancelRelease () {
      this.$confirm('文章将移至待发布状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // cancelReleaseArticle({
        //   articleId: this.articleId
        // }).then((res) => {
        //   this.visible = 0
        //   this.$message({
        //     type: 'success',
        //     message: '文章已下线，移至待发布!'
        //   })
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作失败'
        })
      })
    }
  },
  components: {
    // Cropper,
    articlePreview
  }
}
</script>

<style lang="scss">
.article-edit {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 91px;
    display: block;
  }
  .article-input {
    margin-top: 10px;
  }
  .richtext {
    margin-top: 10px;
    font-size: 16px;
  }
  a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
    background: white !important;
  }
  p[data-f-id="pbf"] {
    position: absolute;
    top: -99999999px;
    opacity: 0;
  }
}
</style>
