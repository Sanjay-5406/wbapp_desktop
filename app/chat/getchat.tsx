'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'

type Message = {
  chatid: string
  userid: string
  user: string
  message: string
  created_at: string
}

const USER_COLORS = [
  '#e74c3c',
  '#9b59b6',
  '#f1c40f',
  '#2ecc71',
  '#e67e22',
  '#34495e',
  '#3498db',
  '#1abc9c',
]

function getUsernameColor(username: string) {
  if (!username) return USER_COLORS[0]

  let hash = 0

  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }

  return USER_COLORS[Math.abs(hash) % USER_COLORS.length]
}

interface UserProps {
        name: string,
}

export default function RealtimeComponent({ name }: UserProps) {
  const loggeduser = name;
  const supabase = createClient()

  const [messages, setMessages] = useState<Message[]>([])
  const [username, setUsername] = useState(loggeduser)
  const [text, setText] = useState('')

  useEffect(() => {
    async function loadMessages() {
      const { data, error } = await supabase
        .from('chat')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error(error)
        return
      }

      if (!data) return

      setMessages(data)
    }

    loadMessages()

    const channel = supabase
      .channel('chat-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat',
        },
        (payload) => {
          setMessages((prev) => {
            const updated = [payload.new as Message, ...prev]
            return updated.slice(0, 5)
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  async function sendMessage() {
    if (!text.trim()) return

    const { error } = await supabase.from('chat').insert({
      user: username.trim() || loggeduser,
      message: text.trim(),
    })

    if (error) {
      console.error(error)
      return
    }

    setText('')
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: 20,
        borderRadius: 16,
        background: '#111',
      }}
    >
      <h2 style={{ marginBottom: 20 }}>🌍 Global Chat</h2>

      <div style={{ marginBottom: 15 }}>
        <input
          value={loggeduser}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 10,
            border: '1px solid #555',
            marginBottom: 10,
          }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={text}
            placeholder="Type a message..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage()
              }
            }}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: '1px solid #555',
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              background: '#3498db',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>

      <hr />

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.chatid}
              layout
              initial={{
                opacity: 0,
                y: -30,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: -40,
                transition: {
                  duration: 0.25,
                },
              }}
              transition={{
                duration: 0.3,
              }}
              style={{
                background: '#1c1c1c',
                padding: 12,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,.25)',
              }}
            >
              <div
                style={{
                  color: getUsernameColor(msg.user),
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}
              >
                {msg.user}
              </div>

              <div>{msg.message}</div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  color: '#888',
                }}
              >
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

























// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/utils/supabase/client'

// type Message = {
//   chatid: string
//   userid: string
//   user: string
//   message: string
//   created_at: string
// }

// // 1. Keep the color palette outside the component to preserve memory
// const USER_COLORS = [
//   "#e74c3c", "#9b59b6", "#f1c40f", "#2ecc71", 
//   "#e67e22", "#34495e", "#3498db", "#1abc9c"
// ];

// // 2. Pure helper function: Generates a stable color based on the username string
// function getUsernameColor(username: string): string {
//   if (!username) return USER_COLORS[0];
  
//   let hash = 0;
//   for (let i = 0; i < username.length; i++) {
//     hash = username.charCodeAt(i) + ((hash << 5) - hash);
//   }
  
//   const index = Math.abs(hash) % USER_COLORS.length;
//   return USER_COLORS[index];
// }

// export default function RealtimeComponent() {
//   const supabase = createClient()

//   const [messages, setMessages] = useState<Message[]>([])
//   const [text, setText] = useState('')
//   const [username, setUsername] = useState('Anonymous')

//   useEffect(() => {
//     async function loadMessages() {
//       const { data, error } = await supabase
//         .from('chat')
//         .select('*')
//         // 1. Order by time, then break ties using the unique uuid
//         .order('created_at', { ascending: false })
//         .order('chatid', { ascending: false }) 
//         .limit(5)

//       if (error) {
//         console.error(error)
//         return
//       }

//       if (!data) return

//       // 2. Guarantee a manual sort in JavaScript before updating state
//       const strictlySorted = [...data].sort((a, b) => {
//         // Compare timestamps
//         const timeA = new Date(a.created_at).getTime()
//         const timeB = new Date(b.created_at).getTime()
        
//         if (timeA !== timeB) {
//           return timeA - timeB; // Oldest first
//         }
        
//         // Fallback: If timestamps are identical, sort alphabetically by UUID
//         return a.uuid.localeCompare(b.uuid);
//       })

//       setMessages(strictlySorted)
//     }


//     loadMessages()

//     const channel = supabase
//       .channel('chat-channel')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'chat',
//         },
//         (payload) => {
//           setMessages((prev) => [...prev, payload.new as Message])
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [supabase])

//   async function sendMessage() {
//     if (!text.trim()) return

//     const { error } = await supabase.from('chat').insert({
//       user: username,
//       message: text,
//     })

//     if (error) {
//       console.error(error)
//       return
//     }

//     setText('')
    
//   }

//   return (
//     <div style={{ maxWidth: 500, padding: '20px' }}>
//       <h2>You will be visible as, </h2>

//       <input
//         placeholder="Your name"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />

//       <br />
//       <br />

//       <input
//         placeholder="Type a message..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         style={{padding: "6px 12px", marginRight: "14px",border: "1px solid white", borderRadius: "12px", display: "inline"}}
//       />

//       <button 
//         onClick={sendMessage}
//         style={{backgroundColor:"grey", padding: "6px 12px", border: "1px solid white", borderRadius: "12px", display: "inline"}}
//       >Send</button>

//       <br />
//       <br />
//       <hr />
//       <br />
      

//       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//         {messages.map((msg) => (
//           <div key={msg.chatid}>
//             {/* ✅ Safe and Pure: Passing username to get a consistent color */}
//             <strong style={{ color: getUsernameColor(msg.user) }}>
//               {msg.user}: 
//             </strong>
//             <p style={{ display: "inline", marginLeft: "6px" }}>
//               {msg.message}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

