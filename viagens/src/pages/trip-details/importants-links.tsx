import { Edit2, Link2, Plus, X } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface Link {
  title: string;
  url: string;
}

export function ImportantLinks() {
  const { tripId } = useParams<{ tripId: string }>();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLinksModal, setIsLinksModal] = useState(false);
  const [title, setTitle]= useState('');
  const [url, setUrl]= useState('');


  const [loading, setLoading]= useState(false);

  function openLinksModal() {
    setIsLinksModal(true)
  }

  function closeLinksModal() {
    setIsLinksModal(false)
  }



  const fetchLinks = useCallback(async () => {
    try {
      const response = await api.get(`/trips/${tripId}/links`);
      const fetchedLinks = response.data.links;

      if (Array.isArray(fetchedLinks)) {
        setLinks(fetchedLinks);
      } else {
        console.error('A propriedade links não é um array:');
      }
    } catch (error) {
      console.error('Erro ao buscar links:');
    }
  }, [tripId]);

    useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);


   async function  handleEnvLinks(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    if (!title || !url) {
      setLoading(false);
      return
    }

    try {
    const response = await api.post(`/trips/${tripId}/links`, {
      title,
      url
    })

    const newLink = response.data
      setLinks([...links, newLink])
      setTitle("")
      setUrl("")
      setLoading(false); 

    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      setLoading(false); 
    }
    window.document.location.reload()
  }


  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xs text-center md:text-xl md:text-left ">Links importantes</h2>
      {links.map((link, index) => (
  <div key={index} className="space-y-5">
    <div className="flex items-center justify-between gap-0 md:gap-4">
      <div className="space-y-1.5">
        <span className="block text-xs md:text-base font-medium text-zinc-100">{link.title}</span>
        <a href={link.url} className="block text-xs text-zinc-400 truncate hover:text-zinc-200">
          {link.url}
        </a>
      </div>
      <Link2 className="text-zinc-400 size-3 md:size-5 shrink-0" />
    </div>
  </div>
))}
    
      <Button variant="secondary" size="full" onClick={openLinksModal}>
        <Plus className="size-5" />
        Cadastrar novo link
      </Button>

      {isLinksModal && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
         <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
           <div className="space-y-2">
             <div className="flex items-center justify-between">
               <h2 className="font-lg font-semibold">Confirmar criação de viagem</h2>
               <button>
                 <X className="size-5 text-zinc-400" onClick={closeLinksModal} />
               </button>
             </div>
   
             <p className="text-sm text-zinc-400">
            Adicione aqui algum link referente a viagem
             </p>
           </div>
           
           <form onSubmit={handleEnvLinks} className="space-y-3">
             <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
               <Edit2 className="text-zinc-400 size-5" />
               <input
                 type="text"
                 name="title"
                 placeholder="Titulo"
                 
                 className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                 onChange={event => setTitle(event.target.value)}
                 disabled={loading}
               />
             </div>
   
             <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
               <Link2 className="text-zinc-400 size-5" />
               <input
                 type="text"
                 name="url"
                 placeholder="Link da viagem"
                 className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                 onChange={event => setUrl(event.target.value)}
                 disabled={loading}
               />
             </div>
     
             <Button type="submit" size="full"  disabled={loading}>
               {loading ? <ClipLoader className="text-zinc-400 size-4" /> : <p>Criar link</p>}
             </Button>
           </form>
         </div>
       </div>
      )}

    </div>
  )
}