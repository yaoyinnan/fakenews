<template>
  <div class="app-container">
    <!--Form-->
    <div class="form">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="辟谣内容">
          <el-input v-model="form.desc" type="textarea"/>
        </el-form-item>
        <el-form-item label="真假性">
          <el-select v-model="form.region" placeholder="请选择新闻真假性">
            <el-option label="中立" value="中立"/>
            <el-option label="虚假" value="虚假"/>
            <el-option label="真实" value="真实"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="onEmpty">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <!--Table-->
    <div class="display">
      <el-button type="danger" @click="deleteReview">删除</el-button>

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
        :default-sort="{prop: 'create_time', order: 'descending'}"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="日期"
          width="150"
          sortable>
          <template #default="scope">{{ scope.row.create_time }}</template>
        </el-table-column>
        <el-table-column
          prop="label"
          label="真假性"
          width="100"
          sortable
          :filters="[{ text: '中立', value: '中立' }, { text: '虚假', value: '虚假' }, { text: '真实', value: '真实' }]"
          :filter-method="filterLabel"
          filter-placement="bottom-end">
          <template #default="scope">
            <el-tag
              :type="labelColor[scope.row.label]"
              disable-transitions>{{scope.row.label}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="正文"
          show-overflow-tooltip>
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
          desc: '',
          region: ''
        },
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
          pageSizes: [5, 10, 25, 50, 100, 250, 500, 1000],
          pageSize: null,
          pageCount: 11
        }

      }
    },
    mounted() {
      this.setDefault()
      this.getReview()
    },
    methods: {
      setDefault() {
        this.pagination.pageSize = this.pagination.pageSizes[0]
      },
      getReview() {
        this.$store.dispatch('review/getReview').then((res) => {
          this.allTableData = res.data.review_list
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
          'label': this.form.region,
          'create_time': parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
        }
        this.$store.dispatch('review/addReview', data).then((res) => {
          data['review_id'] = res.review_id
          this.handleSubmitReview_id(data)
        })
      },
      onEmpty() {
        this.form.desc = ''
        this.form.region = ''
      },
      deleteReview() {
        MessageBox.confirm('确定删除？', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let item in this.multipleSelection) {
            this.$store.dispatch('review/deleteReview', { "review_id": this.multipleSelection[item].review_id }).then((res) => {
              for (let tab_i in this.tableData) {
                if (this.tableData[tab_i].review_id === this.multipleSelection[item].review_id) {
                  this.allTableData.splice(tab_i, 1)
                  this.tableData.splice(tab_i, 1)
                  this.getPage()
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
      handleSubmitReview_id(data) {
        this.allTableData.unshift(data)
        this.pagination.currentPage = 1
        this.getPage()
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

