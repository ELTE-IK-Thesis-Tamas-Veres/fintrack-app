export interface EditCategoryRequest {
  name: string;
}

export interface GetCategoryTreeResponse {
  id: number;
  name: string;
  children: GetCategoryTreeResponse[];
}

export interface GetCategoryResponse {
  id: number;
  name: string;
}

export interface AddCategoryRequest {
  name: string;
}

export interface EditCategoriesParentRequest {
  categoryIds: number[];
  parentId: number | null;
}
