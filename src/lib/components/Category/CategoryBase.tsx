import { Checkbox, CheckboxIndicator } from "../index";
import { ChevronDownIcon as Chevron } from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";

type CategoryProps = {
  name: string;
};

export default function CategoryBase({ name }: CategoryProps) {
  return (
    <Accordion.Root type="single" asChild collapsible>
      <div className="flex bg-category justify-between m-1 flex-col">
        <Accordion.Item value={name} asChild>
          <>
            <Accordion.Header asChild>
              <header className="flex items-center justify-flex-start lg:space-x-16 md:space-x-8">
                <div className="flex flex-col items-center justify-center p-4">
                  <Checkbox className="bg-categoryToggleUnchecked w-7 h-7 flex justify-center items-center shadow-inset rounded mb-2">
                    <CheckboxIndicator>
                      <div className="bg-categoryToggleChecked w-7 h-7 shadow-[0px_2px_4px_rgba(0, 0, 0, 0.17)] rounded-sm" />
                    </CheckboxIndicator>
                  </Checkbox>
                  <Accordion.Trigger asChild={true}>
                    <button type="button">
                      <Chevron width={32} height={32} />
                    </button>
                  </Accordion.Trigger>
                </div>

                <h3 className="lg:text-3xl md:text-2xl sm:text-xl p-2">
                  {name}
                </h3>
              </header>
            </Accordion.Header>
            <Accordion.Content asChild={true}>
              <div className="bg-featureContainer shadow-category text-white w-[97%] self-center min-h-[100px] mb-1.5 rounded-sm"></div>
            </Accordion.Content>
          </>
        </Accordion.Item>
      </div>
    </Accordion.Root>
  );
}
