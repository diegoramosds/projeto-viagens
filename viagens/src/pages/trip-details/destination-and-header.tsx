
import { MapPin, Calendar, Settings2, X, User } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";

interface Trip {
  id: string,
  destination: string,
  starts_at: string,
  ends_at: string,
  is_confirmed: boolean

}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()
  const [updateTrip , setUpdateTrip] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [newDestination, setNewDestination] = useState<string | undefined>(trip?.destination);
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()
 
  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response =>setTrip(response.data.trip))
  } , [tripId])


  const displayedDate = trip ? format(trip.starts_at, "d' de 'LLL").concat(' até ').concat(format(trip.ends_at, "d' de 'LLL"))
  : null

  const selectedDatesDisplay = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to
  ? `${format(eventStartAndEndDates.from, "d' de 'LLL")} até ${format(eventStartAndEndDates.to, "d' de 'LLL")}`
  : null;

  function openUpdateTrip() {
    setNewDestination(trip?.destination);
    setEventStartAndEndDates({
      from: trip ? new Date(trip.starts_at) : undefined,
      to: trip ? new Date(trip.ends_at) : undefined,
    });
    setUpdateTrip(true);
  }
 
  function closeUpdateTrip() {
      setUpdateTrip(false)
      }

  
      function openDatePicker() {
        return setIsDatePickerOpen(true)
      }
    
      function closeDatePicker() {
        return setIsDatePickerOpen(false)
      }


      async function handleUpdateTrip() {
        if (!eventStartAndEndDates || !eventStartAndEndDates.from || !eventStartAndEndDates.to || !newDestination) {
          return;
        }
    
        const starts_at = eventStartAndEndDates.from.toISOString();
        const ends_at = eventStartAndEndDates.to.toISOString();
        try {
          await api.put(`/trips/${tripId}`, {
            destination: newDestination,
            starts_at,
            ends_at
          });
    
          // Atualiza o estado da viagem com os novos dados
          setTrip({
            ...trip!,
            destination: newDestination,
            starts_at,
            ends_at
          });
    
          setUpdateTrip(false); // Fecha o pop-up após a atualização
        } catch (error) {
          console.error('Erro ao atualizar viagem:', error);
        }
      }
      
  return (
    <div className="px-3 md:px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between text-[.7em] md:text-base">
        <div className="flex items-center gap-1">
          <MapPin className="size-3 md:size-5 text-zinc-400" />
          <span className="text-zinc-100">{trip?.destination}</span>
        </div>

        <div className="flex items-center gap-1 md:gap-5">
          <div className="flex items-center gap-1">
            <Calendar className="size-3 md:size-5 text-zinc-400" />
            <span className="text-zinc-100">{displayedDate}</span>
          </div>

          <div className="w-px h-6 bg-zinc-800" />

          <Button onClick={openUpdateTrip} variant="secondary">
            Alterar local/data
            <Settings2 className="size-5" />
          </Button>

        {updateTrip && (
          <div>
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                  <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h2 className="font-lg font-semibold">Alterações sobre sua viagem</h2>
                        <button>
                          <X className="size-5 text-zinc-400" onClick={closeUpdateTrip} />
                        </button>
                      </div>
                      <p className="text-sm text-zinc-400">Faça aqui as alteraçõees necessarias da sua viagem</p>
                  </div>
                
                  
                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                      <User className="text-zinc-400 size-5" />
                      <input
                        type="text"
                        name="local"
                        value={newDestination}
                        onChange={event => setNewDestination(event.target.value)}
                        placeholder="Para onde você vai?"
                        className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"

                      />
                    </div>

                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                      <Calendar className="text-zinc-400 size-5" />
                      <button
                        onClick={openDatePicker}
                        className="bg-transparent text-lg placeholder-zinc-400 outline-none">
                        <span className="text-lg text-zinc-400  text-left">{selectedDatesDisplay || 'Quando?'}</span>
                      </button>

                    </div>

                    <Button size="full" onClick={handleUpdateTrip}>
                      Confirmar alteração da viagem
                    </Button>
              </div>
          </div>   
        </div>
        )}
        {isDatePickerOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
           <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className='text-lg font-semibold'>Selecione a data</h2>
                <button onClick={closeDatePicker}><X className="size-5 text-zinc-400" /></button>
              </div>
              
            </div>
            
            <DayPicker mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates}/>
          </div>   
    </div>
        )}
        </div>
      </div>
  )
}
