<template>
  <d2-container>
    <template slot="header">待发布的文章</template>
    <el-row class="filter-area">
      <el-col :span="4">
        <el-select v-model="filter.status" clearable placeholder="请选择文章状态" @change="getdata()">
          <el-option label="全部" :value="''"></el-option>
          <el-option label="待发布" :value="2"></el-option>
          <el-option label="已发布" :value="1"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="filter.title" placeholder="搜索文章标题" suffix-icon="el-icon-search" @change="getdata()"></el-input>
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
          <img v-if="scope.row.picture !== ''" :src="scope.row.picture" class="cover-img">
        </template>
      </el-table-column>
      <el-table-column label="标题" width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ timeToStr(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300" align="center">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            class="to-edit-link">编辑</el-link>
          <el-button v-if="scope.row.status === 2"
            size="mini"
            type="primary"
            @click="handleRelease(scope.$index, scope.row)">发布</el-button>
          <el-button v-if="scope.row.status === 1"
            size="mini"
            type="primary"
            @click="handleCancelRelease(scope.$index, scope.row)">撤回</el-button>
        </template>
      </el-table-column>
    </el-table>
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
import { searchArticle, updateArticleStatus } from '@/api/article/index.js'
export default {
  name: 'articlelist',
  data () {
    return {
      data: [],
      filter: {
        status: ''
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
        ...this.filter
      }).then((res) => {
        this.data = res.list
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
      this.$confirm('确认发布该文章么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateArticleStatus({
          id: row.id,
          status: 1
        }).then((res) => {
          this.data.splice(index, 1)
          this.$message({
            type: 'success',
            message: '发布成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    handleCancelRelease (index, row) {
      this.$confirm('确认撤回该文章么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateArticleStatus({
          id: row.id,
          status: 2
        }).then((res) => {
          this.data.splice(index, 1)
          this.$message({
            type: 'success',
            message: '撤回成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作失败'
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
