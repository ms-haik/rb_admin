<template>
  <div>
    <el-upload class="upload-demo" action="" drag
      :auto-upload="false" :show-file-list="false" :on-change='changeUpload'>
      <img v-if="imgurl.length > 0" :src="imgurl">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">点击上传图片</div>
      <div class="el-upload__tip">支持png/jpg格式，最大支持5MB</div>
    </el-upload>
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="imgurl"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox">
          </vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { UploadImg } from '@/api/upload/index.js'
export default {
  props: ['radio', 'initUrl', 'callback'],
  data () {
    return {
      dialogVisible: false,
      imgurl: '',
      // 裁剪组件的基础配置option
      option: {
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpg', // 裁剪生成图片的格式
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 是否固定截图框大小
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // 防止重复提交
      loading: false
    }
  },
  mounted () {
    if (this.radio) {
      this.option.fixedNumber = [this.radio, 1]
    }
    if (this.initUrl) {
      this.imgurl = this.initUrl
    }
  },
  methods: {
    // 上传按钮   限制图片大小
    changeUpload (file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      // 上传成功后将图片地址赋值给裁剪框显示图片
      let This = this
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function (e) {
        let base64 = this.result
        This.imgurl = base64
        This.dialogVisible = true
      }
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish () {
      this.$refs.cropper.getCropBlob((data) => {
        let This = this
        this.loading = true
        // 上传服务器
        let reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onload = function (e) {
          let base64 = this.result
          UploadImg({
            base64: base64
          }).then((res) => {
            This.dialogVisible = false
            This.imgurl = res.link
            This.loading = false
            if (This.callback) {
              This.callback()
            }
          }).catch((err) => {
            console.log(err)
            This.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  text-align: center;
  img {
    width: 100%;
  }
}
.cropper-content {
  .cropper {
    width: auto;
    height: 300px;
  }
}
</style>
