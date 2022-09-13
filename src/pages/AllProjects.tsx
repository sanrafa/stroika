import { AddProjectForm, ProjectCard } from "../lib/components";
import { useAppSelector, useAppDispatch } from "../lib/store/hooks";
import { setCurrentProject } from "../lib/store/actions";
import { getAllProjects } from "../lib/store/projects";
import { Link } from "react-router-dom";
import React from "react";

function ProjectsPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(getAllProjects);

  React.useEffect(() => {
    dispatch(setCurrentProject({ id: null }));
  }, []);

  return (
    <>
      <h1>PROJECTS PAGE</h1>
      <AddProjectForm />
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </ul>
    </>
  );
}

export default ProjectsPage;
