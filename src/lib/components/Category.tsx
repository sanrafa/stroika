import {
  Checkbox,
  CheckboxIndicator,
  Feature as FeatureComponent,
  DeleteCategoryDialog,
  Tooltip,
} from "./index";
import {
  ChevronDownIcon as Chevron,
  PlusCircledIcon as AddIcon,
  TrashIcon as DeleteIcon,
  DragHandleDots2Icon as DragIcon,
} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import React from "react";
import { useAppDispatch, useProxySelector } from "../store/hooks";
import {
  updateCategory,
  addFeature,
  toggleCategorySuspended,
  deleteCategory,
} from "../store/actions";
import { getCategoryById } from "../store/categories";
import { getFeaturesByCategory } from "../store/features";
import { nanoid } from "@reduxjs/toolkit";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type CategoryProps = {
  id: string;
};

export default function CategoryBase({ id }: CategoryProps) {
  const dispatch = useAppDispatch();
  const category = useProxySelector(
    (state) => getCategoryById(state, id),
    [id]
  );
  const features = useProxySelector(
    (state) => getFeaturesByCategory(state, id),
    [id]
  );
  const categoryFeatureIds = features
    ? (features.map((feat) => feat?.id) as string[])
    : [];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
    setDroppableNodeRef,
  } = useSortable({
    id,
    data: {
      type: "category",
      name: category?.name,
      parentId: category?.columnId,
      columnId: category?.columnId,
    },
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [suspended, setSuspended] = React.useState(category?.suspended);
  const [name, setName] = React.useState(category?.name || "");

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const addRef = React.useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    dispatch(
      updateCategory({
        id: id,
        changes: {
          name: name.trim(),
        },
      })
    );
    setName(name.trim());
  };

  const handleDelete = () => {
    dispatch(
      deleteCategory({
        id,
        columnId: category?.columnId as string,
      })
    );
  };

  return (
    <Accordion.Root type="single" asChild collapsible>
      <div
        style={sortableStyle}
        ref={setNodeRef}
        className={`flex flex-col bg-category justify-between m-1 pb-2 font-manrope text-compText rounded-md shadow-md max-h-[75%] max-w-11/12 opacity-90 hover:opacity-100 focus-within:opacity-100  ${
          suspended ? "bg-slate-900" : null
        }`}
      >
        <Accordion.Item value={category?.name as string} asChild>
          <>
            <Accordion.Header asChild>
              <header className="flex items-center justify-between pr-4 md:space-x-8">
                <div className="flex flex-col items-center justify-center p-4 leading-3 md:-mr-6">
                  {features.length &&
                  !features.every((feat) => feat?.completed) ? (
                    <div className="flex flex-col sm:-mr-4 lg:-mr-0">
                      <span className="text-sm font-bold">{`${
                        features.filter((feat) => feat?.completed === true)
                          .length
                      } / ${features.length}`}</span>
                      <span className="text-xxs text-categoryToggleUnchecked stroke-black">
                        features <br /> complete
                      </span>
                    </div>
                  ) : (
                    <Checkbox
                      aria-label="mark category as suspended"
                      checked={suspended}
                      onCheckedChange={() => {
                        dispatch(
                          toggleCategorySuspended({
                            id,
                            suspended: !suspended,
                            columnId: category?.columnId as string,
                          })
                        );
                        setSuspended(!suspended);
                      }}
                      className="bg-categoryToggleUnchecked w-7 h-7 flex justify-center items-center shadow-inset rounded mb-2"
                    >
                      <CheckboxIndicator>
                        <div className="bg-categoryToggleChecked w-7 h-7 shadow-[0px_2px_4px_rgba(0, 0, 0, 0.17)] rounded-sm"></div>
                      </CheckboxIndicator>
                    </Checkbox>
                  )}

                  <Accordion.Trigger asChild>
                    <button
                      type="button"
                      className="-mb-4 focus:outline-1"
                      ref={triggerRef}
                      aria-label="show features"
                    >
                      <Chevron width={32} height={32} color="black" />
                    </button>
                  </Accordion.Trigger>
                </div>

                <div className="mr-4 flex flex-col justify-evenly">
                  <form
                    className="mt-2 mb-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                      addRef?.current?.focus();
                    }}
                  >
                    <input
                      type="text"
                      aria-label="category name"
                      onBlur={handleSubmit}
                      className={`text-compText focus:text-black bg-category focus:bg-compText cursor-pointer text-center p-1 text-lg lg:text-2xl w-full rounded-md focus:cursor-text ${
                        suspended
                          ? "bg-slate-800 text-slate-500 cursor-default"
                          : null
                      }`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={suspended}
                    />
                    <button
                      type="submit"
                      className="hidden"
                      aria-label="update category name"
                    ></button>
                  </form>
                  <div className="flex items-center justify-center ">
                    <button
                      ref={setActivatorNodeRef}
                      {...attributes}
                      {...listeners}
                      className="cursor-grab"
                      aria-label="category drag handle"
                    >
                      <DragIcon
                        className="block text-slate-500 hover:text-compText rotate-90"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-4 mt-2">
                  <button
                    aria-label="add new feature"
                    type="button"
                    ref={addRef}
                    disabled={suspended}
                    className={
                      suspended
                        ? "opacity-50"
                        : "hover:text-green-600 focus:text-green-600"
                    }
                    onClick={() => {
                      dispatch(
                        addFeature({
                          id: nanoid(5),
                          categoryId: id,
                          columnId: category?.columnId as string,
                          projectId: category?.projectId as string,
                        })
                      );
                      triggerRef?.current?.focus();
                    }}
                  >
                    <Tooltip content="Add Feature" side="right" align="end">
                      <AddIcon width={24} height={24} />
                    </Tooltip>
                  </button>
                  {category?.features.length && category.features.length > 1 ? (
                    <DeleteCategoryDialog
                      categoryId={id}
                      columnId={category?.columnId as string}
                      categoryName={category?.name as string}
                    >
                      <button
                        aria-label="delete category"
                        type="button"
                        disabled={suspended}
                        className={
                          suspended
                            ? "opacity-50"
                            : "hover:text-red-600 focus:text-red-600"
                        }
                      >
                        <Tooltip
                          content="Delete Category"
                          side="left"
                          align="center"
                        >
                          <DeleteIcon width={24} height={24} />
                        </Tooltip>
                      </button>
                    </DeleteCategoryDialog>
                  ) : (
                    <button
                      aria-label="delete category"
                      onClick={handleDelete}
                      type="button"
                      disabled={suspended}
                      className={
                        suspended
                          ? "opacity-50"
                          : "hover:text-red-600 focus:text-red-600"
                      }
                    >
                      <Tooltip
                        content="Delete Category"
                        side="left"
                        align="center"
                      >
                        <DeleteIcon width={24} height={24} />
                      </Tooltip>
                    </button>
                  )}
                </div>
              </header>
            </Accordion.Header>
            <Accordion.Content
              asChild
              id={`${category?.id}-category-slider`}
              aria-label={`${category?.name} features`}
            >
              <div
                ref={setDroppableNodeRef}
                className="bg-featureContainer shadow-category text-white w-[97%] self-center min-h-[100px] mb-1.5 rounded-sm overflow-y-auto space-y-2 p-2 hide-scroll"
              >
                <SortableContext
                  items={categoryFeatureIds}
                  strategy={verticalListSortingStrategy}
                >
                  {categoryFeatureIds.map((featId) => (
                    <FeatureComponent id={featId as string} key={featId} />
                  ))}
                </SortableContext>
              </div>
            </Accordion.Content>
          </>
        </Accordion.Item>
      </div>
    </Accordion.Root>
  );
}
