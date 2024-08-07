import { Component, OnInit } from '@angular/core';
import type { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-plots',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './plots.component.html',
  styleUrl: './plots.component.css',
  providers: [
    provideEcharts(),
  ]
})
export class PlotsComponent implements OnInit {

  lineChartOptions: EChartsOption = {
    title: {
      show: false,
    },
    tooltip: {},
    xAxis: {
      data: [],
    },
    yAxis: {},
  };

  pieChartOptions: EChartsOption = {
    title: {
      show: false,
    },
    tooltip: {},
    series: []
  };

  loadingOpts = {text: '', spinnerRadius: 45, lineWidth: 10, color: '#0f3a58'}
  loading: boolean = true;
  available: boolean = true;
  data: any;

  constructor(private httpService:HttpService) {}


  async sleep(ms: number): Promise<void> {
    return new Promise(
        (resolve) => setTimeout(resolve, ms));
  }


  build_plot(body: Object): void {
    this.data = body;
    this.lineChartOptions = {
      legend: {
        // Try 'horizontal'
        orient: 'vertical',
        left: '15%',
        top: '15%',
        data: [
          {
            name: 'Sent Applications'
          },
          {
            name: 'Rejections'
          }
        ]
      },
      title: {
        show: true,
        top: '5%',
        left: 'center',
        text: 'Job Applications Info Over Time'
      },
      tooltip: {},
      xAxis: {
        data: this.data.applications.x_axis,
        silent: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          rotate: 45
        }
      },
      yAxis: {},
      series: [
        {
          name: 'Sent Applications',
          type: 'line',
          data: this.data.applications.y_axis,
          lineStyle: {color: '#2170a8'},
          itemStyle: {color: '#2170a8'},
          animationDelay: idx => idx * 10,
        },
        {
          name: 'Rejections',
          type: 'line',
          data: this.data.rejections.y_axis,
          lineStyle: {color: '#a82133'},
          itemStyle: {color: '#a82133'},
          animationDelay: idx => idx * 10,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };

    let pie = this.data.pie_chart;

    this.pieChartOptions = {
      title: {
        top: '5%',
        text: 'Latest Resolution of Applications',
        left: 'center'
      },
      legend: {
        // Try 'horizontal'
        orient: 'horizontal',
        top: 'bottom'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Resolution:',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: false,
            formatter: '{b}: {@2012} ({d}%)'
          },
          data: [{value: pie.rejected, name: 'Rejected'},
                 {value: pie.total - pie.rejected - pie.no_response - pie.ghosted - pie.waiting, name: 'Other'},
                 {value: pie.no_response, name: 'No Response'},
                 {value: pie.ghosted, name: 'Ghosted'},
                 {value: pie.waiting, name: 'Waiting'},
                 
          ] 
        }
      ]
    };
  }

  async ngOnInit() {
    this.httpService.get_plots()
    .subscribe({
      next: (body: Object) => {
        try {
          this.loading = false;
          this.build_plot(body);
        } catch (error) {
          this.available = false;
        }
      },
    error: (error) => {this.available = false;}
    });
  }
}
