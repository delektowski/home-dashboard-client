import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AsyncPipe, NgForOf } from '@angular/common';
import { map } from 'rxjs';


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
  selector: 'app-home-measure',
  imports: [AsyncPipe, NgForOf],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss'
})
export class HomeMeasureComponent implements OnInit {
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
