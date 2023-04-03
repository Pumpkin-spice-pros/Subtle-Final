import Avatar from "./avatar"

export default function FriendInfo () {
    return(
        <div className="flex gap-2">
        <Avatar/>
        <div>
        <h3 className="font-bold text-xl"> Your Mom</h3>
        <div className="text-sm leading-4">5 mutual friends</div>
        </div>
        </div>
     )
}