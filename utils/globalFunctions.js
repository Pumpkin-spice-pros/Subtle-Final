import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function fetchPosts() {
	const { data, error } = await supabase
		.from("posts")
		.select("id,content, created_at, photos, profiles(id,avatar,name)")
		.order("created_at", { ascending: false });
        if(data) {
            return data;
        } else if (error){
            return false;
        }
}
