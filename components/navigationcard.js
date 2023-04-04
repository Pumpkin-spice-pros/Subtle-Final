import { useRouter } from "next/router";
import Link from "next/link";
import Card from "./card"
import { ChatGPT } from "/components/chatGPT.js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function NavigationCard () {
    const router = useRouter;
    const {asPath:pathname} = router
    const activeElementClasses = 'flex gap-2 py-3 bg-emerald-500 text-white -mx-10 px-10 rounded-md';
    const nonActiveElementClasses = 'flex gap-3 py-2  my-2 hover:bg-emerald-200 -mx-4 px-4 rounded-md transition-all hover:scale-110';
   
    const supabase = useSupabaseClient();
    async function logout (){
      await supabase.auth.signOut();
    } 

    const [isChatOpen, setIsChatOpen] = useState(false);

    function toggleChat() {
      setIsChatOpen((prevState) => !prevState);
    }
   
    return(
        <Card>
       <div className="px-4 py-2">
       <h2 className='text-gray-400 font-bold mb-3'>Navigation</h2>
        <Link href='/' className={pathname === '/' ? activeElementClasses : nonActiveElementClasses}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
         Home
         </Link>
        <Link href='/profile/friends' className= {pathname === '/profile/friends' ? activeElementClasses : nonActiveElementClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        Friends
        </Link>
        <Link href='/bookmark' className={pathname === '/bookmark' ? activeElementClasses : nonActiveElementClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
         <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
         Saved Posts
         </Link>
        <Link href='/notifications' className={pathname === '/notifications' ? activeElementClasses : nonActiveElementClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
        </svg>
        Notifications
        </Link>

        <button onClick={() => setIsChatOpen(true)} className="w-full -my-2">
          <span className={nonActiveElementClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 6.5c0-2.48-3.582-4.5-8-4.5s-8 2.02-8 4.5 3.582 4.5 8 4.5c2.283 0 4.362-.431 5.932-1.114m1.534-2.386A11.073 11.073 0 002 6.5c0 2.982 2.7 5.5 6 5.5 1.826 0 3.5-.546 4.776-1.388m5.946-2.112a11.073 11.073 0 00-3.53-1.114C18.362 3.02 16.283 2.5 14 2.5s-4.362.52-5.932 1.114A11.073 11.073 0 002 6.5c0 2.982 2.7 5.5 6 5.5a6.117 6.117 0 01.776-.388c.719-.204 1.492-.312 2.324-.312s1.605.108 2.324.312c.27.076.545.166.824.272A6.117 6.117 0 0118 12c3.3 0 6-2.518 6-5.5z"/>
        </svg>
        ChatGPT
        </span>
        </button>
        {isChatOpen && (
          <div className="chat-wrapper fixed top-50 max-w-full left-10 w-full flex justify-start items-center z-50">
        <ChatGPT isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
        )}
        
        <button onClick={logout} className=  "w-full -my-2">
          <span   className={nonActiveElementClasses}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
          Logout
          </span>
     
        </button>
       </div>
       </Card>
    )
}