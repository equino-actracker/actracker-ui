import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardDataService } from '../dashboard-data.service';
import { TagService } from '../tag.service';

import { Dashboard } from '../dashboard';
import { DashboardData, BucketData } from '../dashboardData';
import { Tag } from '../tag';
import { ActivityFilter } from '../activityFilter';

@Component({
  selector: 'app-dashboard-data',
  templateUrl: './dashboard-data.component.html',
  styleUrls: ['./dashboard-data.component.css']
})
export class DashboardDataComponent implements OnInit {

  @Input()
  dashboard!: Dashboard;

  dashboardData?: DashboardData;

  activityFilter: ActivityFilter = {tags: []};

  constructor(
    private dashboardDataService: DashboardDataService,
    private tagService: TagService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.dashboardDataService.getDashboardData(this.dashboard, this.activityFilter.dateRangeStart, this.activityFilter.dateRangeEnd, this.activityFilter.tags)
      .subscribe(data => {
        this.dashboardData = data;
        this.resolveBucketNames();
      });
  }

  private resolveBucketNames(): void {
    let buckets: BucketData[] = this.dashboardData!.charts
      .flatMap(ch => ch.buckets);
    let tagBuckets = this.getBucketsOfType('TAG', buckets);
    this.resolveTagBucketNames(tagBuckets);
    let dayBuckets = this.getBucketsOfType('DAY', buckets);
    this.resolveDayBucketNames(dayBuckets);
  }

  private getBucketsOfType(type: string, buckets?: BucketData[]): BucketData[] {
    let matchingBuckets: BucketData[] = buckets?.filter(bucket => bucket.type == type) ?? [];
    buckets?.forEach(bucket => {
      let subBuckets: BucketData[] | undefined = bucket.buckets;
      matchingBuckets = matchingBuckets.concat(this.getBucketsOfType(type, subBuckets));
    });

    return matchingBuckets;
  }

  private resolveTagBucketNames(tagBuckets: BucketData[]): void {
    let tagBucketIds: string[] = tagBuckets
      .filter(b => !!b.id)
      .map(b => b.id!);
    this.tagService.resolveTags(tagBucketIds)
      .subscribe(tagsResult => {
        tagBuckets.forEach(bucket => {
          let matchingTag: Tag | undefined = tagsResult.tags.find(tag => tag.id == bucket.id);
          bucket.label = matchingTag?.name ?? bucket.id;
        });
      });
  }

  private resolveDayBucketNames(dayBuckets: BucketData[]): void {
    dayBuckets.forEach(bucket => {
      bucket.label = `${bucket.rangeStart?.toLocaleString()} - ${bucket.rangeEnd?.toLocaleString()}`;
    });
  }

  drillDown(bucket: BucketData): void {
    let tagBuckets: BucketData[] = this.getBucketsOfType('TAG', [bucket]);
    let dailyBuckets: BucketData[] = this.getBucketsOfType('DAY', [bucket]);

    let tags: Tag[] = tagBuckets
      .filter(bucket => !!bucket.id)
      .map(bucket => <Tag>{id: bucket.id});

    let rangeStarts: Date[] = dailyBuckets
      .filter(bucket => !!bucket.rangeStart)
      .map(bucket => bucket.rangeStart!)

    if(this.activityFilter.dateRangeStart) {
      rangeStarts.unshift(this.activityFilter.dateRangeStart);
    }

    let latestRangeStart: Date | undefined = rangeStarts?.length > 0
      ? rangeStarts.reduce((date1, date2) => date1! > date2! ? date1 : date2)
      : undefined;

    let rangeEnds: Date[] = dailyBuckets
      .filter(bucket => !!bucket.rangeEnd)
      .map(bucket => bucket.rangeEnd!)

    if(this.activityFilter.dateRangeEnd) {
      rangeEnds.unshift(this.activityFilter.dateRangeEnd);
    }

    let earliestRangeEnd: Date | undefined = rangeEnds?.length > 0
      ? rangeEnds.reduce((date1, date2) => date1! < date2! ? date1 : date2)
      : undefined;

    let optionalParams = {
      tags: tags.length > 0 ? tags.map(tag => tag.id).join(',') : '',
      rangeStart: latestRangeStart?.getTime() ?? '',
      rangeEnd: earliestRangeEnd?.getTime() ?? ''
    }

    this.router.navigate(['/activities', optionalParams]);
  }

}
