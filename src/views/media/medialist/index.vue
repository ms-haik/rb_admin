<template>
  <d2-container>
    <template slot="header">媒体资料管理</template>
    <el-row class="filter-area">
      <el-col :span="4">
        <el-select v-model="filter.type" clearable placeholder="请选择资源类型" @change="getData()">
          <el-option label="视频" :value="'video'"></el-option>
          <el-option label="截图" :value="'image'"></el-option>
          <el-option label="原画" :value="'original_image'"></el-option>
          <el-option label="压缩包" :value="'file'"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate()">创建媒体资源</el-button>
      </el-col>
    </el-row>
    <el-table :data="resourceList" style="width:100%;margin-top:20px;">
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源类型" align="center">
        <template slot-scope="scope">
          <span>{{ typeMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源链接" align="center">
        <template slot-scope="scope">
          <span><a :href="(scope.row.type === 'video' ? scope.row.video : scope.row.url)" target="_blank">{{ (scope.row.type === 'video' ? scope.row.video : scope.row.url) }}</a></span>
        </template>
      </el-table-column>
      <el-table-column label="资源备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="创建媒体资源"
      class="media-dialog"
      :visible.sync="dialogData.visible"
      width="30%">
      <el-form>
        <el-form-item label="选择资源类型">
          <el-select v-model="dialogData.type">
            <el-option label="视频" :value="'video'"></el-option>
            <el-option label="截图" :value="'image'"></el-option>
            <el-option label="原画" :value="'original_image'"></el-option>
            <el-option label="压缩包" :value="'file'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择语言">
          <el-radio :label="'cn'" v-model="dialogData.labels" name="language">中文</el-radio>
          <el-radio :label="'en'" v-model="dialogData.labels" name="language">英文</el-radio>
        </el-form-item>
        <el-form-item label="上传资源文件">
          <el-upload
            class="upload-media-file"
            :action="fileUploadAction"
            :on-success="dialogData.handleUploadSuccess"
            :multiple="false"
            :limit="1"
            :on-exceed="dialogData.handleExceed"
            :file-list="dialogData.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="dialogData.type === 'video'" label="上传视频封面">
          <Cropper ref="videoCover" :radio="1.86" :initUrl="''" :callback="dialogData.coverCallBack"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.remark" type="textarea" rows="2" resize="none" placeholder="请输入资源备注">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogData.visible = false">取 消</el-button>
        <el-button type="primary" @click="dialogData.confirmCreate()">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { createResource, deleteResource, searchResource } from '@/api/media/index.js'
import Cropper from '@/components/Cropper.vue'
export default {
  name: 'medialist',
  data () {
    return {
      filter: {
        type: 'video'
      },
      typeMap: {
        'video': '视频',
        'image': '截图',
        'original_image': '原画',
        'file': '压缩包'
      },
      resourceList: [],
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      dialogData: {
        visible: false,
        type: 'video'
      },
      fileUploadAction: process.env.VUE_APP_API + '/file/upload'
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData (page) {
      if (!page) {
        page = 0
      }
      searchResource({
        page: page,
        size: this.pageSize,
        ...this.filter
      }).then((res) => {
        this.resourceList = res.list
      })
    },
    handleCreate () {
      this.dialogData.handleUploadSuccess = (response, file, fileList) => {
        this.dialogData.url = response.link
      }

      this.dialogData.handleExceed = (files, filelist) => {
        this.$message.warning('只能上传单个文件')
      }

      this.dialogData.coverCallBack = () => {
        this.dialogData.videoCover = this.$refs.videoCover.imgurl
      }

      this.dialogData.confirmCreate = () => {
        if (this.dialogData.labels === '' || this.dialogData.labels === undefined) {
          this.$message.warning('请选择语言')
          return false
        }
        if (this.dialogData.url === '' || this.dialogData.url === undefined) {
          this.$message.warning('请上传资源文件')
          return false
        }
        if (this.dialogData.remark === '') {
          this.$message.warning('请填写资源备注')
          return false
        }
        if (this.dialogData.type === 'video' && this.dialogData.videoCover === '') {
          this.$message.warning('请上传视频封面')
          return false
        }
        let postArgs = {
          type: this.dialogData.type,
          remark: this.dialogData.remark,
          labels: this.dialogData.labels
        }
        switch (this.dialogData.type) {
          case 'video':
            postArgs.video = this.dialogData.url
            postArgs.url = this.dialogData.videoCover
            break
          default:
            postArgs.url = this.dialogData.url
            break
        }
        createResource(postArgs).then((res) => {
          this.resourceList.unshift(res)
          this.dialogData = { visible: false }
        })
      }

      this.dialogData.type = 'video'

      this.dialogData.visible = true
    },
    handleDelete (index, row) {
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource({
          id: row.id
        }).then(() => {
          this.data.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlePageChange (val) {
      this.currentPage = val
      this.getdata(val - 1)
    }
  },
  components: {
    Cropper
  }
}
</script>

<style lang="scss">
.media-dialog {
  .el-upload-dragger {
    width: 360px;
    height: 193px;
  }
}
</style>
