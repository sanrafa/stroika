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
      <h1 className="text-center text-5xl tracking-widest font-josefin mt-4">
        PROJECTS
      </h1>
      <AddProjectForm />
      <p className="text-center p-8 text-2xl">
        Click on a project title below to visit an existing project:
      </p>
      {projects.length ? (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 p-6">
          {projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </ul>
      ) : (
        <p className="text-center mt-8 font-manrope text-md tracking-wide">
          Looks like you don't have any projects yet... Use the form above to
          add one!
        </p>
      )}
    </>
  );
}

export default ProjectsPage;
