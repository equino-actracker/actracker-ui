

export interface DashboardData {
  name: string,
  charts: ChartData[]
}

export interface ChartData {
  name: string,
  buckets: BucketData[]
}

export interface BucketData {
  label?: string,
  id?: string,
  rangeStart?: Date,
  rangeEnd?: Date,
  value?: number,
  bucketType: string,
  percentage?: number,
  buckets?: BucketData[]
}
