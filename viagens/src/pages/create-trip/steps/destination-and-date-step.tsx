import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react"
import { Button } from "../../../components/button"
import { useState } from "react"
import { DateRange, DayPicker } from "react-day-picker"
import { format } from "date-fns"
import "react-day-picker/dist/style.css";

interface DestinationAndDateStepProps {
    isGuestsInputOpen: boolean,
    eventStartAndEndDates: DateRange | undefined,
    closeGuestsInput: () => void,
    openGuestsInput: () => void,
    setDestination: (destination: string) => void,
    setEventStartAndEndDates: (dates: DateRange | undefined) => void,
   
}


export function DestinationAndDateStep({
    isGuestsInputOpen,
    closeGuestsInput,
    openGuestsInput,
    setDestination,
    setEventStartAndEndDates,
    eventStartAndEndDates
    

} : DestinationAndDateStepProps ) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)


  function openDatePicker() {
    return setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false)
  }

    const diplayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to ? 
    format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to,"d' de 'LLL")) : null


    return (
        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3 ">
        <div className="flex items-center gap-1 flex-1 md:gap-2">
          <MapPin className="text-zinc-400 size-3  md:size-5"  />
            <input disabled={isGuestsInputOpen} 
            type="text" 
            placeholder="Para onde você vai?"
            className="bg-transparent placeholder-zinc-400 outline-none flex-1 text-xs  md:text-lg"
            onChange={event => setDestination(event.target.value)} />
        </div>
        <button onClick={openDatePicker}   disabled={isGuestsInputOpen}  className="flex items-center gap-1 text-left w-[60px]  md:w-[240px] md:gap-2">
          <Calendar className=" text-zinc-400  size-3  md:size-5" />
            <span className="text-zinc-400  w-40 flex-1 text-xs  md:text-lg">{diplayedDate || 'Quando?'} </span>
        </button>
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
        <div className="w-px h-6 bg-zinc-800" />
        {isGuestsInputOpen ? (
        
          <Button onClick={closeGuestsInput} variant="secondary" >
          Alterar local/data <Settings2 className="size-3 md:size-5"  />
        </Button>
        ) : (
         
            <Button onClick={openGuestsInput} variant="primary">
              Continuar <ArrowRight className="size-3 md:size-5" />
            </Button>
        )}
      </div>
    )
}