import Avatar from "@/components/avatar";
import Card from "@/components/card";
import Cover from "@/components/cover";
import Layout from "@/components/layout";
import ProfileContent from "@/components/profilecontent";
import ProfileTabs from "@/components/profiletabs";
import { UserContextProvider } from "@/contexts/usercontext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profile() {
	const [profile, setProfile] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [name, setName] = useState("");
	const [place, setPlace] = useState("");
	const router = useRouter();
	const tab = router?.query?.tab?.[0] || "posts";
	const session = useSession();
	const userId = router.query.id;

	const supabase = useSupabaseClient();
	// function fetchUser() {
	// 	supabase
	// 		.from("profiles")
	// 		.select()
	// 		.eq("id", userId)
	// 		.then((result) => {
	// 			if (result.error) {
	// 				throw result.error;
	// 			}
	// 			if (result.data) {
	// 				setProfile(result.data[0]);
	// 			}
	// 		});
	// }

	useEffect(() => {
		if (!userId) {
			return;
		}
		supabase
			.from("profiles")
			.select()
			.eq("id", userId)
			.then((result) => {
				if (result.error) {
					throw result.error;
				}
				if (result.data) {
					setProfile(result.data[0]);
				}
			});
	}, [userId, supabase]);

	function saveProfile() {
		supabase
			.from("profiles")
			.update({
				name,
				place
			})
			.eq("id", session.user.id)
			.then((result) => {
				if (!result.error) {
					setProfile((prev) => ({ ...prev, name, place }));
				}
				setEditMode(false);
			});
	}

	const isMyUser = userId === session?.user?.id;

	return (
		<Layout>
			<UserContextProvider>
				<Card noPadding={true}>
					<div className="relative overflow-hidden rounded-md">
						<Cover
							url={profile?.cover}
							editable={isMyUser}
							onChange={fetchUser}
						/>
						<div className="absolute top-24 left-4">
							{profile && (
								<Avatar
									url={profile.avatar}
									size={"lg"}
									editable={isMyUser}
									onChange={fetchUser}
								/>
							)}
						</div>
						<div className="p-4 pb-0">
							<div className="ml-24 md:ml-40 flex justify-between">
								<div>
									{editMode && (
										<div>
											<input
												type="text"
												className="border py-2 px-3 rounded-md"
												placeholder="Name"
												onChange={(ev) => setName(ev.target.value)}
												value={name}
											/>
										</div>
									)}
									{!editMode && (
										<h1 className="text-4xl font-bold">{profile?.name}</h1>
									)}
									{!editMode && (
										<div className="text-gray-500 leading-4">
											{profile?.place || "No Location Given"}
										</div>
									)}
									{editMode && (
										<div>
											<input
												type="text"
												className="border py-2 px-3 rounded-md"
												placeholder="Location"
												onChange={(ev) => setPlace(ev.target.value)}
												value={place}
											/>
										</div>
									)}
								</div>
								<div>
									{isMyUser && !editMode && (
										<button
											onClick={() => {
												setEditMode(true);
												setName(profile.name);
												setPlace(profile.place);
											}}
											className=" bg-emerald-500 py-1 px-2 rounded-md shadow-md shadow-gray-500">
											Edit
										</button>
									)}
									{isMyUser && editMode && (
										<button
											onClick={saveProfile}
											className=" bg-emerald-500 py-1 px-2 rounded-md shadow-md shadow-gray-500">
											Save Changes
										</button>
									)}
								</div>
							</div>
							<ProfileTabs active={tab} userId={profile?.id} />
						</div>
					</div>
				</Card>
				<ProfileContent activeTab={tab} userId={userId} />
			</UserContextProvider>
		</Layout>
	);
}
