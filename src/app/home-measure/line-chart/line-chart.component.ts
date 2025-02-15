import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode.service';
import { ChartColorsEnum } from '../../models/chart-colors.enum';
import { PanelCardComponent } from '../panel-card/panel-card.component';

@Component({
  selector: 'app-line-chart',
  imports: [ChartModule, PanelCardComponent],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnChanges {
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  private darkModeService = inject(DarkModeService);

  @Input() axisX: unknown[] = [];
  @Input() axisY: unknown[] = [];
  @Input() chartLineColor: ChartColorsEnum = ChartColorsEnum.BLUE;
  @Input() placeName = '';
  @Input() currentTemperature: number | undefined;
  @Input() currentHumidity: number | undefined;
  @Input() createdAt: string | undefined;
  @Input() placeNameChanged: string[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.initChart();
    this.handleDarkMode();
  }

  ngOnChanges() {
    if (this.placeNameChanged?.includes(this.placeName)) {
      this.initChart();
      this.placeNameChanged.pop();

    }
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
            tension: 0.4,
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
