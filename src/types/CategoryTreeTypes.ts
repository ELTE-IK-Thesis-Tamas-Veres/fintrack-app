import { IdObj } from "react-arborist/dist/module/types/utils";

export interface IExtraActions {
  delete: (id: string) => void;
  addFolder: (parentId: string) => void;
}

export interface ITreeObj extends IdObj {
  // id: string;
  name: string;
  type: "directory" | "file";
}

export interface ITreeObjFile extends ITreeObj {
  type: "file";
}

export interface ITreeObjDir extends ITreeObj {
  type: "directory";
  isOpen?: boolean;
  children: TreeObj[];
}

export type TreeObj = ITreeObjFile | ITreeObjDir;
