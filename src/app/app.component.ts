import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
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

export class AppComponent implements OnInit {
  loading: boolean | undefined;
  homeMeasures: any;


  constructor(private readonly apollo: Apollo) {
  }

  ngOnInit() {
    this.homeMeasures = this.apollo
      .watchQuery<any>({
        query: GET_MEASURES_HOME,
        variables: {
          placeName: 'Living Room',
        },
      })
      .valueChanges.pipe(map(result => result.data.getMeasuresHome));
  }


}



