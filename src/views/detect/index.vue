<template>
  <div class="app-container">
    <!--Form-->
    <div class="form">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="新闻内容">
          <el-input v-model="form.desc" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onDetect">检测</el-button>
          <el-button @click="onEmpty">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider></el-divider>

    <!--Table-->
    <div class="display">
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
        :default-sort="{prop: 'create_time', order: 'descending'}"
        style="width: 100%"
        @filter-change="filterTagTable"
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
          prop="content"
          label="正文"
          show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="tag"-->
        <!--label="标签"-->
        <!--width="200">-->
        <!--<el-input v-model="input" placeholder="请输入内容"></el-input>-->
        <!--</el-table-column>-->
        <el-table-column
          fixed="right"
          width="200">
          <template #header>
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
          </template>
          <template #default="scope">
            <el-button @click="handleFavorites(scope.row)" type="text" size="small">
              <i :class="[scope.row.is_favorites?'el-icon-star-on':'el-icon-star-off']"></i>收藏
            </el-button>
            <el-button @click="handleDoubtful(scope.row)" type="text" size="small">
              <i :class="[scope.row.is_doubtful?'el-icon-warning':'el-icon-warning-outline']"></i>存疑
            </el-button>
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
        },
        hightlight: false,
        search: ""
      }
    },
    mounted() {
      this.setDefault()
      this.getNews()
    },
    methods: {
      setDefault() {
        this.pagination.pageSize = this.pagination.pageSizes[0]
      },
      getNews() {
        this.$store.dispatch('news/getNews').then((res) => {
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
      onDetect() {
        this.$store.dispatch('detect/detect', this.form.desc).then((res) => {
          let data = {
            'content': this.form.desc,
            'n_score': res[0][0].score,
            'f_score': res[0][1].score,
            'r_score': res[0][2].score
          }
          if (Math.max(data['n_score'], data['f_score'], data['r_score']) === data['n_score']) {
            data['label'] = '中立'
          } else if (Math.max(data['n_score'], data['f_score'], data['r_score']) === data['f_score']) {
            data['label'] = '虚假'
          } else if (Math.max(data['n_score'], data['f_score'], data['r_score']) === data['r_score']) {
            data['label'] = '真实'
          }
          data['create_time'] = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
          this.$store.dispatch('news/detectNews', data).then((res) => {
            data['news_id'] = res.data.news_id
            this.handleDetectNews(data)
            this.onEmpty()
            this.hightlight = true
            this.setCurrent(this.tableData[0])
            let _this = this
            setTimeout(function() {
              _this.setCurrent()
              _this.hightlight = false
            }, 5000)
          }).catch(() => {
            // MessageBox.confirm('模型正在加载中，请稍等。').then(() => {
            //   setTimeout(function() {
            //     this.onDetect()
            //   }, 5000);
            // })
          })
        }).catch(() => {
          MessageBox('模型正在加载中，请稍等。').then(() => {
            setTimeout(function() {
              this.onDetect()
            }, 5000)
          })
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
            this.$store.dispatch('news/deleteNews', { 'news_id': this.multipleSelection[item].news_id }).then((res) => {
              for (let tab_i in this.tableData) {
                if (this.tableData[tab_i].news_id === this.multipleSelection[item].news_id) {
                  this.tableData.splice(tab_i, 1)
                }
              }
              this.getNews()
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
        this.$refs.multipleTable.setCurrentRow(row);
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
      },
      handleFavorites(row) {
        this.$store.dispatch('news/favoriteNews', { 'news_id': row['news_id'] }).then((res) => {
          if (res.statusCode === 200) {
            this.getNews()
          }
        })
      },
      handleDoubtful(row) {
        this.$store.dispatch('news/doubtfulNews', { 'news_id': row['news_id'] }).then((res) => {
          if (res.statusCode === 200) {
            this.getNews()
          }
        })
      },
      handleDelete(row) {
        MessageBox.confirm('确定删除？', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('news/deleteNews', { 'news_id': row['news_id'] }).then((res) => {
            if (res.statusCode === 200) {
              this.getNews()
            }
          })
        })
      },
      filterTagTable(filters){
        console.log(filters)
        // if(filters.aStatus){
        //   this.listQuery.status = filters.aStatus[0]
        // }
        // this.getAll() // 筛选所选项下的所有数据，需要调用后端接口
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

