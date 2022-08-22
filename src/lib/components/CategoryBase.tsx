import { Checkbox, CheckboxIndicator } from "./index";

type CategoryProps = {
  name: string;
};

export default function CategoryBase({ name }: CategoryProps) {
  return (
    <div className="flex bg-category justify-around p-4">
      <div>
        <Checkbox className="bg-categoryToggleUnchecked w-7 h-7 flex justify-center items-center shadow-inset rounded">
          <CheckboxIndicator>
            <div className="bg-categoryToggleChecked w-7 h-7 shadow-[0px_2px_4px_rgba(0, 0, 0, 0.17)] rounded-sm" />
          </CheckboxIndicator>
        </Checkbox>
      </div>
      <h3 className="text-3xl">{name}</h3>
    </div>
  );
}
