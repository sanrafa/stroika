import {
  Checkbox,
  CheckboxIndicator,
  Feature as FeatureComponent,
} from "./index";
import {
  ChevronDownIcon as Chevron,
  PlusCircledIcon as AddIcon,
  TrashIcon as DeleteIcon,
} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  updateCategory,
  deleteCategory,
  addFeature,
  toggleCategorySuspended,
} from "../store/actions";
import { getCategoryById } from "../store/categories";
import { getFeaturesByCategory } from "../store/features";
import { nanoid } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

type CategoryProps = {
  id: string;
};

export default function CategoryBase({ id }: CategoryProps) {
  const dispatch = useAppDispatch();
  const category = useAppSelector((state) => getCategoryById(state, id));
  const features = useAppSelector((state) => getFeaturesByCategory(state, id));
  const [suspended, setSuspended] = React.useState(category?.suspended);

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(category?.name || "");

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
    setIsEditing(false);
  };

  return (
    <Accordion.Root type="single" asChild collapsible>
      <div
        className={`flex flex-col bg-category justify-between m-1 pb-2 font-manrope text-compText rounded-md shadow-md max-h-[75%] max-w-11/12 opacity-90 hover:opacity-100  ${
          suspended ? "opacity-50" : null
        }`}
      >
        <Accordion.Item value={category?.name as string} asChild>
          <>
            <Accordion.Header asChild>
              <header className="flex items-center justify-between pr-4 md:space-x-8">
                <div className="flex flex-col items-center justify-center p-4 leading-3 md:-mr-6">
                  {features.length ? (
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

                  <Accordion.Trigger asChild={true}>
                    <button type="button" className="-mb-4">
                      <Chevron width={32} height={32} color="black" />
                    </button>
                  </Accordion.Trigger>
                </div>

                <form
                  onClick={() => setIsEditing(true)}
                  className="mr-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <input
                    type="text"
                    onBlur={handleSubmit}
                    disabled={!isEditing}
                    className="text-black disabled:text-compText disabled:bg-category disabled:cursor-pointer text-center p-1 text-lg lg:text-2xl w-full rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    ref={(input) => {
                      if (input !== null) {
                        input.focus();
                      }
                    }}
                  />
                  <button type="submit" className="hidden"></button>
                </form>

                <div className="flex flex-col space-y-4 mt-2">
                  <button
                    type="button"
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
                    }}
                  >
                    <AddIcon width={24} height={24} />
                  </button>
                  <button
                    type="button"
                    disabled={suspended}
                    className={
                      suspended
                        ? "opacity-50"
                        : "hover:text-red-600 focus:text-red-600"
                    }
                    onClick={() => {
                      toast.success(`"${category?.name}" deleted.`, {
                        className: "bg-red-300 font-bold",
                        duration: 1500,
                        iconTheme: {
                          primary: "red",
                          secondary: "white",
                        },
                      });
                      dispatch(
                        deleteCategory({
                          id,
                          columnId: category?.columnId as string,
                        })
                      );
                    }}
                  >
                    <DeleteIcon width={24} height={24} />
                  </button>
                </div>
              </header>
            </Accordion.Header>
            <Accordion.Content asChild id="category-slider">
              <div className="bg-featureContainer shadow-category text-white w-[97%] self-center min-h-[100px] mb-1.5 rounded-sm overflow-y-auto space-y-2 p-2 hide-scroll">
                {features.map((feat) => (
                  <FeatureComponent id={feat?.id as string} key={feat?.id} />
                ))}
              </div>
            </Accordion.Content>
          </>
        </Accordion.Item>
      </div>
    </Accordion.Root>
  );
}
