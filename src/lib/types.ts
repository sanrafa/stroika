export interface IProject {
  id: string;
  name: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  columns?: IColumn[];
}

export interface IColumn {
  id: string;
  name: string;
  order: number;
  categories?: ICategory[];
}

export interface ICategory {
  id: string;
  name: string;
  order: number;
  suspended: boolean;
  features: IFeature[];
}

export interface IFeature {
  id: string;
  name: string;
  completed: boolean;
  tasks?: ITask[];
}

export interface ITask {
  id: string;
  description: string;
  completed: boolean;
}
