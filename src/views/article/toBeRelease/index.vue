<template>
  <d2-container>
    <template slot="header">待发布的文章</template>
    <el-row class="filter-area">
      <el-col :span="4">
        <el-input v-model="filter.key" placeholder="搜索文章标题" suffix-icon="el-icon-search" @change="filterList"></el-input>
      </el-col>
    </el-row>
    <el-table :data="data" style="width:100%;margin-top:20px;">
      <el-table-column label="ID" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面" width="200" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" class="cover-img">
        </template>
      </el-table-column>
      <el-table-column label="标题" width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.authorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ timeToStr(scope.row.created) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300" align="center">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            class="to-edit-link">编辑</el-link>
          <el-button
            size="mini"
            type="primary"
            @click="handleRelease(scope.$index, scope.row)">发布</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleTimeRelease(scope.$index, scope.row)">定时发布</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="定时发布"
      :visible.sync="dialogData.visible"
      width="30%">
      <el-date-picker
        v-model="dialogData.releaseTime"
        type="datetime"
        size="large"
        placeholder="选择发布日期时间">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogData.visible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTimeRelease">确 定</el-button>
      </span>
    </el-dialog>
    <template slot="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalNum"
        :current-page="currentPage"
        @current-change="handlePageChange">
      </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import { searchArticle, updateArticle } from '@/api/article/index.js'
export default {
  name: 'articletoberelease',
  data () {
    return {
      data: [],
      filter: {
        key: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      dialogData: {}
    }
  },
  mounted () {
    this.getdata()
  },
  methods: {
    getdata (page) {
      if (!page) {
        page = 0
      }
      searchArticle({
        page: page,
        size: this.pageSize,
        visible: 0,
        cache: 0,
        ...this.filter
      }).then((res) => {
        this.data = res.articleList
        if (page === 0) {
          this.totalNum = res.total
        }
      })
    },
    filterList () {
      this.getdata(0)
    },
    handleEdit (index, row) {
      this.$router.push({ name: 'articleedit', params: { id: row.id } })
    },
    handleRelease (index, row) {
      // 立即发布
      this.$confirm('确认发布该文章么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // releaseArticle({
        //   articleId: row.id,
        //   visible: 2,
        //   releaseTime: 0
        // }).then((res) => {
        //   this.data.splice(index, 1)
        //   this.$message({
        //     type: 'success',
        //     message: '发布成功!'
        //   })
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    handleTimeRelease (index, row) {
      // 定时发布
      this.dialogData = {
        index: index,
        articleId: row.id,
        visible: true,
        releaseTime: ''
      }
    },
    confirmTimeRelease () {
      if (this.dialogData.releaseTime === '') {
        this.$message.warning('定时发布必须选择发布日期')
        return false
      }
      // releaseArticle({
      //   articleId: this.dialogData.articleId,
      //   releaseTime: parseInt(new Date(this.dialogData.releaseTime).getTime() / 1000)
      // }).then((res) => {
      //   this.$message.success('定时发布成功')
      //   this.data.splice(this.dialogData.index, 1)
      //   this.dialogData = {}
      // })
    },
    handleDelete (index, row) {
      this.$confirm('此操作将删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateArticle({
          id: row.id,
          visible: -2,
          version: parseInt(new Date().getTime() / 1000)
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
    },
    timeToStr (timestamp) {
      timestamp = timestamp * 1000
      let dateObj = new Date(timestamp)
      let year = dateObj.getFullYear()
      let month = ('0' + (dateObj.getMonth() + 1)).substr(-2, 2)
      let date = ('0' + dateObj.getDate()).substr(-2, 2)
      let hour = ('0' + dateObj.getHours()).substr(-2, 2)
      let minute = ('0' + dateObj.getMinutes()).substr(-2, 2)
      let second = ('0' + dateObj.getSeconds()).substr(-2, 2)
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    }
  }
}
</script>

<style lang="scss" scoped>
  .cover-img {
    width: 80%;
    height: 100px;
    border-radius: 5px;
  }
  .to-edit-link {
    margin-right: 20px;
  }
</style>
