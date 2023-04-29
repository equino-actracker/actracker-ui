

export interface DashboardData {
  charts: ChartData[]
}

export interface ChartData {
  name: string,
  buckets: BucketData[]
}

export interface BucketData {
  name: string,
  value: number,
  percentage: number
}
