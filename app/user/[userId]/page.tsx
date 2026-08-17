"user client"
import { createClient } from "@/utils/supabase/client";
import { notFound } from "next/navigation"

export default async function User({params}:{params: Promise<{userId: string}>}){
    // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABSE_URL
    // const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABSE_ANON_KEY
    const supabase = createClient()
    const {userId} = await params
    const {data, error} = await supabase.from("users").select("*").eq("userid",userId);
    const users = data
    if(error){
        console.log("errorji: "+error)
    }
    else{
        console.log(data)
    }



    return(
        <div>
            <h1> Welcome user!</h1>
            <br />
            <div>
                {users?.map((user)=>(
                    <div key={user.userid}>
                        <h2>Name: {user.name} </h2>
                        <h2>email: {user.email} </h2>
                        <h2>Ph.no: {user.phno} </h2>
                        <br />
                    </div>
                ))}
            </div>
        </div>
    )
}