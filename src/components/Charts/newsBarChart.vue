<template>
  <div class="BarChart"></div>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme

  export default {
    name: 'BarChart',
    data() {
      return {
        bar_chart: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: 'rgba(220, 220, 220, 0.3)'
              }
            },
            backgroundColor: 'rgba(50,50,50,0.3)'
          },
          legend: {
            data: ['中立', '虚假', '真实', '总量']
          },
          grid: {
            top: '15%',
            right: '5%',
            bottom: '5%',
            left: '5%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: [],
            axisLabel: {
              interval: 3,
              margin: 15
            },
            axisLine:{
              lineStyle: {
                color: "rgba(67, 81, 121)"
              },
              show:false
            },
            axisTick:{ //x轴刻度线
              show:false
            },
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              margin: 15
            },
            splitLine: {
              lineStyle: {
                color: "rgba(214, 220, 224, 0.5)"
              },
              // show: false
            },
            axisTick:{ //y轴刻度线
              show:false
            },
            axisLine:{ //y轴
              show:false
            },
            // show:false
          }],
          series: [
            {
              name: '中立',
              type: 'bar',
              stack: '标签',
              barWidth: '30%',
              // showBackground: true,
              // backgroundStyle: {
              //   opacity: 0.1
              // },
              itemStyle: {
                // opacity: 0.7,
                color:'#98a8f1'
              },
              emphasis: {
                focus: 'series'
              },
              data: []
            },
            {
              name: '虚假',
              type: 'bar',
              stack: '标签',
              barWidth: '30%',
              // showBackground: true,
              // backgroundStyle: {
              //   opacity: 0.1
              // },
              itemStyle: {
                // opacity: 0.7,
                color:'#98DAE3'
              },
              emphasis: {
                focus: 'series'
              },
              data: []
            },
            {
              name: '真实',
              type: 'bar',
              stack: '标签',
              barWidth: '30%',
              // showBackground: true,
              // backgroundStyle: {
              //   opacity: 0.1
              // },
              itemStyle: {
                // opacity: 0.7,
                color:'#FAE397'
              },
              emphasis: {
                focus: 'series'
              },
              data: []
            }
          ]
        }
      }
    },
    mounted() {
      this.getNewsBarChart()
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
      getNewsBarChart() {
        this.$store.dispatch('charts/newsBarChart').then((res) => {
          let news_bar_data = res.data.news_bar_data
          this.bar_chart.xAxis[0].data = news_bar_data.create_time
          this.bar_chart.series[0].data = news_bar_data.n_count
          this.bar_chart.series[1].data = news_bar_data.f_count
          this.bar_chart.series[2].data = news_bar_data.r_count
          this.initChart()
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'light')
        this.chart.setOption(this.bar_chart)
        let _this = this;
        window.onresize = function () {
          _this.chart.resize();
        }
      }
    }
  }
</script>

<style scoped>
  .BarChart {
    width: 100%;
    height: 300px;
    margin:0 auto;
    /*background: rgb(67, 81, 121);*/
  }
</style>
