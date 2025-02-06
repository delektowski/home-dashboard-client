import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApolloQueryResult, FetchResult } from '@apollo/client';
import { HomeMeasureModel } from '../models/home-measure.model';


const GET_MEASURES_HOME = gql`
  query getMeasuresHome($placeName: String!) {
    getMeasuresHome(placeName: $placeName) {
      id
      placeName
      temperature
      humidity
      createdAt
    }
  }
`;

const MEASURES_HOME_SUBSCRIPTION = gql`
  subscription {
    measuresHomeAdded {
      id
      placeName
      temperature
      createdAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class HomeMeasuresService {
  private apollo = inject(Apollo);

  getHomeMeasures(placeName: string): Observable<ApolloQueryResult<{ getMeasuresHome: HomeMeasureModel[] }>> {
    return this.apollo
      .watchQuery<{ getMeasuresHome: HomeMeasureModel[] }>({
        query: GET_MEASURES_HOME,
        variables: {
          placeName,
        },
      })
      .valueChanges;
  }

  subscribeMeasuresHome(): Observable<FetchResult<{ measuresHomeAdded: HomeMeasureModel }>> {
    return this.apollo.subscribe<{ measuresHomeAdded: HomeMeasureModel }>({
      query: MEASURES_HOME_SUBSCRIPTION,
    });
  }

}
