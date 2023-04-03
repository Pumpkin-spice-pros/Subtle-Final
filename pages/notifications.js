import Avatar from "@/components/avatar";
import Card from "@/components/card";
import Layout from "@/components/layout";
import Link from "next/link";

export default function NotificationsPage () {
    return(
      <Layout>
        <h1 className="text-6xl text-gray-300">Notifications</h1>
        <Card noPadding={true}>
            <div className="">
            <div className="flex gap-3 items-center border-b border-b-gray-100 p-4">
               <Link href={'/profile'}>
                <Avatar/>
                </Link>
                <div>
                    <Link href={'/profile'} className={'font-semibold mr-1 hover:underline'}>John </Link>
                    mentioned your mom in a 
                    <Link href={''} className={'ml-1 text-emerald-500 hover:underline'}>post</Link>
                </div>
            </div>
            <div className="flex gap-3 items-center border-b border-b-gray-100 p-4">
               <Link href={'/profile'}>
                <Avatar/>
                </Link>
                <div>
                    <Link href={'/profile'} className={'font-semibold mr-1 hover:underline'}>John </Link>
                    mentioned your mom in a 
                    <Link href={''} className={'ml-1 text-emerald-500 hover:underline'}>post</Link>
                </div>
            </div>
            <div className="flex gap-3 items-center border-b border-b-gray-100 p-4">
               <Link href={'/profile'}>
                <Avatar/>
                </Link>
                <div>
                    <Link href={'/profile'} className={'font-semibold mr-1 hover:underline'}>John </Link>
                    mentioned your mom in a 
                    <Link href={''} className={'ml-1 text-emerald-500 hover:underline'}>post</Link>
                </div>
            </div>
           
            </div>
        </Card>
      </Layout>  
    )
}