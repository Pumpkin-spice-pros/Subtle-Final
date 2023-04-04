import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import AddHabitFormButton from "./AddHabitFormButton";
import Card from "./card";
import FriendInfo from "./friendinfo";
import PostCard from "./postcard";
import confetti from "canvas-confetti";

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
			.channel("habit-change")
			.on(
				"postgres_changes",
				{
					event: "*",
					shchema: "public",
					table: "habits"
				},
				(payload) => {
					fetchUserHabits(userId);
				}
			)
			.subscribe();
	}, []);
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
			.eq("isCompletedToday", false);
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
			setHabits(data);
			setDayStarted(true);
			const posted = await generatePost(userId, habitId);
			if (posted) {
				let duration = 5 * 1000;
				let animationEnd = Date.now() + duration;
				let defaults = {
					startVelocity: 30,
					spread: 360,
					ticks: 60,
					zIndex: 0
				};

				function randomInRange(min, max) {
					return Math.random() * (max - min) + min;
				}
				let interval = setInterval(function () {
					let timeLeft = animationEnd - Date.now();
					if (timeLeft <= 0) {
						return clearInterval(interval);
					}
					let particleCount = 50 * (timeLeft / duration);
					// since particles fall down, start a bit higher than random
					confetti(
						Object.assign({}, defaults, {
							particleCount,
							origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
						})
					);
					confetti(
						Object.assign({}, defaults, {
							particleCount,
							origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
						})
					);
				}, 250);
				return true;
			}
		} else {
			console.log("error in markHabitDone: ", error);
		}
	}

	async function generatePost(userId, habitId) {
		const habitName = await supabase
			.from("habits")
			.select("habitName")
			.eq("id", habitId);

		const { data, error } = await supabase.from("posts").insert([
			{
				content: `${habitName.data[0].habitName} ✅`,
				author: userId
			}
		]);
		if (!error) {
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
                    <div className='flex justify-between'>
                        <h1 className='text-2xl'>Todays Habits</h1>
					    <AddHabitFormButton />
                    </div>
					<Card>
						{habits.length ? (
							<div>
								{habits.map((habitObj) => (
									<div key={nanoid()} className="flex flex-col ">
										<h3>{habitObj.habitName}</h3>
										<div className="flex">
											<label className="ml-3 mr-2">Mark done</label>
											<input
												type="checkbox"
												onChange={() => markHabitDone(habitObj.id)}
											/>
										</div>
									</div>
								))}
							</div>
						) : (
							<h5>No habits are left for today!</h5>
						)}
					</Card>
				</div>
			)}
		</div>
	);
}
