import { Component, inject, OnInit } from '@angular/core';
import { forkJoin, map, Observable, take } from 'rxjs';
import { HomeMeasuresService } from '../services/home-measures.service';
import { ChartModule } from 'primeng/chart';
import { LineChartComponent } from './line-chart/line-chart.component';
import { HomeMeasureModel } from '../models/home-measure.model';
import { HomeMeasureChartModel } from '../models/home-measure-chart.model';
import { PlaceNameEnum } from '../models/place-name.enum';


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule, LineChartComponent],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit {
  homeMeasuresCharts: HomeMeasureChartModel[] = [];


  private homeMeasuresService = inject(HomeMeasuresService);


  ngOnInit(): void {
    this.getHomeMeasures();
    this.subscribeHomeMeasures();
  }

  getHomeMeasuresByPlacename(): Observable<HomeMeasureModel[]>[] {
    const placeNames = [PlaceNameEnum.TEST1, PlaceNameEnum.TEST2, PlaceNameEnum.TEST3, PlaceNameEnum.TEST4];
    return placeNames.map((placeName) => this.homeMeasuresService.getHomeMeasures(placeName).pipe(take(1), map(result => result.data.getMeasuresHome)));
  }

  /**
   * Fetches home measures data from the service.
   */
  getHomeMeasures(): void {
    forkJoin(this.getHomeMeasuresByPlacename()).pipe(take(1)).subscribe((results) => {
      this.homeMeasuresCharts = results.map((result) => {
        return this.handleLabelsValuesSeparation(result);
      });
    });
  }

  /**
   * Subscribes to home measures updates from the service.
   */
  subscribeHomeMeasures():void {
    this.homeMeasuresService.subscribeMeasuresHome().pipe(map((result) => result?.data?.measuresHomeAdded)).subscribe((result) => {
      console.log('result', result);
    });
  }

  handleLabelsValuesSeparation(result: HomeMeasureModel[]): HomeMeasureChartModel {
    return result.reduce((acc: HomeMeasureChartModel, current) => {
      if (!acc.placeName) {
        acc.placeName = current.placeName;
      }
      acc.labels.push(this.splitLabelTwoLines(current.createdAt));
      acc.values.push(current.temperature);
      return acc;
    }, { labels: [], values: [], placeName: '' });
  }

  splitLabelTwoLines(createdAt: string) {
    const date = new Date(createdAt);
    const hoursMinutes = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayMonth = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    return [hoursMinutes, dayMonth];

  }
}
