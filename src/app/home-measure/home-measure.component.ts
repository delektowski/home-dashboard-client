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
  private homeMeasuresService = inject(HomeMeasuresService);
  homeMeasuresCharts: HomeMeasureChartModel[] = [];
  currentHomeMeasuresCharts: HomeMeasureModel[] = [];
  placeNames = [PlaceNameEnum.TEST1, PlaceNameEnum.TEST2, PlaceNameEnum.TEST3, PlaceNameEnum.TEST4];

  ngOnInit(): void {
    this.getHomeMeasures();
    this.subscribeHomeMeasures();
  }

  getHomeMeasuresByPlaceName(): Observable<HomeMeasureModel[]>[] {
    return this.placeNames.map((placeName) => this.homeMeasuresService.getHomeMeasures(placeName).pipe(take(1), map(result => result.data.getMeasuresHome)));
  }

  /**
   * Fetches home measures data from the service.
   */
  getHomeMeasures(): void {
    forkJoin(this.getHomeMeasuresByPlaceName()).pipe(take(1)).subscribe((homeMeasuresResults) => {
      forkJoin(this.getCurrentHomeMeasuresByPlaceName()).pipe(take(1)).subscribe((currentMeasuresResults) => {
        this.homeMeasuresCharts = homeMeasuresResults.map((result) => {
          return this.handleLabelsValuesSeparation(result);
        });
        this.currentHomeMeasuresCharts = currentMeasuresResults;
      });
    });
  }

  getCurrentHomeMeasuresByPlaceName(): Observable<HomeMeasureModel>[] {
    return this.placeNames.map((placeName) => this.homeMeasuresService.getCurrentHomeMeasure(placeName).pipe(take(1), map(result => result.data.getCurrentMeasureHome)));
  }

  /**
   * Subscribes to home measures updates from the service.
   */
  subscribeHomeMeasures(): void {
    this.homeMeasuresService.subscribeMeasuresHome().pipe(map((result) => result?.data?.measuresHomeAdded)).subscribe((result) => {
      let placeNameMeasureToChangeIndex = this.currentHomeMeasuresCharts.findIndex(measure => measure.placeName === result?.placeName);
      if (placeNameMeasureToChangeIndex !== -1) {
        this.currentHomeMeasuresCharts[placeNameMeasureToChangeIndex] = {
          ...this.currentHomeMeasuresCharts[placeNameMeasureToChangeIndex],
          temperature: result?.temperature ?? 0,
        };
      }
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
