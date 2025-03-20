import { GetCategoryResponse } from "./Category";

export type Record = {
  id: number;
  date: Date;
  category: GetCategoryResponse;
  description: string;
  amount: number;
};

export type EditRecordRequest = {
  id: number;
  date: string;
  categoryId: number | null;
  description: string;
  amount: number;
};

export interface GetRecordResponse {
  id: number;
  date: Date;
  category?: GetCategoryResponse;
  description: string;
  amount: number;
}

export interface CreateRecordRequest {
  date: string;
  categoryId: number | null;
  description: string;
  amount: number;
}
