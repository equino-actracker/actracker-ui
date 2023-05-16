import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Tag } from './tag';
import { Metric } from './tag';
import { TagsResult } from './tagsResult';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private http: HttpClient,
  ) { }

  resolveTags(tagIds: string[]): Observable<TagsResult> {
    let jointTagIds = this.unique(tagIds).join(',');
    let url: string = `${environment.backendBaseUrl}/tag?ids=${jointTagIds}`;

    return this.http.get<TagPayload[]>(url)
      .pipe(
        map(response => this.toTagsResult(<TagPayload[]>response)),
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
      map(response => this.toTagsSearchResult(<TagsSearchResultPayload>response)),
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

  resolveTagNames(tags: Tag[]) {
    let tagIds = tags.map(tag => tag.id!);
    tagIds = this.unique(tagIds);
    this.resolveTags(tagIds).subscribe(tagsResult => {
      tags.forEach(tag => {
        let matchingTag: Tag | undefined = tagsResult.tags.find(result => result.id === tag.id);
        let name: string | undefined = matchingTag?.name ?? tag.id;
        tag.name = name ?? '';
      });
    });
  }

  toTagPayload(tag: Tag): TagPayload {
    return {
      id: tag.id,
      name: tag.name,
      metrics: tag.metrics.map(metric => <MetricPayload>this.toMetricPayload(metric))
    }
  }

  toMetricPayload(metric: Metric): MetricPayload {
    return <MetricPayload>{
      name: metric.name,
      type: metric.type
    }
  }

  unique(ids: string[]): string[] {
    let uniqueIds: string[] = [];
    ids.forEach(id => {
      if(!uniqueIds.includes(id)) {
        uniqueIds.unshift(id);
      }
    });
    return uniqueIds;
  }

  toTagsResult(tags: TagPayload[]): TagsResult {
    return <TagsResult>{
      tags: tags.map(tag => this.toTag(<TagPayload>tag))
    }
  }

  toTagsSearchResult(searchResult: TagsSearchResultPayload): TagsResult {
    return <TagsResult>{
      nextPageId: searchResult.nextPageId,
      tags: searchResult.results.map(tag => <Tag>this.toTag(tag))
    }
  }

  toTag(tagPayload: TagPayload): Tag {
    return <Tag>{
      id: tagPayload.id,
      name: tagPayload.name,
      metrics: tagPayload.metrics?.map(metric => <Metric>this.toMetric(<MetricPayload>metric)) ?? []
    }
  }

  toMetric(metricPayload: MetricPayload): Metric {
    return <Metric>{
      name: metricPayload.name ?? '',
      type: metricPayload.type ?? ''
    };
  }
}

interface TagPayload {
  id?: string,
  name?: string,
  metrics?: MetricPayload[]
}

interface MetricPayload {
  name?: string,
  type?: string
}

interface TagsSearchResultPayload {
  nextPageId: string,
  results: TagPayload[]
}


