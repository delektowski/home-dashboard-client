import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { NgForOf } from '@angular/common';
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

const MEASURES_HOME_SUBSCRIPTION = gql`
  subscription {
    measuresHomeAdded {
      id
      placeName
      temperature
    }
  }
`;

@Component({
  selector: 'app-home-measure',
  imports: [NgForOf],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit {
  loading: boolean | undefined;
  homeMeasures: any;


  constructor(private readonly apollo: Apollo) {
  }

  ngOnInit() {


    this.apollo
      .watchQuery<any>({
        query: GET_MEASURES_HOME,
        variables: {
          placeName: 'Living Room',
        },
      })
      .valueChanges.pipe(map(result => result.data.getMeasuresHome)).subscribe((result) => {
      this.homeMeasures = result;
    });

    this.apollo.subscribe({
      query: MEASURES_HOME_SUBSCRIPTION,
      /*
        accepts options like `errorPolicy` and `fetchPolicy`
      */
    }).pipe(map((result: any) => result.data.measuresHomeAdded)).subscribe((result: any) => {
      this.homeMeasures = [...this.homeMeasures, result];
    });
  }


}
