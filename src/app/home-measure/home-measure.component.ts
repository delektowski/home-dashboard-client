import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs';
import { HomeMeasuresService } from './services/home-measures.service';
import { ChartModule } from 'primeng/chart';
import { DarkModeService } from './services/dark-mode.service';


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit {
  loading: boolean | undefined;
  homeMeasures: any = [];
  chart: any = [];

  private homeMeasuresService = inject(HomeMeasuresService);
  private darkModeService = inject(DarkModeService);

  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);


  constructor(private cd: ChangeDetectorRef) {}


  ngOnInit() {
    this.getMeasuresHome();
    this.subscribeMeasuresHome();
    this.initChart();
    this.handleDarkMode()
  }

  handleDarkMode() {
    this.darkModeService.darkModeChanges.subscribe(_ => {
      this.initChart();
    });
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
      this.homeMeasures = [...this.homeMeasures, result];
    });
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            tension: 0.4
          },
          {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            tension: 0.4
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };
      this.cd.markForCheck()
    }
  }


}
