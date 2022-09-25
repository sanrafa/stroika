export interface IProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  columns: string[];
  config: {
    archiveTasks: boolean;
  };
}

export interface IColumn {
  id: string;
  name: string;
  order: number;
  projectId: string;
  categories: string[];
}

export interface ICategory {
  id: string;
  name: string;
  order: number;
  suspended: boolean;
  projectId: string;
  columnId: string;
  features: string[];
}

export interface IFeature {
  id: string;
  name: string;
  completed: boolean;
  order: number;
  projectId: string;
  columnId: string;
  categoryId: string;
  tasks: string[];
}

export interface ITask {
  id: string;
  order: number;
  description: string;
  completed: boolean;
  archived: boolean;
  projectId: string;
  columnId: string;
  categoryId: string;
  featureId: string;
}
