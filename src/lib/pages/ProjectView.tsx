import { useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { Column } from "../components";

function ProjectView() {
  const { id } = useParams();
  const project = useAppSelector(
    (state) => state.projects.entities[id as string]
  );

  return (
    <>
      <div className="bg-project p-4 m-4 h-5/6 flex justify-between overflow-x-auto">
        {project?.columns.map((id) => (
          <Column id={id} />
        ))}
      </div>
    </>
  );
}

export default ProjectView;
