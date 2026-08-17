import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation"
// import { createClient } from "@/utils/supabase/server"


export default async function User(){
    const supabase = await createClient();
    const {
    data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        console.log("Sorry you are not logged-in :(")
        redirect("/login")
    }

    const {data, error} = await supabase.from("users").select("*");
    const users = data
    if(error){
        console.log("errorji: "+error)
    }
    else{
        console.log(data)
    }

    return(
        <div>
            <h1> Data on all users:</h1>
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













































// import { notFound } from "next/navigation"
// async function fetchUser(id: string){
//     const res = await fetch(`https://jsonplaceholder.typicode.com/users/`)
    
//     if(!res.ok){
//         return null
//     }
//     const user = await res.json()
//     return user
    
// }

// export default async function UserPage({params}:{params: Promise<{userId: string}>}){

//     const {userId} = await params
//     const user = await fetchUser(userId)

//     if(!user){
//         notFound()
//     }
//     return(
//         <div>
//             {user?.map((user)=>(
//                     <div key={user.name}>
//                         <h2>Name: {user.name} </h2>
//                         <h2>email: {user.email} </h2>
//                         <h2>Ph.no: {user.phno} </h2>
//                         <br />
//                     </div>
//                 ))}
//         </div>
//     )
// }