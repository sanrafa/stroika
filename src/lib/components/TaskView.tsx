import { Checkbox, CheckboxIndicator } from "./index";
import { ITask } from "../types";

type TaskViewProps = {
  tasks: ITask[];
};

type TaskProps = {
  description: string;
  completed: boolean;
};

const Task = () => {
  return <h1>A task</h1>;
};

export default function TaskView() {
  return <h1>Tasks</h1>;
}
