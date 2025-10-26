/**
 * Type definitions for documentation build system
 */

export interface TocItem {
  value: string;
  depth: number;
  children?: TocItem[];
}

export interface MdxFileMeta {
  id: string;
  title: string;
  description?: string;
  order?: number;
  menu?: string[];
  tags?: string[];
  lifecycleState?: string;
  documentState?: string;
  figmaLink?: string;
  repoPath: string;
  route: string;
  toc: TocItem[];
}

export interface MdxDocument {
  meta: MdxFileMeta;
  mdx: string;
}

export interface RouteManifest {
  routes: RouteInfo[];
  categories: CategoryInfo[];
  navigation: NavigationStructure;
}

export interface RouteInfo {
  path: string;
  id: string;
  title: string;
  category: string;
  tags: string[];
  chunkName: string;
}

export interface CategoryInfo {
  id: string;
  label: string;
  order: number;
  items: RouteInfo[];
}

export interface NavigationStructure {
  [categoryId: string]: {
    label: string;
    items: {
      id: string;
      title: string;
      path: string;
    }[];
  };
}
