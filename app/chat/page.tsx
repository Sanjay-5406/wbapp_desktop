import RealtimeComponent from '@/app/chat/getchat'
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"

export default async function Chat() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()
    console.log(user)
    if (error) {
        redirect('/login');
        console.error(error)
    }


    const { data: chat } = await supabase
        .from('chat')
        .select('*')
    console.log(chat)
    
    interface UserProps {
        name: string,
    }

    const username: UserProps = {name: user?.email ?? "Anonymous"}    

    return (
        <>
            <div>
                <div style={{justifyItems: "center"}}>
                    <h1 style={{fontSize: "40px"}}>Global Chat</h1>
                    <p>
                        Logged in as: {user?.email ?? 'Guest'}
                    </p>
                </div>
                <br />
                <RealtimeComponent {...username} />;
            </div>
        </>
    )
}
