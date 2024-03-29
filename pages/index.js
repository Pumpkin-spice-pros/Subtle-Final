import { Inter } from 'next/font/google'
import PostFormCard from '@/components/postformcard'
import PostCard from '@/components/postcard'
import Layout from '@/components/layout'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import LoginPage from './login'
import { useEffect, useState } from 'react'
import { UserContext } from '@/contexts/usercontext';
import { fetchPosts } from '@/utils/globalFunctions'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const supabase= useSupabaseClient();
  const session = useSession();
  const [posts,setPosts] = useState([])
  const [profile,setProfile] =useState (null)

  async function getPosts() {
    const postData = await fetchPosts();
    if(postData){
      setPosts(postData)
    }
  }
  useEffect( () => {
    getPosts();
  },[])

  	useEffect(() => {
			supabase
				.channel("new-posts")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "posts"
					},
					(payload) => {
						getPosts();
					}
				)
				.subscribe();
		}, []);
  
  useEffect( () => {

    if(!session?.user?.id){
      return
    };
    supabase.from('profiles')
    .select()
    .eq('id', session.user.id)
    .then(result => {
        if(result.data.length){
            setProfile(result.data[0]);
        }
    })
  }, [session?.user?.id]);

  // function fetchPosts (){
  //   supabase.from('posts')
  //   .select('id,content, created_at, photos, profiles(id,avatar,name)')
  //   .order('created_at', {ascending:false})
  //   .then(result => {
  //     setPosts(result.data);
  //   })
  // }

if(!session){
  return <LoginPage/>
};

  return (
   <Layout>
    <UserContext.Provider value={{profile}}>
     <PostFormCard onPost={fetchPosts}/>
        {posts?.length > 0 && posts.map(post => (
        <PostCard key={post.created_at} {...post}/>
        ))}
       </UserContext.Provider>
   </Layout>
  )
}
