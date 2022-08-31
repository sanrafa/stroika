export interface IProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  columns?: string[];
}

export interface IColumn {
  id: string;
  name: string;
  order: number;
  categories?: string[];
}

export interface ICategory {
  id: string;
  name: string;
  order: number;
  suspended: boolean;
  features: string[];
}

export interface IFeature {
  id: string;
  name: string;
  completed: boolean;
  order: number;
  tasks?: string[];
}

export interface ITask {
  id: string;
  order: number;
  description: string;
  completed: boolean;
}
