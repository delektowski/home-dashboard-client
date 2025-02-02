import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Subject } from 'rxjs';




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

@Injectable({
  providedIn: 'root',
})
export class HomeMeasuresService {
  private apollo = inject(Apollo);

  getMeasuresHome() {
    return this.apollo
      .watchQuery<any>({
        query: GET_MEASURES_HOME,
        variables: {
          placeName: 'Living Room',
        },
      })
      .valueChanges;
  }

  subscribeMeasuresHome() {
    return this.apollo.subscribe({
      query: MEASURES_HOME_SUBSCRIPTION,
    });
  }

}
