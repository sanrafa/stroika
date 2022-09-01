import { useParams } from "react-router-dom";
import { Column } from "../components";

function ProjectView() {
  const { id } = useParams();

  return (
    <>
      <div className="bg-project p-4 m-4 h-5/6 flex justify-between overflow-x-auto">
        <h1>{id}</h1>
      </div>
    </>
  );
}

export default ProjectView;
