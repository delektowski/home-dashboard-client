import { ChangeDetectorRef, Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode.service';
import { CardModule } from 'primeng/card';
import { ChartColorsEnum } from '../../models/chart-colors.enum';

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

  @Input() axisX: unknown[] = []
  @Input() axisY: unknown[] = []
  @Input() chartLineColor: ChartColorsEnum = ChartColorsEnum.BLUE
  @Input() chartTitle = ""

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
        labels: this.axisX,
        datasets: [
          {
            data: this.axisY,
            fill: false,
            borderColor: documentStyle.getPropertyValue(this.chartLineColor),
            tension: 0.4
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: false,
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
