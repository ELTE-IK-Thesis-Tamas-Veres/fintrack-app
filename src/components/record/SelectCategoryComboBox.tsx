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
import { Label } from "../ui/label";
import { GetCategoryResponse } from "@/types/DTO/Category";

export function SelectCategoryComboBox({
  initiallySelectedCategoryId,
  selectedCategory,
  setSelectedCategory,
  label,
}: {
  initiallySelectedCategoryId?: number;
  selectedCategory: GetCategoryResponse | null;
  setSelectedCategory: (category: GetCategoryResponse | null) => void;
  label: boolean;
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
    if (initiallySelectedCategoryId) {
      const selectedCategory = categoriesState.response.find(
        (category) => category.id === initiallySelectedCategoryId
      );
      setSelectedCategory(selectedCategory || null);
    }
  }, [
    categoriesState.response,
    initiallySelectedCategoryId,
    setSelectedCategory,
  ]);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      {label && <Label className="text-right">Category</Label>}
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
        <PopoverContent className="w-[200px] p-0">
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
