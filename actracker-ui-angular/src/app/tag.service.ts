import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Tag } from './tag';
import { Metric } from './tag';
import { TagsResult } from './tagsResult';
import { Share } from './share';

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

  renameTag(tag: Tag, newName: string): Observable<Tag> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}/name`;
    return this.http.put(url, newName).pipe(
      map(response => this.toTag(response)),
      catchError(() => {
        console.error('Error occurred during renaming tag');
        return [];
      })
    );
  }

  shareTag(tag: Tag, share: Share): Observable<Tag> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}/share`;
    let sharePayload = this.toSharePayload(share);

    return this.http.post(url, sharePayload)
      .pipe(
        map(response => this.toTag(response)),
        catchError((error) => {
          console.error("Error occurred during sharing tag");
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  unshareTag(tag: Tag, share: Share): Observable<Tag> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}/share/${share.granteeName}`;

    return this.http.delete(url)
      .pipe(
        map(response => this.toTag(response)),
        catchError((error) => {
          console.error("Error occurred during unsharing tag");
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  deleteTag(tag: Tag): Observable<any> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}`;
    return this.http.delete(url).pipe(
      catchError(() => {
        console.error('Error occurred during deleting tag');
        return [];
      })
    );
  }

  renameMetric(tag: Tag, metric: Metric, newName: string): Observable<Tag> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}/metric/${metric.id}/name`;
    return this.http.put(url, newName).pipe(
      map(response => this.toTag(response)),
      catchError(() => {
        console.error('Error occurred during renaming metric');
        return [];
      })
    );
  }

  addMetric(tag: Tag, metric: Metric): Observable<Tag> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}/metric`;
    return this.http.post(url, metric).pipe(
      map(response => this.toTag(response)),
      catchError(() => {
        console.error('Error occurred during adding metric');
        return [];
      })
    );
  }

  deleteMetric(tag: Tag, metric: Metric): Observable<Tag> {
    let url = `${environment.backendBaseUrl}/tag/${tag.id}/metric/${metric.id}`;
    return this.http.delete(url).pipe(
      map(response => this.toTag(response)),
      catchError(() => {
        console.error('Error occurred during deleting metric');
        return [];
      })
    );
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

  updateTagDetails(tagsToUpdate: Tag[], foundTags: TagsResult): void {
    tagsToUpdate.forEach(tag => {
      let matchingTag: Tag | undefined = foundTags.tags.find(result => result.id === tag.id);
      let name: string | undefined = matchingTag?.name ?? tag.id;
      tag.name = name ?? '';
      tag.metrics = matchingTag?.metrics ?? [];
    });
  }

  toTagPayload(tag: Tag): TagPayload {
    return {
      id: tag.id,
      name: tag.name,
      metrics: tag.metrics.map(metric => <MetricPayload>this.toMetricPayload(metric)),
      shares: tag.shares.map(share => <SharePayload>this.toSharePayload(share))
    }
  }

  toMetricPayload(metric: Metric): MetricPayload {
    return <MetricPayload>{
      id: metric.id,
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
      metrics: tagPayload.metrics?.map(metric => <Metric>this.toMetric(<MetricPayload>metric)) ?? [],
      shares: tagPayload.shares?.map(share => <Share>this.toShare(share)) ?? []
    }
  }

  toMetric(metricPayload: MetricPayload): Metric {
    return <Metric>{
      id: metricPayload.id,
      name: metricPayload.name ?? '',
      type: metricPayload.type ?? ''
    };
  }

  toSharePayload(share: Share): SharePayload {
    return {
      granteeName: share.granteeName
    }
  }

  toShare(sharePayload: SharePayload): Share {
    return {
      granteeName: sharePayload.granteeName ?? ''
    };
  }
}

interface SharePayload {
  granteeName?: string
}

interface TagPayload {
  id?: string,
  name?: string,
  metrics?: MetricPayload[],
  shares?: SharePayload[],
}

interface MetricPayload {
  id?: string,
  name?: string,
  type?: string
}

interface TagsSearchResultPayload {
  nextPageId: string,
  results: TagPayload[]
}


