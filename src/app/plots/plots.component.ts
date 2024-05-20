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

  options!: EChartsOption;
  available: boolean = true;
  data: any;
  constructor(private httpService:HttpService) {}

  ngOnInit() {
    this.httpService.get_plots()
    .subscribe({
      next: (body: Object) => {
        this.data = body;
  
        this.options = {
          title: {
            show: true,
            left: 'center',
            text: 'Cumulative Frequency \n of Job Applications Over Time'
          },
          tooltip: {},
          xAxis: {
            data: this.data.x_axis,
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
              name: 'Applications',
              type: 'line',
              data: this.data.y_axis,
              animationDelay: idx => idx * 10,
            }
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: idx => idx * 5,
        };
      },
    error: (error) => {this.available = false;}
    });
  }

}
