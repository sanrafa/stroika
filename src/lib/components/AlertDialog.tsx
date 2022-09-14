import * as Alert from "@radix-ui/react-alert-dialog";
import React from "react";
import { useAppDispatch } from "../store/hooks";
import { deleteProject, deleteCategory } from "../store/actions";
import { toast } from "react-hot-toast";

type CatProps = {
  categoryId: string;
  categoryName: string;
  columnId: string;
  children: React.ReactNode;
};

export const DeleteCategoryDialog = ({
  categoryId,
  columnId,
  categoryName,
  children,
}: CatProps) => {
  const dispatch = useAppDispatch();

  return (
    <Alert.Root>
      <Alert.Trigger asChild>{children}</Alert.Trigger>
      <Alert.Portal>
        <Alert.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Alert.Content className="alert-content">
          <Alert.Title asChild>
            <h1 className="text-4xl">
              Delete{" "}
              <span className="text-blue-300 underline">{categoryName}</span> ?
            </h1>
          </Alert.Title>
          <Alert.Description asChild>
            <p>
              Are you sure you'd like to delete{" "}
              <span className="font-bold">{categoryName}</span>? <br /> Doing so
              will also delete all associated features/tasks.
            </p>
          </Alert.Description>
          <div className="flex w-full justify-around mt-4">
            <Alert.Cancel asChild>
              <button type="button" className="alert-cancel-btn">
                CANCEL
              </button>
            </Alert.Cancel>
            <Alert.Action asChild>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 p-1 rounded-md text-lg"
                onClick={() => {
                  dispatch(deleteCategory({ id: categoryId, columnId }));
                  toast.success(`"${categoryName}" deleted.`, {
                    className: "bg-red-300 font-bold",
                    duration: 1500,
                    iconTheme: {
                      primary: "red",
                      secondary: "white",
                    },
                  });
                }}
              >
                YES, DELETE
              </button>
            </Alert.Action>
          </div>
        </Alert.Content>
      </Alert.Portal>
    </Alert.Root>
  );
};

type Props = {
  projectId: string;
  projectName: string;
  children: React.ReactNode;
};

export const DeleteProjectDialog = ({
  projectId,
  projectName,
  children,
}: Props) => {
  const dispatch = useAppDispatch();

  return (
    <Alert.Root>
      <Alert.Trigger asChild>{children}</Alert.Trigger>
      <Alert.Portal>
        <Alert.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Alert.Content className="alert-content">
          <Alert.Title asChild>
            <h1 className="text-4xl">
              Delete{" "}
              <span className="text-blue-300 underline">{projectName}</span> ?
            </h1>
          </Alert.Title>
          <Alert.Description asChild>
            <p>
              Are you sure you'd like to delete{" "}
              <span className="font-bold">{projectName}</span>? <br /> Doing so
              will remove all associated data.
            </p>
          </Alert.Description>
          <div className="flex w-full justify-around mt-4">
            <Alert.Cancel asChild>
              <button type="button" className="alert-cancel-btn">
                CANCEL
              </button>
            </Alert.Cancel>
            <Alert.Action asChild>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 p-1 rounded-md text-lg"
                onClick={() => {
                  dispatch(deleteProject(projectId));
                  toast.success("Project deleted!", {
                    className: "bg-red-300 font-bold",
                    duration: 2000,
                    iconTheme: {
                      primary: "red",
                      secondary: "white",
                    },
                  });
                }}
              >
                DELETE PROJECT
              </button>
            </Alert.Action>
          </div>
        </Alert.Content>
      </Alert.Portal>
    </Alert.Root>
  );
};
