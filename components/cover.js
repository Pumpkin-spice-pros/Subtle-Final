import { uploadUserProfileimg } from "@/helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function Cover ({url,editable, onChange}) {
    const supabase = useSupabaseClient();
    const [isUplaoding, setIsUploading] = useState (false)
    const session = useSession();
    async function updateCover (ev) {
            const file =ev.target.files?.[0];
            if(file){
                setIsUploading(true);
             await uploadUserProfileimg(supabase, session.user.id, file , 'covers', 'cover')
                setIsUploading(false);
                if(onChange) onChange();
            }
    }
    return (
        <div className="h-36 overflow-hidden flex justify-center items-center relative">
        <div> 
            <img src= {url} alt=""/>
        </div>
        {isUplaoding && (
            <div className="absolute inset-0 bg-white opacity-60"> 

            </div>
        )}
        {editable && (
            <div className="absolute right-0 bottom-0 m-2">  
                <label className="bg-emerald-500 py-1 px-2 rounded-md shadow-md shadow-black">
                    <input type= "file" onChange={updateCover} className="hidden"/>
                    Edit img
                </label>
            </div>
        )}
        </div>
    );
}