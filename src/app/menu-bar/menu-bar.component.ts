import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { MenuItem, MenuItemCommandEvent, PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  imports: [MenubarModule, Menubar, Button, RouterLink],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isDarkMode = true;

  ngOnInit() {
    this.toggleDarkMode();
    this.items = [{
      label: 'Measures',
      icon: PrimeIcons.GAUGE,
      routerLink: "measures"
    }];
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');
    this.isDarkMode = !this.isDarkMode;
  }


}
