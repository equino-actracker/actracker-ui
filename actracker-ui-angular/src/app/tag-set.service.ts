import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { TagSet } from './tagSet';
import { TagSetsResult } from './tagSetsResult';

@Injectable({
  providedIn: 'root'
})
export class TagSetService {

  constructor(
    private http: HttpClient,
  ) { }

  searchTagSets(term?: String, pageId?: String, pageSize?: number, excludedTagSets?: TagSet[]): Observable<TagSetsResult> {
    return of({tagSets: [
      {name: 'TagSet1', tags:[]},
      {name: 'TagSet2', tags:[]}
    ]});
  }
}
