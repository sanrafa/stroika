import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../lib/store/hooks";
import { setCurrentProject } from "../lib/store/actions";
import { getProjectById } from "../lib/store/projects";
import { Column } from "../lib/components";
import React from "react";

function ProjectView() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const project = useAppSelector((state) =>
    getProjectById(state, id as string)
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
