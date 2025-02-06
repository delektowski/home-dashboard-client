import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gql } from 'apollo-angular';
import { MenuBarComponent } from './menu-bar/menu-bar.component';


const GET_MEASURES_HOME = gql`
  query getMeasuresHome($placeName: String!) {
    getMeasuresHome(placeName: $placeName) {
      id
      placeName
      temperature
      humidity
    }
  }
`;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
}



