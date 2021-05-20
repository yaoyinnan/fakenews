<template>
  <div class="app-container">
    <!--Form-->
    <el-row>
      <el-col :span="8">
        <weiboDoughnutData></weiboDoughnutData>
      </el-col>
      <el-col :span="16">
        <weiboBarChart></weiboBarChart>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!--Table-->
    <el-row>
      <el-col :span="24">
        <div class="display">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            :default-sort="{prop: 'created_at', order: 'descending'}"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <!--<el-table-column-->
            <!--type="selection"-->
            <!--width="55">-->
            <!--</el-table-column>-->
            <el-table-column
              prop="create_time"
              label="发布日期"
              width="150"
              sortable>
              <template #default="scope">{{ scope.row.create_time }}</template>
            </el-table-column>
            <el-table-column
              label="关键词"
              width="150"
              sortable>
              <template #default="scope">{{keyword}}</template>
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
              prop="score"
              label="检测值"
              width="300"
              show-overflow-tooltip>
              <template #default="scope">
                <el-progress :percentage="scope.row.n_score * 100" :format="format_n" class="el-bg-inner-n">
                </el-progress>
                <el-progress :percentage="scope.row.f_score * 100" :format="format_f" class="el-bg-inner-f">
                </el-progress>
                <el-progress :percentage="scope.row.r_score * 100" :format="format_r" class="el-bg-inner-r">
                </el-progress>
              </template>
            </el-table-column>
            <el-table-column
              prop="topics"
              label="话题"
              width="300"
              sortable>
              <template #default="scope">{{ scope.row.topics }}</template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="正文">
            </el-table-column>
          </el-table>

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
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import parseTime from '../../utils/index'
  import weiboBarChart from '../../components/Charts/weiboBarChart'
  import weiboDoughnutData from '../../components/Charts/weiboDoughnutChart'

  export default {
    components: {
      weiboBarChart,
      weiboDoughnutData
    },
    data() {
      return {
        is_default: true,
        keyword_id: null,
        keyword: '1',
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
        }

      }
    },
    mounted() {
      this.setDefault()
    },
    methods: {
      setDefault() {
        this.is_default = false
        if(!(this.$route.query.keyword && this.$route.query.keyword_id)){
          this.$router.push({
            path: '/autoDetect/autoDetect',
          })
        }
        else{
          this.pagination.pageSize = this.pagination.pageSizes[0]
          this.keyword = this.$route.query.keyword
          this.keyword_id = this.$route.query.keyword_id
          this.getNews()
        }
        this.is_default = true
      },
      getNews() {
        this.$store.dispatch('keyword/getKeywordNews', { 'keyword_id': this.$route.query.keyword_id }).then((res) => {
          this.allTableData = res.data.news_list
          this.getPage()
        })
      },
      getPage() {
        let currentPage = this.pagination.currentPage
        let start_i = (currentPage - 1) * this.pagination.pageSize
        let end_i = currentPage * this.pagination.pageSize
        this.tableData = JSON.parse(JSON.stringify(this.allTableData.slice(start_i, end_i)))
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
      handleDetectNews(data) {
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
  .keyword {
    color: #909399;
  }

  .tag {
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

