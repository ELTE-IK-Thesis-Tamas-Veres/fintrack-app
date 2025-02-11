"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
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
import { describe } from "node:test";

export default function CategoriesTree() {
  const { user } = useUser();

  const [state, setState] = useState({
    isLoading: false,
    response: undefined,
    error: undefined,
  });
  /*
  const { toast } = useToast();

  // 1. Data State
  const [categories, setCategories] = useState([]);

  // 2. UI State for Dialog
  const [isAddCategoryDialogOpen, setIsAddCategoryDDialogOpen] =
    useState(false);

  // 3. Form State for New Category
  const [formData, setFormData] = useState({ name: "" });

  // 4. Loading State for API Call
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /*
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        console.log(data);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    //fetchCategories();
  }, []);

  const handleSave = async () => {
    setIsSubmitting(true);
    // Close the dialog immediately (optimistic UI)
    setIsAddCategoryDDialogOpen(false);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("API error");

      // Show success notification
      toast({
        title: "Category added",
        description: "Your category has been added successfully",
      });

      // Refetch the updated list of categories
      const updatedRes = await fetch("/api/categories");
      const updatedData = await updatedRes.json();
      setCategories(updatedData);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
      });
    } finally {
      setIsSubmitting(false);
    }
  };*/
  const data = [
    { id: "1", name: "Unread" },
    { id: "2", name: "Threads" },
    {
      id: "3",
      name: "Chat Rooms",
      children: [
        { id: "c1", name: "General" },
        { id: "c2", name: "Random" },
        {
          id: "c3",
          name: "Open Source Projects",
          children: [
            { id: "g1", name: "Alice" },
            { id: "g2", name: "Bob" },
            { id: "g3", name: "Charlie" },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Direct Messages",
      children: [
        { id: "d1", name: "Alice" },
        { id: "d2", name: "Bob" },
        { id: "d3", name: "Charlie" },
      ],
    },
  ];

  const fetchCategories = async () => {
    setState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/category");
      const data = await response.json();

      setState((previous) => ({
        ...previous,
        response: data,
        error: undefined,
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        response: undefined,
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
            {response && <p>{JSON.stringify(response, null, 2)}</p>}
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
      <Dialog
      // open={isAddCategoryDialogOpen}
      // onOpenChange={setIsAddCategoryDDialogOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Add Category</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Create new category. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Tree
        data={data}
        onMove={({ dragIds, parentId, index }) =>
          console.log("moved", dragIds, parentId, index)
        }
      >
        {Node}
      </Tree>
    </>
  );
}

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  /* This node instance can do many things. See the API reference. */
  //const { setIsDeleteCategoryDialogOpen } = useCategoryDialog();
  return (
    <div style={style} ref={dragHandle}>
      <span className="inline-flex items-center space-x-1">
        <span
          className="inline-flex items-center space-x-1"
          onClick={() => node.toggle()}
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
        {/* <Trash2
          onClick={() => setIsDeleteCategoryDialogOpen(true)}
          size={16}
          strokeWidth={2.25}
        /> */}
        {/* <DeleteAlertDialog id={node.data.id} />
        <EditDialog id={node.data.id} currentName={node.data.name} /> */}
      </span>
    </div>
  );
}

const deleteCategory = (id) => {
  console.log("delete:", id.id);
};

const editCategory = (id, name) => {
  console.log("edit:", id, name);
};
/*
const DeleteAlertDialog = ({ id }: { id: string }) => {
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
          <AlertDialogAction onClick={() => deleteCategory(id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EditDialog = ({
  id,
  currentName,
}: {
  id: string;
  currentName: string;
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
            Make changes to your category. Click save when you're done.
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
              editCategory(id, name);
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
*/
