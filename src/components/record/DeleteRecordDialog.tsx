import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { Record } from "@/types/DTO/Record";

export const DeleteRecordDialog = ({
  deleteRecordHandler,
  record,
  isOpen,
  setIsOpen,
}: {
  deleteRecordHandler: (record: Record) => void;
  record: Record;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    record && (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              record and remove your data from our servers.
            </AlertDialogDescription>
            <AlertDialogDescription>
              <strong>ID: </strong> {record.id}
            </AlertDialogDescription>
            <AlertDialogDescription>
              <strong>Category: </strong>{" "}
              {record.category ? record.category.name : "---"}
            </AlertDialogDescription>
            <AlertDialogDescription>
              <strong>Description: </strong> {record.description}
            </AlertDialogDescription>
            <AlertDialogDescription>
              <strong>Amount: </strong> {record.amount} HUF
            </AlertDialogDescription>
            <AlertDialogDescription>
              <strong>Date: </strong>{" "}
              {new Date(record.date).toLocaleDateString()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRecordHandler(record)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};
