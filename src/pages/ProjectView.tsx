import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../lib/store/hooks";
import {
  setCurrentProject,
  sortCategoriesOnDragEnd,
  sortFeaturesOnDragEnd,
  updateManyTasks,
} from "../lib/store/actions";
import { getProjectById } from "../lib/store/projects";
import { getSortedColumnIdsByProject } from "../lib/store/columns";
import { Column, ColumnDndContext } from "../lib/components";
import React from "react";
import { addAppListener } from "../lib/store/listener";
import type { ITask } from "../lib/types";

function ProjectView() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const project = useAppSelector((state) =>
    getProjectById(state, id as string)
  );
  const currentProject = useAppSelector(
    (state) => state.session.currentProjectId
  );
  const columnIds = useAppSelector((state) =>
    getSortedColumnIdsByProject(state, id as string)
  ) as string[];

  React.useEffect(() => {
    if (id && project?.id) {
      dispatch(setCurrentProject({ id }));
    }
    return;
  }, []);

  React.useEffect(() => {
    return dispatch(
      addAppListener({
        actionCreator: sortCategoriesOnDragEnd,
        effect: (action, listenerApi) => {
          const { newColId, activeId } = action.payload;
          if (newColId) {
            const tasksToArchive = Object.values(
              listenerApi.getState().tasks.entities
            )
              .filter(
                (task) =>
                  task?.columnId === newColId && task.categoryId === activeId
              )
              .map((task) => ({ ...task, archived: true })) as ITask[];
            listenerApi.dispatch(updateManyTasks(tasksToArchive));
          }
        },
      })
    );
  }, [id]);

  React.useEffect(() => {
    return dispatch(
      addAppListener({
        actionCreator: sortFeaturesOnDragEnd,
        effect: (action, listenerApi) => {
          const { activeId, newColId, prevColId } = action.payload;

          if (newColId !== prevColId) {
            const tasksToArchive = Object.values(
              listenerApi.getState().tasks.entities
            )
              .filter((task) => task?.featureId === activeId)
              .map((task) => ({ ...task, archived: true })) as ITask[];
            listenerApi.dispatch(updateManyTasks(tasksToArchive));
          }
        },
      })
    );
  }, [id]);

  return (
    <>
      <div className="bg-project p-4 m-4 h-5/6 flex flex-1 justify-between overflow-x-auto">
        {currentProject ? (
          <ColumnDndContext colIds={columnIds}>
            {columnIds.map((id) => (
              <Column id={id} key={id} />
            ))}
          </ColumnDndContext>
        ) : (
          <p>Sorry, looks like this project doesn't exist :\</p>
        )}
      </div>
    </>
  );
}

export default ProjectView;
