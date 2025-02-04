import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { HomeMeasuresService } from '../services/home-measures.service';
import { ChartModule } from 'primeng/chart';
import { LineChartComponent } from './line-chart/line-chart.component';
import { MeasureHomeModel } from '../models/measure-home.model';
import { HomeMeasureChartModel } from '../models/home-measure-chart.model';


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule, LineChartComponent],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit {
  homeMeasuresChart: HomeMeasureChartModel | undefined;


  private homeMeasuresService = inject(HomeMeasuresService);


  ngOnInit() {
    this.getMeasuresHome();
    this.subscribeMeasuresHome();

  }

  /**
   * Fetches home measures data from the service.
   */
  getMeasuresHome() {
    this.homeMeasuresService.getMeasuresHome().pipe(map(result => result.data.getMeasuresHome)).subscribe((result) => {
      this.handleLabelsValuesSeparation(result);
    });
  }

  /**
   * Subscribes to home measures updates from the service.
   */
  subscribeMeasuresHome() {
    this.homeMeasuresService.subscribeMeasuresHome().pipe(map((result) => result?.data?.measuresHomeAdded)).subscribe((result) => {
      console.log('result', result);
    });
  }

  handleLabelsValuesSeparation(result: MeasureHomeModel[]) {
    this.homeMeasuresChart = result.reduce((acc: HomeMeasureChartModel, current) => {
      acc.labels.push(this.splitLabelTwoLines(current.createdAt));
      acc.values.push(current.temperature);
      return acc;
    }, { labels: [], values: [] });
    console.log('this.homeMeasures', this.homeMeasuresChart);
  }

  splitLabelTwoLines(createdAt: string) {
    const date = new Date(createdAt);
    const hoursMinutes = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayMonth = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    return [hoursMinutes, dayMonth];

  }


}
