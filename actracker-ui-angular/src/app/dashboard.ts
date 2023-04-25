export interface Dashboard {
  id?: string,
  name?: string,
  charts: Chart[]
}

export interface Chart {
  name?: string
}
