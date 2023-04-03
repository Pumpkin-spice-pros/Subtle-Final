import Card from "./card"
import Avatar from "./avatar"
import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { UserContext } from "@/contexts/usercontext"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
export default function PostCard ({id,content, photos, profiles:authorProfile}) {
    const[dropdownOpen,setDropdownOpen] = useState (false)
    const {profile:myProfile} = useContext(UserContext)
    const [likes, setLikes] = useState ([])
    const supabase = useSupabaseClient();

  useEffect( () => {
    // fetchLikes();
    supabase
			.from("likes")
			.select()
			.eq("post_id", id)
			.then((result) => setLikes(result.data));
  }, [supabase, id]);
  
  // function fetchLikes() {
  //   supabase.from('likes')
  //   .select()
  //   .eq('post_id', id)
  //   .then(result =>
  //     setLikes(result.data))
  // }

  const isLiked = !!likes.find(like => like.user_id === myProfile.id)

  function toggleLike() {
    if(isLiked){
      supabase.from('likes')
      .delete()
      .eq('post_id', id)
      .eq('user_id', myProfile.id)
      .then(result =>{
        console.log('delete result', result)
        fetchLikes();
      })
      return;
    }
    supabase.from('likes')
    .insert({
      post_id: id,
      user_id: myProfile.id,
    })
    .then(result =>{
      fetchLikes();
    })
   
  }


    return( 
        <Card>
        <div className='flex gap-3'>
        <div> 
            <Link href={'/profile'}>
        <span className="cursor-pointer">
        <Avatar url={authorProfile.avatar}/>
        </span>
        </Link>
        </div>
        <div className="grow">
          <p>
          <Link href={'/profile/' + authorProfile.id}>
            <span className='mr-1 font-semibold cursor-pointer hover:underline'>
            {authorProfile.name}
            </span> 
            </Link>
            shared a post</p>
          <p className='text-gray-500 text-sm'>2hrs ago</p>
        </div>
        <div>
           <button onClick={()=> !dropdownOpen && setDropdownOpen(true)}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
         <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
            </button> 
                <div className="relative">
                {dropdownOpen && (
                      <div className="absolute -right-6 bg-white shadow-md shadow-gray-400 p-3 rounded-sm w-52">
                      <a href="" className="flex gap-3 py-2  my-2 hover:bg-emerald-200 -mx-4 px-4 rounded-md transition-all hover:scale-110 ">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                        Bookmark</a>
                      <a href=""className="flex gap-3 py-2  my-2 hover:bg-emerald-200 -mx-4 px-4 rounded-md transition-all hover:scale-110 ">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                      </svg>                     
                        Notify</a>
                      <a href=""className="flex gap-3 py-2  my-2 hover:bg-emerald-200 -mx-4 px-4 rounded-md transition-all hover:scale-110 ">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>   
                       Delete</a>
                      <a href=""className="flex gap-3 py-2  my-2 hover:bg-emerald-200 -mx-4 px-4 rounded-md transition-all hover:scale-110 ">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>    
                    Edit</a>
                  </div>
                )}
                </div> 
        </div>
        </div>
        <div>
            <p className="my-3 text-sm">{content}</p>
            {photos?.length > 0 && (
                  <div className="flex gap-4 ">
                  {photos.map(photo => (
                    <div key = {photo}>
                    <img src={photo} className ="object-contain h-auto w-96 rounded-md transition-all hover:scale-110" alt= ""/> 
                    </div>
                  ))}
                  </div>
            )}
          
        </div>
        <div className="mt-5 flex gap-7">
            <button className="flex gap-2 items-center" onClick={toggleLike}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
            </svg>
            {likes?.length}
            </button>
            <button className="flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            50
            </button>
            <button className="flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            2
            </button>
        </div>
        <div className="flex mt-4 gap-3">
            <div>
            <Avatar url={myProfile?.avatar}/>
            </div>
            <div className="border grow rounded-full relative ">
            <textarea className=" bloack w-full p-3 px-4 overflow-hidden h-12 rounded-full" placeholder="Leave a Comment"></textarea>
            <button className="absolute top-3 right-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            </button>
            </div>
        </div>
      </Card>
    )
}