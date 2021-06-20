import { Doughnut } from '../../assets/js/BaseCharts'

export default {
  extends: Doughnut,
  mounted () {
    this.renderChart({
      labels: ['예약대기', '이용중', '이용완료', '예약취소'],
      datasets: [
        {
          backgroundColor: [
            '#ffc000',
            '#70ad47',
            '#954eca',
            '#ed7d31'
          ],
          data: [48, 71, 80, 4]
        }
      ],
    }, {
        
        responsive: true, 
        maintainAspectRatio: false,
        legend: false,
        // legend: {
        //     // labels: {
        //     //     boxWidth : 12,
        //     //     fontSize : 12,
        //     //     borderWidth: 0,
        //     //     fontFamily : window.chartFontFamily
        //     // },
        //     // position: 'bottom'
        // },
    })
  }
}
