import { createContext, useContext, useState } from "react";

interface CategoryDialogContextType {
  isDeleteCategoryDialogOpen: boolean;
  setIsDeleteCategoryDialogOpen: (open: boolean) => void;

  isEditCategoryDialogOpen: boolean;
  setIsEditCategoryDialogOpen: (open: boolean) => void;

  deleteCategoryId: string | null;
  setDeleteCategoryId: (id: string | null) => void;

  editCategoryId: string | null;
  setEditCategoryId: (id: string | null) => void;
}

const CategoryDialogContext = createContext<
  CategoryDialogContextType | undefined
>(undefined);

export const CategoryDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  return (
    <CategoryDialogContext.Provider
      value={{
        isDeleteCategoryDialogOpen: isOpen,
        setIsDeleteCategoryDialogOpen: setIsOpen,
        deleteCategoryId,
        setDeleteCategoryId,
        isEditCategoryDialogOpen,
        setIsEditCategoryDialogOpen,
        editCategoryId,
        setEditCategoryId,
      }}
    >
      {children}
    </CategoryDialogContext.Provider>
  );
};

export const useCategoryDialog = () => {
  const context = useContext(CategoryDialogContext);
  if (!context) {
    throw new Error(
      "useCategoryDialog must be used within a categoryDialogProvider"
    );
  }
  return context;
};
