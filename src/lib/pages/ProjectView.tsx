import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setCurrentProject } from "../store/actions";
import { Column } from "../components";
import React from "react";

function ProjectView() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const project = useAppSelector(
    (state) => state.projects.entities[id as string]
  );

  React.useEffect(() => {
    if (id) dispatch(setCurrentProject({ id }));
  }, []);

  return (
    <>
      <div className="bg-project p-4 m-4 h-5/6 flex flex-1 justify-between overflow-x-auto">
        {project?.columns.map((id) => (
          <Column id={id} key={id} />
        ))}
      </div>
    </>
  );
}

export default ProjectView;
