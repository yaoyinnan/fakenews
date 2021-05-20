<template>
  <div class="app-container">
    <!--Form-->
    <el-row>
      <el-col :span="24">
        <div class="form">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="关键词">
              <el-input v-model="form.keyword"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">提交</el-button>
              <el-button @click="onEmpty">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!--Table-->
    <el-row>
      <el-col :span="24">
        <div class="display">
          <el-button type="danger" @click="deleteKeyword">删除</el-button>

          <el-pagination
            background
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.currentPage"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            :pager-count="pagination.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="allTableData.length">
          </el-pagination>

          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            :highlight-current-row="hightlight"
            :default-sort="{prop: 'update_time', order: 'descending'}"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="创建时间"
              width="150"
              sortable>
              <template #default="scope">{{ scope.row.create_time }}</template>
            </el-table-column>
            <el-table-column
              prop="update_time"
              label="更新时间"
              width="150"
              sortable>
              <template #default="scope">{{ scope.row.update_time }}</template>
            </el-table-column>
            <el-table-column
              prop="total"
              label="新闻数目"
              width="150"
              sortable>
              <template #default="scope">{{ scope.row.total }}</template>
            </el-table-column>
            <el-table-column
              prop="total_detected"
              label="已检测数目"
              width="150"
              sortable>
              <template #default="scope">{{ scope.row.total_detected }}</template>
            </el-table-column>
            <el-table-column
              prop="keyword"
              label="关键词">
              <template #default="scope">{{ scope.row.keyword}}</template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template #default="scope">
                <el-button @click="handleItem(scope.row)" type="text" size="small">
                  <i class="el-icon-folder-opened"></i>查看
                </el-button>
                <el-button @click="handleUpdate(scope.row)" type="text" size="small">
                  <i class="el-icon-refresh"></i>更新
                </el-button>
                <el-button @click="handleDelete(scope.row)" type="text" size="small">
                  <i class="el-icon-delete"></i>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import parseTime from '../../utils/index'

  export default {
    data() {
      return {
        form: {
          keyword: ''
        },
        allTableData: [],
        tableData: [],
        multipleSelection: [],
        pagination: {
          currentPage: 1,
          pageSizes: [10, 25, 50, 100, 250, 500, 1000],
          pageSize: null,
          pageCount: 11
        },
        hightlight: false
      }
    },
    mounted() {
      this.setDefault()
      this.getKeyword()
    },
    methods: {
      setDefault() {
        this.pagination.pageSize = this.pagination.pageSizes[0]
      },
      getKeyword() {
        this.$store.dispatch('keyword/getKeyword').then((res) => {
          this.allTableData = res.data.keyword_list
          this.getPage()
        })
      },
      getPage() {
        let currentPage = this.pagination.currentPage
        let start_i = (currentPage - 1) * this.pagination.pageSize
        let end_i = currentPage * this.pagination.pageSize
        this.tableData = JSON.parse(JSON.stringify(this.allTableData.slice(start_i, end_i)))
      },
      submit() {
        let data = {
          'keyword': this.form.keyword,
          'create_time': parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
        }
        this.$store.dispatch('keyword/addKeyword', data).then((res) => {
          data['keyword_id'] = res.data.keyword_id
          data['update_time'] = data['create_time']
          data['total'] = 0
          data['total_detected'] = 0
          this.handleSubmitKeyword_id(data)
          this.hightlight = true
          this.setCurrent(this.tableData[0])
          let _this = this
          setTimeout(function() {
            _this.setCurrent()
            _this.hightlight = false
          }, 5000)
        })
      },
      onEmpty() {
        this.form.keyword = ''
      },
      deleteKeyword() {
        MessageBox.confirm('确定删除？', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let item in this.multipleSelection) {
            this.$store.dispatch('keyword/deleteKeyword', { 'keyword_id': this.multipleSelection[item].keyword_id }).then((res) => {
              for (let tab_i in this.tableData) {
                if (this.tableData[tab_i].keyword_id === this.multipleSelection[item].keyword_id) {
                  this.allTableData.splice(tab_i, 1)
                  this.tableData.splice(tab_i, 1)
                  this.getKeyword()
                }
              }
            })
          }
        })
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      filterLabel(value, row) {
        return row.label === value
      },
      setCurrent(row) {
        this.$refs.multipleTable.setCurrentRow(row)
      },
      format_n(p) {
        return '中立：' + (p / 100).toFixed(10)
      },
      format_f(p) {
        return '虚假：' + (p / 100).toFixed(10)
      },
      format_r(p) {
        return '真实：' + (p / 100).toFixed(10)
      },
      handleSizeChange(page_size) {
        this.pagination.pageSize = page_size
        this.pagination.currentPage = 1
        this.getPage()
      },
      handleCurrentChange(currentPage) {
        let start_i = (currentPage - 1) * this.pagination.pageSize
        let end_i = currentPage * this.pagination.pageSize
        this.tableData = JSON.parse(JSON.stringify(this.allTableData.slice(start_i, end_i)))
      },
      handleSubmitKeyword_id(data) {
        this.allTableData.unshift(data)
        this.pagination.currentPage = 1
        this.getPage()
      },
      handleItem(row) {
        this.$router.push({
          path: '/autoDetectItem',
          query: { 'keyword': row.keyword, 'keyword_id': row.keyword_id }
        })
      },
      handleUpdate(row) {
        MessageBox.confirm('是否要爬取最新的新闻？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            'keyword': row.keyword,
            'create_time': parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
          }
          this.$store.dispatch('keyword/addKeyword', data).then((res) => {
            this.getKeyword()
            this.hightlight = true
            this.setCurrent(row)
            let _this = this
            setTimeout(function() {
              _this.setCurrent()
              _this.hightlight = false
            }, 5000)
          })
        })
      },
      handleDelete(row) {
        MessageBox.confirm('确定删除？', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('keyword/deleteKeyword', { 'keyword_id': row['keyword_id'] }).then((res) => {
            this.getKeyword()
          })
        })
      }
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

<style>
  .el-form-item__content {
    margin-right: 60px;
  }

  .el-textarea__inner {
    height: 120px;
    padding: 10px 15px;
  }

  .display {
    margin: 20px 50px;
  }

  .pagination {
    margin: 30px 0;
    float: right;
  }

  .el-progress-bar {
    padding-right: 150px;
    margin-right: -145px;
  }

  .el-progress-bar__inner {
    background-color: unset;
    color: #1f2d3d;
  }

  /*.el-bg-inner-n, .el-bg-inner-f, .el-bg-inner-r {*/
  /*}*/

  .el-bg-inner-n .el-progress-bar__inner {
    /*background-image: linear-gradient(to right, #a88cfa, #dcd5fe);*/
    background-image: linear-gradient(to right, #dcd5fe, #a88cfa);
  }

  .el-bg-inner-f .el-progress-bar__inner {
    background-image: linear-gradient(to right, #a88cfa, #dcd5fe);
  }

  .el-bg-inner-r .el-progress-bar__inner {
    background-image: linear-gradient(to right, #a88cfa, #dcd5fe);
  }

  .label {
    margin: 0;
    font-size: 10px;
  }

  .el-progress__text {
    font-size: 10px !important;
  }
</style>

