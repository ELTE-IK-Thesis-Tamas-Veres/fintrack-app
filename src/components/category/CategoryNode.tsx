import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { NodeRendererProps } from "react-arborist";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";

export interface Category {
  id: number;
  name: string;
}

const CategoryNode = ({
  node,
  style,
  dragHandle,
  deleteCategoryHandler,
  editCategoryHandler,
}: NodeRendererProps<Category> & {
  deleteCategoryHandler: (id: number, name: string) => void;
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
          className="cursor-pointer inline-flex items-center space-x-1"
          onClick={() => {
            node.toggle();
          }}
        >
          {node.children?.length == 0 ? (
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
          name={node.data.name}
          deleteCategory={deleteCategoryHandler}
        />
        <EditCategoryDialog
          id={node.data.id}
          currentName={node.data.name}
          editCategoryHandler={editCategoryHandler}
        />
      </span>
    </div>
  );
};

export default CategoryNode;
