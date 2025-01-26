import { Component, inject, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { map } from 'rxjs';
import { HomeMeasuresService } from './services/home-measures.service';

@Component({
  selector: 'app-home-measure',
  imports: [NgForOf],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit {
  loading: boolean | undefined;
  homeMeasures: any;
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
      this.homeMeasures = result;
    });
  }

  /**
   * Subscribes to home measures updates from the service.
   */
  subscribeMeasuresHome() {
    this.homeMeasuresService.subscribeMeasuresHome().pipe(map((result: any) => result.data.measuresHomeAdded)).subscribe((result: any) => {
      this.homeMeasures.push(result)
    });
  }
}
