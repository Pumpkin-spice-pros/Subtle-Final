import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react"


export default function AddHabitFormButton() {
    const [displayed, setDisplayed] = useState(false);
    const [habitName, setHabitName] = useState('');
    const supabase = useSupabaseClient();
    const user = useUser();
    const userId = user?.id;
    async function makeHabit(userId) {
        console.log('userId: ', userId)
        const { data, error } = await supabase
        .from('habits')
        .insert({
            habitName: habitName,
            userId: userId,
            isCompletedToday: false
        });
        if(!error){
            setDisplayed(false);
        }
    }
  return (
		<div>
			<button
				className="bg-emerald-500 rounded-xl h-10 w-40"
				onClick={() => setDisplayed(!displayed)}>
				{displayed ? "Cancel" : "Add daily habit"}
			</button>
			{displayed && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						makeHabit(userId);
					}}
					className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-gray-200 mt-3 flex flex-col justify-around text-center absolute rounded-xl h-1/6 w-1/8">
					<input
						id="name"
						placeholder="Habit name..."
						className="h-1/4"
						value={habitName}
						onChange={(e) => setHabitName(e.target.value)}
					/>
					<button className="bg-emerald-500 rounded-xl w-100">Add</button>
				</form>
			)}
		</div>
	);
}
