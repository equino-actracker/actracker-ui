import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { TagSet } from './tagSet';
import { TagSetsResult } from './tagSetsResult';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class TagSetService {

  constructor(
    private http: HttpClient,
  ) { }

  searchTagSets(term?: String, pageId?: String, pageSize?: number, excludedTagSets?: TagSet[]): Observable<TagSetsResult> {
    let url: string = `${environment.backendBaseUrl}/tag-set/matching`;
    let requestParams = [];
    if(!!term) {
      requestParams.unshift(`term=${term}`)
    }
    if(!!pageId) {
      requestParams.unshift(`pageId=${pageId}`)
    }
    if(!!pageSize) {
      requestParams.unshift(`pageSize=${pageSize}`)
    }
    if(!!excludedTagSets) {
      requestParams.unshift(`excludedTagSets=${excludedTagSets.map(tagSet => tagSet.id).join(',')}`)
    }
    if(requestParams.length > 0) {
      url = `${url}?${requestParams.join('&')}`
    }

    return this.http.get<TagSetsSearchResultPayload>(url)
    .pipe(
      map(response => this.toTagSetsSearchResult(response)),
      catchError(() => {
        console.error('Error occurred during searching tag sets');
        return []; // TODO [mc] What should I return here?
      })
    );
  }

  createTagSet(tagSet: TagSet): Observable<TagSet> {
    let url: string = `${environment.backendBaseUrl}/tag-set`;
    let tagSetPayload = this.toTagSetPayload(tagSet);

    return this.http.post<TagSetPayload>(url, tagSetPayload)
    .pipe(
      map(response => this.toTagSet(response)),
      catchError(() => {
        console.error('Error occurred during tag set creation');
        return []; // TODO [mc] What should I return here?
      })
    );
  }

  updateTagSet(tagSet: TagSet): Observable<TagSet> {
    let url = `${environment.backendBaseUrl}/tag-set/${tagSet.id}`;
    let tagSetPayload = this.toTagSetPayload(tagSet);

    return this.http.put(url, tagSetPayload).pipe(
      map(response => this.toTagSet(response)),
      catchError(() => {
        console.error('Error occurred during updating tag set');
        return [];
      })
    )
  }

  deleteTagSet(tagSet: TagSet): Observable<any> {
    let url = `${environment.backendBaseUrl}/tag-set/${tagSet.id}`;
    return this.http.delete(url).pipe(
      catchError(() => {
        console.error('Error occurred during deleting tag set');
        return [];
      })
    )
  }

  toTagSetPayload(tagSet: TagSet): TagSetPayload {
    let tagSetPayload: TagSetPayload = {
      id: tagSet.id,
      name: tagSet.name,
      tags: tagSet.tags.map(tag => tag.id!)
    }
    return tagSetPayload;
  }

  toTagSetsSearchResult(searchResult: TagSetsSearchResultPayload): TagSetsResult {
    let tagSetsResult: TagSetsResult = {
      nextPageId: searchResult.nextPageId,
      tagSets: searchResult.results.map(this.toTagSet)
    }
    return tagSetsResult;
  }

  toTagSet(tagSetPayload: TagSetPayload): TagSet {
    let tagSet: TagSet = {
      id: tagSetPayload.id,
      name: tagSetPayload.name,
      tags: tagSetPayload.tags ? tagSetPayload.tags.map(tagId => <Tag>{id: tagId}) : []
    }

    return tagSet;
  }
}

interface TagSetPayload {
  id?: string,
  name?: string,
  tags?: string[]
}

interface TagSetsSearchResultPayload {
  nextPageId: string,
  results: TagSetPayload[]
}
