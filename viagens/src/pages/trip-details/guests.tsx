import { AtSign, CheckCircle2, CircleDashed, Plus, UserCog, X } from "lucide-react";
import { Button } from "../../components/button";
import { useState, useEffect, FormEvent, Dispatch, SetStateAction, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { ClipLoader } from "react-spinners";

interface Participants {
  id: string;
  name: string;
  email: string;
  is_confirmed: boolean;
}

interface GuestsProps {
  isGuestsModalOpen: boolean;
  setIsGuestModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function Guests({
  isGuestsModalOpen,
  setIsGuestModalOpen,
  
}: GuestsProps) {
  const { tripId } = useParams();
  const [participants, setParticipants] = useState<Participants[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoadind] = useState(false);
  
  function openGuestsModal() {
    setIsGuestModalOpen(true);
  }

  function closeGuestsModal() {
    setIsGuestModalOpen(false);
  }

  useEffect(() => {
    api.get(`/trips/${tripId}/participants`).then((response) => setParticipants(response.data.participants));
  }, [tripId]);



  const handleAddEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadind(true)
    const data = new FormData(event.currentTarget);
    const email = data.get('email')?.toString();

    if (!email || participants.some(p => p.email === email)) {
      return;
    }

    try {
      await api.post(`/trips/${tripId}/invites`, { email });
      setParticipants([...participants, { id: String(new Date().getTime()), name: `Convidado ${participants.length}`, email, is_confirmed: false }]);
      formRef.current?.reset();
      setLoadind(false)
    } catch (error) {
      console.error('Erro ao adicionar email:', error);
      setLoadind(false)
    }
  };

  // const handleRemove = (emailToRemove : string) => {
  // const updatedParticipants  = participants.filter(participant => participant.email !== emailToRemove);
    
  // setParticipants(updatedParticipants);


  // //delete
  
  // } 


  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-center text-xs md:text-xl md:text-left">Convidados</h2>

      <div className="space-y-5">
        {participants.map((participant, index) => (
          <div key={participant.id} className="flex items-center justify-between gap-0 md:gap-4">
            <div className="space-y-1.5">
            <span className="block text-xs md:text-base font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
              <span className="block text-sm text-zinc-400 truncate">
                {participant.email}
              </span>
            </div>

            {participant.is_confirmed ? (
              <CheckCircle2 className="text-green-400 size-4 md:size-5 shrink-0" />
            ) : (
              <CircleDashed className="text-zinc-400 size-3  md:size-5 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Button onClick={openGuestsModal} variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>

      {isGuestsModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center text-xs  md:text-base">
          <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-lg font-semibold">Selecionar convidados</h2>
                <button>
                  <X className="size-5 text-zinc-400" onClick={closeGuestsModal} />
                </button>
              </div>

              <p className="text-sm text-zinc-400">
                Os convidados irão receber e-mails para confirmar a participação na viagem.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {participants.map((newParticipant) => (
                <div key={newParticipant.id} className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2">
                  <span className="text-zinc-300 text-[.8em] md:text-base">{newParticipant.email}</span>
                  {/* <button  onClick={() => handleRemove(newParticipant.email)} type="button">
                    <X  className="size-4 text-zinc-400" />
                  </button> */}
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-zinc-800" />

            <form ref={formRef} onSubmit={handleAddEmail} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <div className="px-2 flex items-center flex-1 gap-2">
                <AtSign className="text-zinc-400 size-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Digite o email do convidado"
                  className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                />
              </div>

              <Button disabled={loading} type="submit">
              {loading ? <ClipLoader className="text-zinc-400 size-4" /> : <>Convidar <Plus className="size-5" /></>}
                
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
