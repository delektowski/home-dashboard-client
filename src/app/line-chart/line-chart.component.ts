import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { DarkModeService } from '../home-measure/services/dark-mode.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-line-chart',
  imports: [ChartModule,CardModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit {
  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);

  private darkModeService = inject(DarkModeService);

  constructor(private cd: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.initChart();
    this.handleDarkMode()
  }

  handleDarkMode() {
    this.darkModeService.darkModeChanges.subscribe(_ => {
      this.initChart();
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
            label: 'Third Dataset',

            data: [12, 51, 62, 33, 21, 62, 45],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-red-500'),
            tension: 0.4
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

}
