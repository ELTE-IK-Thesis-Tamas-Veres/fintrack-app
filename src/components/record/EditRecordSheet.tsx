import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { SelectCategoryComboBox } from "./SelectCategoryComboBox";

import { EditRecordRequest, Record } from "@/types/DTO/Record";
import { GetCategoryResponse } from "@/types/DTO/Category";
import { toast } from "sonner";

export function EditRecordSheet({
  editRecordHandler,
  original,
  isSheetOpen,
  setIsSheetOpen,
}: {
  editRecordHandler: (request: EditRecordRequest) => Promise<void>;
  original: Record;
  isSheetOpen: boolean;
  setIsSheetOpen: (isOpen: boolean) => void;
}) {
  const [description, setDescription] = React.useState<string>(
    original.description
  );

  const [amount, setAmount] = React.useState<string>(`${original.amount}`);
  const [date, setDate] = React.useState<Date>(new Date(original.date));
  const [selectedCategory, setSelectedCategory] =
    React.useState<GetCategoryResponse | null>(null);

  React.useEffect(() => {
    setDescription(original.description);
    setAmount(`${original.amount}`);
    setDate(new Date(original.date));
    setSelectedCategory(original.category ?? null);
  }, [original]);

  const submitHandler = async () => {
    const formattedDate = date.toISOString().split("T")[0];

    const parsed = parseInt(amount, 10);
    if (isNaN(parsed)) {
      toast("Error creating record", {
        description: "Amount must be a number",
      });
    } else {
      const body: EditRecordRequest = {
        id: original.id,
        amount: parseInt(amount, 10),
        categoryId: selectedCategory ? selectedCategory.id : null,
        date: formattedDate,
        description: description,
      };

      await editRecordHandler(body);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit record</SheetTitle>
          <SheetDescription>
            You can edit the details of the record here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              id="description"
              value={description}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Amount
            </Label>
            <Input
              onChange={(e) => {
                const value = e.target.value; // Remove unnecessary spaces

                const validNumberRegex = /^-?(?:\d+|\d*\.\d+)$/;

                if (
                  validNumberRegex.test(value) ||
                  value === "-" ||
                  value === ""
                ) {
                  setAmount(value);
                }
              }}
              id="amount"
              value={amount}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <SelectCategoryComboBox
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              initiallySelectedCategoryId={
                original.category ? original.category.id : undefined
              }
              label={true}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
              >
                <Select
                  onValueChange={(value) =>
                    setDate(addDays(new Date(), parseInt(value)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In a week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => {
                      if (day) setDate(day);
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" variant={"secondary"}>
              Close
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              onClick={() => submitHandler()}
              type="submit"
              variant={"default"}
            >
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
