import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApolloQueryResult, FetchResult } from '@apollo/client';
import { MeasureHomeModel } from '../models/measure-home.model';


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

  getMeasuresHome(): Observable<ApolloQueryResult<{ getMeasuresHome: MeasureHomeModel[] }>> {
    return this.apollo
      .watchQuery<{ getMeasuresHome: MeasureHomeModel[] }>({
        query: GET_MEASURES_HOME,
        variables: {
          placeName: 'test4',
        },
      })
      .valueChanges;
  }

  subscribeMeasuresHome(): Observable<FetchResult<{ measuresHomeAdded: MeasureHomeModel }>> {
    return this.apollo.subscribe<{ measuresHomeAdded: MeasureHomeModel }>({
      query: MEASURES_HOME_SUBSCRIPTION,
    });
  }

}
