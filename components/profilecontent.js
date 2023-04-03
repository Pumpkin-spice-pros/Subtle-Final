import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import Card from "./card"
import FriendInfo from "./friendinfo"
import PostCard from "./postcard"

export default function ProfileContent({activeTab, userId}) {
   const [posts, setPosts] = useState([])
   const [profile, setProfile] = useState(null)
   const supabase = useSupabaseClient();
    useEffect(()=>{
    if(!userId){
        return;
    }
     if(activeTab === 'posts') {
        loadPosts().then(()=> {})
     }
   },[userId])
   
   async function loadPosts() {
    const posts = await userPosts(userId)
    const profile = await userProfile(userId)
    setPosts(posts);
    setProfile(profile)
   }

   async function userPosts(userId) {
   const {data} = await supabase.from('posts')
    .select('id,content,created_at, author')
    .eq('author', userId)
    return data;
   }
   
   async function userProfile(userId){
    const {data} = await supabase.from('profiles')
    .select()
    .eq('id', userId)
    return data[0]
   }
   
    return (
     <div>
            {activeTab === 'posts' && (
            <div>
                 {posts.length > 0 && posts.map(post => (
                    <PostCard key={post.created_at} {...post} profiles={profile} />
                 ))}
            </div>
        )}
        {activeTab === 'about' && (
            <div>
              <Card>
              <h2 className="text-2xl mb-4">About Me </h2>  
              <p className="mb-4 text-sm">Things I'd rather be doing right now...</p>
              <p className="mb-4 text-sm">Your Mom!</p>
              </Card>  
            </div>
        )}
        {activeTab === 'friends' && (
            <div>
                <Card>
                    <h2>Friends</h2>
                    <div className="grid gap-6 grid-cols-2">
                        <FriendInfo/> 
                        <FriendInfo/> 
                        <FriendInfo/> 
                        <FriendInfo/> 
                        <FriendInfo/> 
                        <FriendInfo/> 
                        <FriendInfo/> 
                        <FriendInfo/> 
                    </div>
                </Card>
            </div>
        )}
        {activeTab === 'photos' && (
            <div>
                <Card>
                  <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md overflow-hidden h-48 flex items-center">
                       <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt=" " /> 
                    </div>
                    <div className="rounded-md overflow-hidden h-48 flex items-center">
                       <img src="https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt=" " /> 
                    </div>
                    <div className="rounded-md overflow-hidden h-48 flex items-center">
                       <img src="https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80" alt=" " /> 
                    </div>
                    <div className="rounded-md overflow-hidden h-48 flex items-center">
                       <img src="https://images.unsplash.com/photo-1599058918144-1ffabb6ab9a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80" alt=" " /> 
                    </div>
                  </div>
                </Card>
            </div>
        )}
     </div>   
    )
}