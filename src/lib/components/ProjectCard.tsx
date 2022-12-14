import type { IProject } from "../types";
import { useAppSelector } from "../store/hooks";
import { Link } from "react-router-dom";
import { TrashIcon as DeleteIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { getPendingTasksByProject } from "../store/tasks";
import { DeleteProjectDialog, Tooltip } from "./index";

type Props = {
  project: IProject;
};

const ProjectCard = ({ project }: Props) => {
  const projectTasks = useAppSelector((state) =>
    getPendingTasksByProject(state, project.id)
  );

  return (
    <li className="text-slate-900 bg-compText rounded flex flex-col justify-around bg-opacity-80 hover:bg-opacity-100 font-manrope">
      <div className="p-2">
        <Link
          to={`/projects/${project.id}`}
          className="text-4xl font-josefin font-bold uppercase"
        >
          {project.name}
        </Link>
        <hr className="w-11/12 bg-black m-1 p-[1px]" />
      </div>
      <div className="p-2 space-y-4">
        <p>
          <strong>Created on:</strong>
          <br />
          {format(Date.parse(project.createdAt), "PPP '|' p")}
        </p>

        <p>
          <strong>Last edited on:</strong>
          <br />
          {project.updatedAt
            ? format(Date.parse(project.updatedAt), "PPP '|' p")
            : null}
        </p>
      </div>
      <div className="flex justify-between">
        <DeleteProjectDialog projectId={project.id} projectName={project.name}>
          <button
            type="button"
            id="delete-project-icon"
            className="text-red-900 hover:text-red-700 hover:bg-red-200 rounded-sm font-semibold p-1.5 m-1"
          >
            DELETE PROJECT
          </button>
        </DeleteProjectDialog>
        <p className="flex text-3xl items-center p-1 m-1 space-x-1">
          <Tooltip content="Tasks remaining ->" side="left" align="center">
            <ListBulletIcon
              width={24}
              height={24}
              className="text-green-700 mr-1"
            />
          </Tooltip>
          {projectTasks.length}
        </p>
      </div>
    </li>
  );
};

export default ProjectCard;
