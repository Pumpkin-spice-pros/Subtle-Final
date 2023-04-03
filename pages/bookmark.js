import Layout from "@/components/layout";
import PostCard from "@/components/postcard";

export default function Bookmark () {
    return (
        <Layout>
            <h1 className="text-6xl text-gray-300">Bookmarked Habits</h1>
            <PostCard/>
            <PostCard/>
            <PostCard/>

        </Layout>
    )
}