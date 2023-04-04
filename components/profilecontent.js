import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import AddHabitFormButton from "./AddHabitFormButton";
import Card from "./card";
import FriendInfo from "./friendinfo";
import PostCard from "./postcard";

export default function ProfileContent({ activeTab, userId }) {
	const [posts, setPosts] = useState([]);
	const [habits, setHabits] = useState([]);
	const [dayStarted, setDayStarted] = useState(false);
	const [profile, setProfile] = useState(null);
	const supabase = useSupabaseClient();
	useEffect(() => {
		if (!userId) {
			return;
		}
		fetchUserHabits(userId);
		if (activeTab === "posts") {
			loadPosts().then(() => {});
		}
	}, [userId]);
	const hour = new Date().getHours();

	useEffect(() => {
		if (!hour) {
			resetDay(userId);
		}
	}, [hour]);
    useEffect(() => {
        const changeInHabits = supabase
        .channel('habit-change')
        .on('postgres_changes', {
            event: '*',
            shchema: 'public',
            table: 'habits'
        }, (payload) => {
            fetchUserHabits(userId);
        }).subscribe();

    }, [])
	async function resetDay(userId) {
		// const habitData = await fetchUserHabits(userId);
		const { data, error } = await supabase.from("habits").update([
			{
				isCompletedToday: false
			}
		]);
		setDayStarted(false);
	}

	async function loadPosts() {
		const posts = await userPosts(userId);
		const profile = await userProfile(userId);
		setPosts(posts);
		setProfile(profile);
	}

	async function userPosts(userId) {
		const { data } = await supabase
			.from("posts")
			.select("id,content,created_at, author")
			.eq("author", userId);
		return data;
	}

	async function userProfile(userId) {
		const { data } = await supabase.from("profiles").select().eq("id", userId);
		return data[0];
	}

	async function fetchUserHabits(userId) {
		const { data, error } = await supabase
			.from("habits")
			.select("habitName, isCompletedToday, id")
			.eq("userId", userId)
            .eq('isCompletedToday', false);
		if (!error) {
			let habits = [];
			for (let i = 0; i < data.length; i++) {
				const habit = {};
				habit.habitName = data[i].habitName;
				habit.isCompletedToday = data[i].isCompletedToday;
				habit.id = data[i].id;
				habits.push(habit);
			}
			setHabits(habits);
			return data;
		} else {
			console.log("error in fetchUserHabits function: ", error);
		}
	}

	async function markHabitDone(habitId) {
		const { data, error } = await supabase
			.from("habits")
			.update([{ isCompletedToday: true }])
			.eq("id", habitId)
			.select();
		if (!error) {
			// do confetti animation to celebrate
			setHabits(data);
			setDayStarted(true);
			const posted = await generatePost(userId, habitId);
			if (posted) {
				return true;
			}
		} else {
			console.log("error in markHabitDone: ", error);
		}
	}

    async function generatePost(userId, habitId) {
        const habitName = await supabase
        .from('habits')
        .select('habitName')
        .eq('id', habitId);

        const { data, error } = await supabase
        .from('posts')
        .insert([{
            content: `${habitName.data[0].habitName} ✅`,
            author: userId
        }])
        if(!error){
            return true;
        }
    }

	return (
		<div>
			{activeTab === "posts" && (
				<div>
					{posts.length > 0 &&
						posts.map((post) => (
							<PostCard key={post.created_at} {...post} profiles={profile} />
						))}
				</div>
			)}
			{activeTab === "about" && (
				<div>
					<Card>
						<h2 className="text-2xl mb-4">About Me </h2>
						<p className="mb-4 text-sm">
							Things I'd rather be doing right now...
						</p>
						<p className="mb-4 text-sm">Your Mom!</p>
					</Card>
				</div>
			)}
			{activeTab === "friends" && (
				<div>
					<Card>
						<h2>Friends</h2>
						<div className="grid gap-6 grid-cols-2">
							<FriendInfo />
							<FriendInfo />
							<FriendInfo />
							<FriendInfo />
							<FriendInfo />
							<FriendInfo />
							<FriendInfo />
							<FriendInfo />
						</div>
					</Card>
				</div>
			)}
			{activeTab === "habits" && (
				<div>
                    <AddHabitFormButton />
					<Card>
						{habits.length ? (
							habits.map((habitObj) => (
								<div key={nanoid()} className="flex flex-col ">
									<h3>{habitObj.habitName}</h3>
                                    <div className='flex'>
									    <label className='ml-3 mr-2'>Mark done</label>
									    <input type="checkbox" onChange={() => markHabitDone(habitObj.id)} />
                                    </div>
								</div>
							))
						) : (
							<h5>Add some habits you can stick to!</h5>
						)}
					</Card>
				</div>
			)}
		</div>
	);
}
