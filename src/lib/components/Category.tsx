import {
  Checkbox,
  CheckboxIndicator,
  Feature as FeatureComponent,
} from "./index";
import type { Feature } from "../mocks/features"; // TODO: put types in dedicated folder
import {
  ChevronDownIcon as Chevron,
  PlusCircledIcon as AddIcon,
} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import React from "react";
import { useAppSelector } from "../store/hooks";

type CategoryProps = {
  id: string;
};

export default function CategoryBase({ id }: CategoryProps) {
  /* This and the checkbox are PURELY PRESENTATIONAL at this time */
  const category = useAppSelector((state) => state.categories.entities[id]);
  const features = useAppSelector((state) =>
    Object.values(state.features.entities).filter((feat) =>
      category?.features.includes(feat?.id as string)
    )
  );
  const [suspended, setSuspended] = React.useState(false);
  return (
    <Accordion.Root type="single" asChild collapsible>
      <div
        className={`flex flex-col bg-category justify-between m-1 font-manrope text-compText rounded-md shadow-md max-h-[75%] min-w-fit  ${
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

                <h3 className="lg:text-3xl md:text-2xl sm:text-xl p-0.5 mr-2">
                  {category?.name}
                </h3>
                <button type="button" className="hover:text-green-600">
                  <AddIcon width={24} height={24} />
                </button>
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
