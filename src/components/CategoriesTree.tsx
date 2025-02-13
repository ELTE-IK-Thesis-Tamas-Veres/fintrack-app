"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { NodeRendererProps, Tree } from "react-arborist";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { AddCategoryRequest } from "@/app/api/category/route";
import { EditCategoryRequest } from "@/app/api/category/[categoryId]/route";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesTree() {
  const { user } = useUser();
  const { toast } = useToast();

  const [isAddCategoryDialogOpen, setIsAddCategoryDDialogOpen] =
    useState(false);

  const [state, setState] = useState({
    isLoading: false,
    response: [],
    error: undefined,
  });

  const createCategoryHandler = async (name: string) => {
    const reqBody: AddCategoryRequest = { name: name };

    await fetch("/api/category", {
      method: "POST",
      body: JSON.stringify(reqBody),
    });

    await fetchCategories();

    toast({
      title: "Category successfully created",
      description: `Category ${name} has been created`,
    });

    console.log("category created");
  };

  const deleteCategoryHandler = async (id: number) => {
    await fetch(`/api/category/${id}`, {
      method: "DELETE",
    });

    await fetchCategories();

    toast({
      title: "Category deleted",
      description: "Category has been deleted",
    });

    console.log("category deleted");
  };

  const editCategoryHandler = async (id: number, name: string) => {
    const reqBody: EditCategoryRequest = { name: name };

    await fetch(`/api/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(reqBody),
    });
  };

  useEffect(() => {
    //fetchCategories();
  }, []);
  // const data = [
  //   { id: "1", name: "Unread" },
  //   { id: "2", name: "Threads" },
  //   {
  //     id: "3",
  //     name: "Chat Rooms",
  //     children: [
  //       { id: "c1", name: "General" },
  //       { id: "c2", name: "Random" },
  //       {
  //         id: "c3",
  //         name: "Open Source Projects",
  //         children: [
  //           { id: "g1", name: "Alice" },
  //           { id: "g2", name: "Bob" },
  //           { id: "g3", name: "Charlie" },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "4",
  //     name: "Direct Messages",
  //     children: [
  //       { id: "d1", name: "Alice" },
  //       { id: "d2", name: "Bob" },
  //       { id: "d3", name: "Charlie" },
  //     ],
  //   },
  // ];

  const fetchCategories = async () => {
    setState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/category");
      const data = await response.json();

      console.log(data);

      setState((previous) => ({
        ...previous,
        response: data,
        error: undefined,
      }));
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

  const handle = async (event, fn) => {
    event.preventDefault();
    await fn();
  };

  const { isLoading, response, error } = state;

  return (
    <>
      <Button
        onClick={() =>
          toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          })
        }
      />
      <div>
        <button
          className="btn btn-blue"
          color="primary"
          onClick={(e) => handle(e, fetchCategories)}
          data-testid="external-action"
        >
          Ping API
        </button>
      </div>
      <div className="result-block-container">
        {isLoading && <div className="loading">Loading...</div>}
        {(error || response) && (
          <div className="result-block" data-testid="external-result">
            <h6 className="muted">Result</h6>
            {error && <p>error</p>}
            {response && <p>{response.length}</p>}
          </div>
        )}
      </div>
      <>
        {user && (
          <div>
            <h2>Welcome {user.name}!</h2>
            <p>{user.email}</p>
          </div>
        )}
      </>
      <CreateCategoryDialog
        isOpen={isAddCategoryDialogOpen}
        setIsOpen={setIsAddCategoryDDialogOpen}
        createCategoryHandler={createCategoryHandler}
      />
      <Tree<Category>
        data={state.response}
        onMove={({ dragIds, parentId, index }) =>
          console.log("moved", dragIds, parentId, index)
        }
        rowHeight={30}
        height={800}
        width={600}
      >
        {(nodeProps) => (
          <Node
            {...nodeProps}
            deleteCategoryHandler={deleteCategoryHandler}
            editCategoryHandler={editCategoryHandler}
          />
        )}
      </Tree>
    </>
  );
}

const Node = ({
  node,
  style,
  dragHandle,
  deleteCategoryHandler,
  editCategoryHandler,
}: NodeRendererProps<Category> & {
  deleteCategoryHandler: (id: number) => void;
  editCategoryHandler: (id: number, name: string) => void;
}) => {
  /* This node instance can do many things. See the API reference. */
  return (
    <div
      className={node.isSelected ? "bg-chart-5 rounded-md" : ""}
      style={style}
      ref={dragHandle}
    >
      <span className="pl-2 inline-flex items-center space-x-1">
        <span
          className="inline-flex items-center space-x-1"
          onClick={() => {
            node.toggle();
          }}
        >
          {node.isLeaf ? (
            <Folder size={16} strokeWidth={2.25} />
          ) : node.isOpen ? (
            <ChevronDown />
          ) : (
            <ChevronRight />
          )}
          <span>{node.data.name}</span>
        </span>
        <DeleteCategoryDialog
          id={node.data.id}
          deleteCategory={deleteCategoryHandler}
        />
        <EditCatgeoryDialog
          id={node.data.id}
          currentName={node.data.name}
          editCategoryHandler={editCategoryHandler}
        />
      </span>
    </div>
  );
};

const DeleteCategoryDialog = ({
  id,
  deleteCategory,
}: {
  id: number;
  deleteCategory: (id: number) => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="text-primary" size={16} strokeWidth={2.25} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive"
            onClick={() => deleteCategory(id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CreateCategoryDialog = ({
  isOpen,
  setIsOpen,
  createCategoryHandler,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  createCategoryHandler: (name: string) => void;
}) => {
  const [name, setName] = useState("new category name");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new category</DialogTitle>
          <DialogDescription>
            Create new category. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => createCategoryHandler(name)} type="submit">
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditCatgeoryDialog = ({
  id,
  currentName,
  editCategoryHandler,
}: {
  id: number;
  currentName: string;
  editCategoryHandler: (id: number, name: string) => void;
}) => {
  const [name, setName] = useState(currentName);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Pencil className="text-primary" size={16} strokeWidth={2.25} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Make changes to your category. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              onKeyDown={(e) => e.stopPropagation()}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              editCategoryHandler(id, name);
              setIsOpen(false);
            }}
            type="submit"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
