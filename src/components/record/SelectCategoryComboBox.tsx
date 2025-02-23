"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GetCategoryResponse } from "@/app/api/category/route";
import { Label } from "../ui/label";
/*
type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];*/

export function SelectCategoryComboBox({
  selectedCategoryId,
}: {
  selectedCategoryId?: number;
}) {
  const [categoriesState, setCategoriesState] = React.useState<{
    isLoading: boolean;
    response: GetCategoryResponse[];
    error: unknown;
  }>({
    isLoading: false,
    response: [],
    error: undefined,
  });

  const fetchCategories = async () => {
    setCategoriesState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/category");
      const data = await response.json();

      if (data.error) {
        setCategoriesState((previous) => ({
          ...previous,
          response: [],
          error: data.error,
        }));
      } else {
        setCategoriesState((previous) => ({
          ...previous,
          response: data,
          error: undefined,
        }));
      }
    } catch (error) {
      setCategoriesState((previous) => ({
        ...previous,
        response: [],
        error: undefined,
      }));
    } finally {
      setCategoriesState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  React.useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = categoriesState.response.find(
        (category) => category.id === selectedCategoryId
      );
      setSelectedCategory(selectedCategory || null);
    }
  }, [categoriesState.response, selectedCategoryId]);

  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<GetCategoryResponse | null>(null);

  return (
    <>
      <Label className="text-right">Status</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedCategory ? (
              <>{selectedCategory.name}</>
            ) : (
              <>+ Set Category</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {categoriesState.response.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={(name) => {
                      setSelectedCategory(
                        categoriesState.response.find(
                          (category) => category.name === name
                        ) || null
                      );
                      setOpen(false);
                    }}
                  >
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
