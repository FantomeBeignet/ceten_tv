import { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { Dialog } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";

interface Props {
  imageName: string;
  removeImage: (imge: string) => void;
}

export default function ListDeleteButton({ imageName, removeImage }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { REACT_APP_SERVER_IP } = process.env;
  axios.defaults.baseURL = `http://${REACT_APP_SERVER_IP}:8080`;
  const displayName = imageName.split(".")[0];
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        className="fixed inset-0 p-8 m-auto text-gray-200 shadow-2xl w-fit max-w-[90%] rounded-2xl bg-gray-900 h-fit"
      >
        <Dialog.Overlay />
        <div className="flex justify-between flex-center">
          <Dialog.Title className="text-base font-semibold md:text-lg lg:text-xl">
            Supprimer l'image ?
          </Dialog.Title>
          <button onClick={() => setDialogOpen(false)}>
            <XIcon className="w-5 h-5 lg:h-6 lg:w-6" />
          </button>
        </div>
        <hr className="h-2 my-4 border-t-2 border-gray-700" />
        <Dialog.Description className="my-6 text-sm md:text-base lg:text-lg">
          Voulez-vous vraiment supprimer l'image {displayName} ? Cette action
          est définitive.
        </Dialog.Description>
        <div className="flex items-center justify-end gap-8">
          <button
            onClick={() => setDialogOpen(false)}
            className="flex items-center justify-center gap-2 text-red-600 border border-red-600 rounded-md w-fit px-2.5 py-1.5 lg:border-2 hover:bg-red-600 hover:text-gray-900"
          >
            <p className="hidden text-sm md:block md:text-base lg:text-lg">
              Annuler
            </p>
            <XIcon className="w-5 h-5 lg:h-6 lg:w-6" />
          </button>
          <button
            onClick={() => {
              removeImage(imageName);
              setDialogOpen(false);
              axios.get(`/api/delete/${imageName}`);
            }}
            className="flex items-center justify-center gap-2 border rounded-md w-fit px-2.5 py-1.5 lg:border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-gray-900"
          >
            <p className="hidden text-sm md:block md:text-base lg:text-lg">
              Confirmer
            </p>
            <CheckIcon className="w-5 h-5 lg:h-6 lg:w-6" />
          </button>
        </div>
      </Dialog>
      <button
        onClick={() => setDialogOpen(true)}
        className="flex items-center justify-center gap-2 px-2 py-2 text-red-600 border border-red-600 rounded-md w-fit lg:gap-4 lg:px-4 lg:py-3 lg:border-2 hover:bg-red-600 hover:text-gray-900"
      >
        <p className="hidden text-sm md:block md:text-base lg:text-xl">
          Supprimer
        </p>
        <TrashIcon className="w-5 h-5 lg:h-6 lg:w-6" />
      </button>
    </>
  );
}
