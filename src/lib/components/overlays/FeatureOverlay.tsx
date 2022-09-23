import { useAppSelector } from "../../store/hooks";
import { getFeatureById } from "../../store/features";

type FeatureProps = {
  id: string;
};

export default function FeatureOverlay({ id }: FeatureProps) {
  const feature = useAppSelector((state) => getFeatureById(state, id));

  return (
    <div className="flex justify-center items-center bg-featureDrag leading-none p-2 rounded shadow-md font-manrope cursor-grabbing">
      <h1 className="text-1xl">{feature?.name}</h1>
    </div>
  );
}
