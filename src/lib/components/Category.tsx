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
import { updateCategory, deleteCategory, addFeature } from "../store/actions";
import { getCategoryById } from "../store/categories";
import { getFeaturesByCategory } from "../store/features";
import { nanoid } from "@reduxjs/toolkit";

type CategoryProps = {
  id: string;
};

export default function CategoryBase({ id }: CategoryProps) {
  const dispatch = useAppDispatch();
  const category = useAppSelector((state) => getCategoryById(state, id));
  const features = useAppSelector((state) => getFeaturesByCategory(state, id));
  const [suspended, setSuspended] = React.useState(category?.suspended);
  React.useEffect(() => {
    dispatch(
      updateCategory({
        id: id,
        changes: {
          suspended: suspended,
        },
      })
    );
  }, [suspended]);

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(category?.name);

  return (
    <Accordion.Root type="single" asChild collapsible>
      <div
        className={`flex flex-col bg-category justify-between m-1 pb-2 font-manrope text-compText rounded-md shadow-md max-h-[75%] max-w-11/12  ${
          suspended ? "opacity-50" : null
        }`}
      >
        <Accordion.Item value={category?.name as string} asChild>
          <>
            <Accordion.Header asChild>
              <header className="flex items-center justify-between pr-4 md:space-x-8">
                <div className="flex flex-col items-center justify-center p-4 leading-3 ">
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
                      defaultChecked={suspended}
                      onCheckedChange={() => setSuspended(!suspended)}
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

                {isEditing ? (
                  <form
                    className="mr-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      dispatch(
                        updateCategory({
                          id: id,
                          changes: {
                            name: name,
                          },
                        })
                      );
                      setIsEditing(false);
                    }}
                  >
                    <input
                      type="text"
                      autoFocus
                      className="text-black text-center p-1 text-md w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" className="hidden"></button>
                  </form>
                ) : (
                  <h3
                    className="lg:text-3xl md:text-2xl sm:text-3xl p-0.5 mr-2 cursor-pointer"
                    tabIndex={0}
                    onClick={() => setIsEditing(!isEditing)}
                    onKeyUp={(e) => {
                      if (e.key == "Enter") setIsEditing(true);
                    }}
                  >
                    {category?.name}
                  </h3>
                )}
                <div className="flex flex-col space-y-4 mt-2">
                  <button
                    type="button"
                    className="hover:text-green-600 focus:text-green-600"
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
                    className="hover:text-red-600 focus:text-red-600"
                    onClick={() =>
                      dispatch(
                        deleteCategory({
                          id,
                          columnId: category?.columnId as string,
                        })
                      )
                    }
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
