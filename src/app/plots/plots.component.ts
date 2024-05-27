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

  options: EChartsOption = {
    title: {
      show: false,
    },
    tooltip: {},
    xAxis: {
      data: [],
    },
    yAxis: {},
  };
  available: boolean = true;
  data: any;

  constructor(private httpService:HttpService) {}

  build_plot(body: Object): void {
    this.data = body;
  
        this.options = {
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
  }

  ngOnInit() {
    this.httpService.get_plots()
    .subscribe({
      next: (body: Object) => {
        try {
          this.build_plot(body);
        } catch (error) {
          this.available = false;
        }
      },
    error: (error) => {this.available = false;}
    });
  }
}
