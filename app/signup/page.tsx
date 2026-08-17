"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust path to your client helper
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setIsError(true);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    // Success notice message
    setMessage("Signup successful! Please check your email or proceed to the login page.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md" style={{boxShadow:"0px 0px 12px grey"}}>
        <h1 className="text-2xl font-bold text-center mb-6" style={{color:"black",fontFamily:"sans-serif"}}>Create Account</h1>

        {message && (
          <div
            className={`p-3 mb-4 rounded ${
              isError ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
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
            <label className="block font-medium mb-1" style={{color:"black",fontFamily:"sans-serif"}}>Password</label>
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
            className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}












































// "use client"
// import { useState } from "react";
// import { useRouter } from "next/navigation"

// export default function Signup(){
//     const router = useRouter()
//     const [email,setemail] = useState("")
//     const [password, setpassword] = useState("")


//     async function handleSignup(e: React.FormEvent){
//         e.preventDefault()

//         const {error} = await supabase.auth.signUp({email,password})

//         if(error){
//             console.log(error.message)
//         }
//         router.push("/")
//         console.log("Succesfully signed up !")
//     }




//     return(
        
//             <div style={{border:"1px solid grey", display: "inline", padding: "20px", margin: "4px"}}>
//                 <h1>Welcome to the Sign Up page !</h1>
//                 <br />  
//                 <form onSubmit={handleSignup} style={{display:"inline"}}>
//                     <label style={{}}>Enter Email: <input type="email" onChange={(e)=>setemail(e.target.value)} placeholder="abc@gmail.com" style={{border:"1px solid grey", margin:"4px", padding: "4px"}} /></label> <br />
//                     <label htmlFor="">Enter Password: <input type="password" onChange={(e)=>setpassword(e.target.value)} placeholder="******" style={{border:"1px solid grey", margin:"4px", padding: "4px"}}/></label> <br />
//                     <button type="submit">Login</button>
//                 </form>
//             </div>
            
        
//     )
    

// }