"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Adjust path to your client helper
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    // Redirect to your protected page on success
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md" style={{boxShadow:"0px 0px 12px grey"}}>
        <h1 className="text-2xl font-bold text-center mb-6" style={{color:"black",fontFamily:"sans-serif"}}>Log In</h1>
        
        {errorMessage && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block" style={{color:"black",fontFamily:"sans-serif"}}>Email Address</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{color:"black",fontFamily:"sans-serif"}}
            />
          </div>

          <div>
            <label className="block" style={{color:"black",fontFamily:"sans-serif"}}>Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{color:"black",fontFamily:"sans-serif"}}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}






























// "use client"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { createClient } from "@/utils/supabase/client";
// import Link from "next/link"

// export default function Login(){
//     const supabase = createClient();
//     const router = useRouter()
//     const [email, setemail] = useState("")
//     const [password, setpassword] = useState("")

//     async function handleLogin(e: React.SubmitEvent){
//         e.preventDefault();
//         const {error} = await supabase.auth.signInWithPassword({email, password})
//         if(error){
//             console.log(error.message)
//             console.log(error.status)
//             console.log("not a valid email/password")
//             return;
//         }
//         router.push("/")
//         console.log("Successfully logged-in !")
//     }

//     return(
//         <div style={{border:"1px solid grey", display: "inline", padding: "20px", margin: "4px"}}>
//             <form onSubmit={handleLogin} style={{display:"inline"}}>
//                 <label style={{}}>Enter Email: <input type="email" onChange={(e)=>setemail(e.target.value)} placeholder="abc@gmail.com" style={{border:"1px solid grey", margin:"4px", padding: "4px"}} /></label> <br />
//                 <label htmlFor="">Enter Password: <input type="password" onChange={(e)=>setpassword(e.target.value)} placeholder="******" style={{border:"1px solid grey", margin:"4px", padding: "4px"}}/></label> <br />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     )
// }