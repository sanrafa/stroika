import * as Alert from "@radix-ui/react-alert-dialog";
import React from "react";
import { useAppDispatch } from "../store/hooks";
import { deleteProject } from "../store/actions";
import { toast } from "react-hot-toast";

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
        <Alert.Content className="bg-black text-compText fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg max-h-[85vh] flex flex-col items-center p-4 pb-8 border-2 border-taskView rounded-md space-y-6 font-manrope">
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
              <button
                type="button"
                className="bg-slate-500 hover:bg-slate-700 p-1 rounded-md"
              >
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
