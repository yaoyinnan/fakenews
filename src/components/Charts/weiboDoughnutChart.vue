<template>
  <div class="DoughnutChart"></div>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme

  export default {
    name: 'DoughnutChart',
    data() {
      return {
        doughnut_chart: {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: this.$route.query.keyword,
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center',
                normal: {
                  show: true,
                  position: 'center',
                  formatter: null,
                  rich: {
                    total: {
                      fontSize: 26,
                      color: '#d6cfcb'
                    },
                    active: {
                      fontSize: 14,
                      color: '#6c7a89',
                      lineHeight: 30
                    }
                  }
                },
                emphasis: {//中间文字显示
                  show: true
                }
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                {
                  value: null,
                  name: '中立',
                  itemStyle: {
                    color: '#98a8f1'
                  }
                },
                {
                  value: null,
                  name: '虚假',
                  itemStyle: {
                    color: '#98DAE3'
                  }
                },
                {
                  value: null,
                  name: '真实',
                  itemStyle: {
                    color: '#FAE397'
                  }
                }
              ]
            }
          ]
        }
      }
    },
    mounted() {
      this.getWeiboDoughnutChart()
    },
    // 每次销毁前清空
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      getWeiboDoughnutChart() {
        this.$store.dispatch('charts/weiboDoughnutChart', { 'keyword_id': this.$route.query.keyword_id }).then((res) => {
          let weibo_doughnut_data = res.data.weibo_doughnut_data
          this.doughnut_chart.series[0].data[0].value = weibo_doughnut_data.n_count
          this.doughnut_chart.series[0].data[1].value = weibo_doughnut_data.f_count
          this.doughnut_chart.series[0].data[2].value = weibo_doughnut_data.r_count
          let total = weibo_doughnut_data.n_count + weibo_doughnut_data.f_count + weibo_doughnut_data.r_count
          this.doughnut_chart.series[0].label.normal.formatter = '{active|' + this.$route.query.keyword + '}' + '\n\r' + '{total|' + total + '}'
          this.initChart()
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'light')
        this.chart.setOption(this.doughnut_chart)
        let _this = this
        window.onresize = function() {
          _this.chart.resize()
        }
      }
    }
  }
</script>

<style scoped>
  .DoughnutChart {
    width: 100%;
    height: 300px;
    margin: 0 auto
  }

</style>
