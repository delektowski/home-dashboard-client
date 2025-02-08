import { Component, Input, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-panel-card',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule],
  templateUrl: './panel-card.component.html',
  styleUrl: './panel-card.component.scss'
})
export class PanelCardComponent implements OnInit {
  @Input()
  title = ""
  @Input()
  currentTemperature: number | undefined;
  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Full Screen',
        icon: PrimeIcons.ARROWS_H
      },

    ];
  }
}
