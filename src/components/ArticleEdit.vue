<template>
  <d2-container class="article-edit">
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <div class="article-input">
            <el-input v-model="title" placeholder="请输入文章标题(必填)"><template slot="prepend">标题</template></el-input>
          </div>
          <div class="article-input">
            <el-input v-model="author" placeholder="请输入作者"><template slot="prepend">作者</template></el-input>
          </div>
          <div class="article-input">
            <el-input v-model="video" placeholder="第三方视频链接"><template slot="prepend">视频链接</template></el-input>
          </div>
          <div class="article-input">
            <el-input v-model="code" type="textarea" placeholder="请输入可复制字符串">
              <template slot="prepend">可复制字符串</template>
            </el-input>
          </div>
          <div class="article-input">
            <el-row style="margin-bottom: 20px;">
              <el-col :span="4" :offset="2"><span>文章封面图</span></el-col>
              <el-col :span="6">
                <Cropper ref="articlepicture" :radio="1.3" :initUrl="picture" :callback="pictureCallBack"/>
              </el-col>
            </el-row>
          </div>
          <froala :tag="'div'" :config="config" v-model="text"></froala>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <div class="article-input">
            <el-row>
              <el-col :offset="1" :span="12">
                <el-form @submit.native.prevent label-position="left">
                  <el-form-item label="文章权重" label-width="80px">
                    <el-input v-model="weight" placeholder="请填写数字(默认权重为10)"></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <div class="article-input">
            <el-row>
              <el-col :offset="1">
                <el-form @submit.native.prevent label-position="top">
                  <el-form-item label="选择文章标签" label-width="100px">
                    <el-checkbox-group v-model="labels">
                      <el-checkbox v-for="(item, index) in allLabels" :key="index" :label="'' + item.id" name="label">{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <articlePreview :text="text" />
        </div>
      </el-col>
    </el-row>
    <template slot="footer">
      <el-button type="primary" @click="save()">保存</el-button>
    </template>
  </d2-container>
</template>

<script>
import jquery from 'jquery'
import articlePreview from '@/components/ArticlePreview.vue'
import Cropper from '@/components/Cropper.vue'
import { createArticle, getArticle, updateArticle, getLabels } from '@/api/article/index.js'
export default {
  props: ['id'],
  data () {
    return {
      articleId: '',
      title: '',
      author: '',
      text: '',
      picture: '',
      code: '',
      video: '',
      weight: 10,
      labels: [],
      allLabels: [],
      config: {
        editorClass: 'richtext',
        autofocus: true,
        widthMax: 744,
        heightMin: 600,
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
    this.getLabelsList()
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
          this.title = res.title
          this.author = res.author
          this.text = res.content
          this.picture = res.picture
          this.code = res.code
          this.video = res.video
          this.$refs.articlepicture.imgurl = res.picture
          this.weight = res.weight || 10
          if (res.labels && res.labels !== '') {
            this.labels = res.labels.split(',')
          }
        })
      }
    },
    pictureCallBack () {
      this.picture = this.$refs.articlepicture.imgurl
    },
    getLabelsList () {
      getLabels({ page: 0, size: 1000 })
        .then((res) => {
          this.allLabels = res
        })
    },
    save () {
      if (this.articleId) { // 修改更新
        let postArgs = {
          id: this.articleId,
          title: this.title,
          author: this.author,
          content: this.text,
          picture: this.picture,
          code: this.code,
          video: this.video,
          weight: this.weight,
          labels: this.labels.length > 0 ? this.labels.join(',') : ''
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
          author: this.author,
          content: this.text,
          picture: this.picture,
          code: this.code,
          video: this.video,
          weight: this.weight,
          labels: this.labels.length > 0 ? this.labels.join(',') : ''
        }
        createArticle(postArgs).then((res) => {
          this.articleId = res.id
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
            center: true
          })
        })
      }
    }
  },
  components: {
    Cropper,
    articlePreview
  }
}
</script>

<style lang="scss">
.article-edit {
  .el-upload-dragger {
    width: 300px;
    height: 230px;
  }
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
    .fr-element {
      >p {
        margin-top: 0;
        margin-bottom: 20px;
        line-height: 1.7
      }
    }
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
