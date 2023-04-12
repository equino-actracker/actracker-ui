import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Tag } from './tag';
import { TagsResult } from './tagsResult';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private http: HttpClient,
  ) { }

  // TODO delete, replace with searchTags
  getTags(): Observable<TagsResult> {
    let url: string = `${environment.backendBaseUrl}/tag`;

    return this.http.get<TagPayload[]>(url)
      .pipe(
        map(response => this.toTagsResult(response)),
        catchError(() => {
          console.error('Error occurred during fetching tags');
          return [];
        })
      );
  }

  searchTags(term?: String, pageId?: String, pageSize?: number, excludedTags?: Tag[]): Observable<TagsResult> {
    let url: string = `${environment.backendBaseUrl}/tag/matching`;
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
    if(!!excludedTags) {
      requestParams.unshift(`excludedTags=${excludedTags.map(tag => tag.id).join(',')}`)
    }
    if(requestParams.length > 0) {
      url = `${url}?${requestParams.join('&')}`
    }

    return this.http.get<TagsSearchResultPayload>(url)
    .pipe(
      map(response => this.toTagsSearchResult(response)),
      catchError(() => {
        console.error('Error occurred during searching tags');
        return []; // TODO [mc] What should I return here?
      })
    );

  }

  createTag(tag: Tag): Observable<Tag> {
    let url: string = `${environment.backendBaseUrl}/tag`;
    let tagPayload = this.toTagPayload(tag);

    return this.http.post<TagPayload>(url, tagPayload)
    .pipe(
      map(response => this.toTag(response)),
      catchError(() => {
        console.error('Error occurred during tag creation');
        return []; // TODO [mc] What should I return here?
      })
    );
  }

  updateTag(tag: Tag): Observable<Tag> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}`;
    let tagPayload = this.toTagPayload(tag);

    return this.http.put(url, tagPayload).pipe(
      map(response => this.toTag(response)),
      catchError(() => {
        console.error('Error occurred during updating tag');
        return [];
      })
    )
  }

  deleteTag(tag: Tag): Observable<any> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}`;
    return this.http.delete(url).pipe(
      catchError(() => {
        console.error('Error occurred during deleting tag');
        return [];
      })
    )
  }

  toTagPayload(tag: Tag): TagPayload {
    let tagPayload: TagPayload = {
      id: tag.id,
      name: tag.name
    }
    return tagPayload;
  }

  toTagsResult(tags: TagPayload[]): TagsResult {
    let tagsResult: TagsResult = {
      tags: tags.map(this.toTag)
    }
    return tagsResult;
  }

  toTagsSearchResult(searchResult: TagsSearchResultPayload): TagsResult {
    let tagsResult: TagsResult = {
      nextPageId: searchResult.nextPageId,
      tags: searchResult.results.map(this.toTag)
    }
    return tagsResult;
  }

  toTag(tagPayload: TagPayload): Tag {
    let tag: Tag = {
      id: tagPayload.id,
      name: tagPayload.name
    }

    return tag;
  }
}

interface TagPayload {
  id?: string,
  name?: string
}

interface TagsResultPayload {
  tags: TagPayload[]
}

interface TagsSearchResultPayload {
  nextPageId: string,
  results: TagPayload[]
}


