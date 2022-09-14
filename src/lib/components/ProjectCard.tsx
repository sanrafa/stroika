import type { IProject } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteProject } from "../store/actions";
import { Link } from "react-router-dom";
import {
  TrashIcon as DeleteIcon,
  CheckboxIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { getTasksByProject } from "../store/tasks";
import { DeleteProjectDialog } from "./index";

type Props = {
  project: IProject;
};

const ProjectCard = ({ project }: Props) => {
  const dispatch = useAppDispatch();
  const projectTasks = useAppSelector((state) =>
    getTasksByProject(state, project.id).filter((task) => !task.completed)
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
          {format(Date.parse(project.createdAt), "PPP '|' pp")}
        </p>

        <p>
          <strong>Last edited on:</strong>
          <br />
          {project.updatedAt
            ? format(Date.parse(project.updatedAt), "PPP '|' pp")
            : null}
        </p>
      </div>
      <div className="flex justify-between">
        <DeleteProjectDialog projectId={project.id} projectName={project.name}>
          <button
            type="button"
            className="text-red-900 hover:text-red-700 hover:bg-red-200 rounded-full p-1 m-1"
          >
            <DeleteIcon width={32} height={32} />
          </button>
        </DeleteProjectDialog>
        <p className="flex text-3xl items-center p-1 m-1 space-x-1">
          <ListBulletIcon
            width={24}
            height={24}
            className="text-green-700 mr-1"
          />
          {projectTasks.length}
        </p>
      </div>
    </li>
  );
};

export default ProjectCard;
