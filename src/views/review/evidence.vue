<template>
  <div class="app-container">
    <!--Form-->
    <div class="form">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="证据内容">
          <el-input v-model="form.desc" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交证据</el-button>
          <el-button @click="onEmpty">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <!--Table-->
    <div class="display">
      <!--<el-tag v-if="is_default" class="tag">{{keyword}}</el-tag>-->
      <!--<el-tag v-if="is_default" class="tag">{{allTableData.length}}</el-tag>-->
      <el-button type="danger" @click="deleteNews">删除</el-button>

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
        :default-sort="{prop: 'created_at', order: 'descending'}"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="发布日期"
          width="150"
          sortable>
          <template #default="scope">{{ scope.row.create_time }}</template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="证据">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template #default="scope">
            <el-button @click="handleDelete(scope.row)" type="text" size="small">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import parseTime from '../../utils/index'

  export default {
    data() {
      return {
        form: {
          desc: ''
        },
        is_default: true,
        review_id: null,
        total_detected: null,
        allTableData: [],
        tableData: [],
        multipleSelection: [],
        labelColor: {
          '中立': 'info',
          '虚假': 'danger',
          '真实': 'primary'
        },
        pagination: {
          currentPage: 1,
          pageSizes: [25, 50, 100, 250, 500, 1000],
          pageSize: null,
          pageCount: 11
        },
        hightlight: false
      }
    },
    mounted() {
      this.setDefault()
      this.getEvidence()
    },
    methods: {
      setDefault() {
        this.is_default = false
        this.pagination.pageSize = this.pagination.pageSizes[0]
        this.review_id = this.$route.query.review_id
        this.is_default = true
      },
      getEvidence() {
        this.$store.dispatch('evidence/getEvidence', { 'review_id': this.$route.query.review_id }).then((res) => {
          this.allTableData = res.data.evidence_list
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
          'content': this.form.desc,
          'review_id': this.review_id,
          'create_time': parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
        }
        this.$store.dispatch('evidence/addEvidence', data).then((res) => {
          data['evidence_id'] = res.data.evidence_id
          this.handleSubmitEvidence_id(data)
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
        this.form.desc = ''
      },
      deleteNews() {
        MessageBox.confirm('确定删除？', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let item in this.multipleSelection) {
            this.$store.dispatch('evidence/deleteEvidence', { 'evidence_id': this.multipleSelection[item].evidence_id }).then((res) => {
              for (let tab_i in this.tableData) {
                if (this.tableData[tab_i].review_id === this.multipleSelection[item].review_id) {
                  this.tableData.splice(tab_i, 1)
                }
              }
              this.getEvidence()
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
      handleSubmitEvidence_id(data) {
        this.allTableData.unshift(data)
        this.pagination.currentPage = 1
        this.getPage()
      },
      handleDelete(row) {
        MessageBox.confirm('确定删除？', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('evidence/deleteEvidence', { 'evidence_id': row['evidence_id'] }).then((res) => {
            if (res.statusCode === 200) {
              this.getEvidence()
            }
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
  .keyword {
    color: #909399;
  }

  .tag{
    margin-right: 10px;
  }

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

