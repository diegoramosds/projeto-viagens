import { Plus } from "lucide-react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./importants-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-header";
import { useState } from "react";

export function TripDetailsPage() {

  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestModalOpen] = useState(false)

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
  }


  return (
    <div className="max-w-6xl px-0 md:px-5 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader />

      <main className="flex gap-2 md:gap-5 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base  md:text-xl lg:text-3xl font-semibold">Atividades</h2>

            <button  onClick={openCreateActivityModal} className="bg-lime-300 text-lime-950 rounded-lg px-1 py-0 md:py-2 w-24 md:w-52 lg:w-64 md:px-5
             font-medium flex items-center gap-0 text-xs md:text-base md:gap-2 hover:bg-lime-400">
              <Plus className="size-5" />
              Cadastrar atividade
            </button>
          </div>

          <Activities />
        </div>

        <div className="w-24 md:w-80 space-y-6">
          <ImportantLinks />

          <div className="w-24 h-px md:w-full bg-zinc-800" />

        <Guests 
        isGuestsModalOpen={isGuestsModalOpen}
         setIsGuestModalOpen={setIsGuestModalOpen}/>
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal 
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}
    </div>
  )
}