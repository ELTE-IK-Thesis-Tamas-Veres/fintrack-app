"use client";

import { useEffect, useState } from "react";
import { Tree } from "react-arborist";
import AutoSizer from "react-virtualized-auto-sizer";

import { toast } from "sonner";

import {
  AddCategoryRequest,
  EditCategoriesParentRequest,
} from "@/app/api/category/route";
import { EditCategoryRequest } from "@/app/api/category/[categoryId]/route";
import CategoryNode, { Category } from "./CategoryNode";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Button } from "../ui/button";

export default function CategoriesTree() {
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const [state, setState] = useState({
    isLoading: false,
    response: [],
    error: undefined,
  });

  console.log(state);

  const fetchCategories = async () => {
    setState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/category/tree");
      const data = await response.json();

      if (data.error) {
        setState((previous) => ({
          ...previous,
          response: [],
          error: data.error,
        }));
      } else {
        setState((previous) => ({
          ...previous,
          response: data,
          error: undefined,
        }));
      }
    } catch (error) {
      setState((previous) => ({
        ...previous,
        response: [],
        error: undefined,
      }));
    } finally {
      setState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategoryHandler = async (name: string) => {
    const reqBody: AddCategoryRequest = { name: name };

    const resp: Response = await fetch("/api/category", {
      method: "POST",
      body: JSON.stringify(reqBody),
    });

    if (resp.status == 500) {
      toast("Error creating category", {
        description: "An error occurred while creating the category",
      });
      return;
    }

    await fetchCategories();

    toast("Category successfully created", {
      description: `Category ${name} has been created`,
    });
  };

  const deleteCategoryHandler = async (id: number, name: string) => {
    const resp: Response = await fetch(`/api/category/${id}`, {
      method: "DELETE",
    });

    if (resp.status == 500) {
      toast("Error deleting category", {
        description: "An error occurred while deleting the category",
      });
      return;
    }

    await fetchCategories();

    toast("Category deleted", {
      description: `Category '${name}' has been deleted successfully`,
    });
  };

  const editCategoryHandler = async (id: number, name: string) => {
    const reqBody: EditCategoryRequest = { name: name };

    const resp: Response = await fetch(`/api/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(reqBody),
    });

    if (resp.status == 500) {
      toast("Error modifying category", {
        description: "An error occurred while modifying the category",
      });
      return;
    }

    await fetchCategories();

    toast("Category modified", {
      description: `Category has been modified successfully`,
    });
  };

  const moveCategoryHandler = async (
    dragIds: string[],
    parentId: string | null
  ) => {
    const reqBody: EditCategoriesParentRequest = {
      categoryIds: dragIds.map((id) => parseInt(id)),
      parentId: parentId ? parseInt(parentId) : null,
    };

    console.log(reqBody);

    const resp: Response = await fetch("/api/category", {
      method: "PUT",
      body: JSON.stringify(reqBody),
    });

    if (resp.status == 500) {
      toast("Error moving category", {
        description: "An error occurred while moving the category",
      });
      return;
    }

    await fetchCategories();

    toast("Category moved", {
      description: `Category has been moved successfully`,
    });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground">
            Create, edit, delete, and move your categories easily.
          </p>
        </header>

        {/* Action Toolbar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <CreateCategoryDialog
              isOpen={isAddCategoryDialogOpen}
              setIsOpen={setIsAddCategoryDialogOpen}
              createCategoryHandler={createCategoryHandler}
            />
            <Button variant="outline" onClick={fetchCategories}>
              Refresh
            </Button>
          </div>
          {state.isLoading && (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
        </div>

        {/* Categories Tree Card */}
        <div className="bg-card p-4 rounded-md shadow-sm border h-[600px]">
          <>
            {state.response.length == 0 || state.error ? (
              <p className="text-center text-muted-foreground py-6">
                No categories available. Start by creating one!
              </p>
            ) : (
              <AutoSizer>
                {({ width, height }) => (
                  <Tree<Category>
                    data={state.response}
                    onMove={({ dragIds, parentId }) =>
                      moveCategoryHandler(dragIds, parentId)
                    }
                    rowHeight={40}
                    height={height}
                    width={width}
                  >
                    {(nodeProps) => (
                      <CategoryNode
                        {...nodeProps}
                        deleteCategoryHandler={deleteCategoryHandler}
                        editCategoryHandler={editCategoryHandler}
                      />
                    )}
                  </Tree>
                )}
              </AutoSizer>
            )}
          </>
        </div>
      </div>
    </>
  );
}
