"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Plus,
  MessageSquare,
  FileText,
  BookOpen,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Send,
} from "lucide-react";

const sidebarItems = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
  },
  {
    id: "notes",
    label: "Notes",
    icon: BookOpen,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

const suggestionCards = [
  {
    title: "Explain a Topic",
    description: "Understand difficult concepts in simple language",
  },
  {
    title: "Summarize Content",
    description: "Turn long information into clear summaries",
  },
  {
    title: "Generate Notes",
    description: "Create structured notes for revision and study",
  },
  {
    title: "Build a Learning Plan",
    description: "Create a personalized roadmap for any subject",
  },
];

const demoMessages = [
  {
    role: "assistant",
    content:
      "What would you like to learn today? Upload a document, ask a question, generate notes, or explore a new topic.",
  },
  
];

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(demoMessages);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<
  {
    id: number;
    title: string;
    messages: typeof demoMessages;
  }[]
>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [currentChatTitle, setCurrentChatTitle] = useState("New Chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSend = async () => {
  if (!message.trim()) return;

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: message,
    },
  ]);
  setIsThinking(true);
  setHasStartedChat(true);

  const userMessage = message; 
  if (!hasStartedChat) {
  setCurrentChatTitle(userMessage);
}

  setMessage("");

  try {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  });

  const data = await res.json();

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: data.reply,
    },
  ]);
} catch (error) {
  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: "Failed to connect to AI.",
    },
  ]);
} finally {
  setIsThinking(false);
}
};

const handleNewChat = () => {
  if (hasStartedChat) {
    const firstUserMessage =
  messages.find(
    (msg) => msg.role === "user"
  )?.content || "Untitled Chat";

    setChatHistory((prev) => [
  {
    id: Date.now(),
    title: firstUserMessage,
    messages: [...messages],
  },
  ...prev,
]);
  }

  setMessages(demoMessages);
  setMessage("");
  setCurrentChatId(null);
  setHasStartedChat(false);
setCurrentChatTitle("New Chat");
};
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);
useEffect(() => {
  if (!currentChatId) return;

  setChatHistory((prev) =>
    prev.map((chat) =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: [...messages],
          }
        : chat
    )
  );
}, [messages, currentChatId]);

  return (
    <div className="relative h-screen overflow-hidden bg-[#050816] text-white">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-screen">

        {/* Sidebar */}
        <motion.aside
          animate={{
            width: collapsed ? 90 : 320,
          }}
          transition={{
            duration: 0.3,
          }}
          className="border-r border-white/10 bg-white/[0.03] backdrop-blur-2xl"
        >
          <div className="flex h-full flex-col">

            {/* Logo */}
            <div className="border-b border-white/10 p-5">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600"
                  >
                    <Sparkles size={20} />
                  </motion.div>

                  {!collapsed && (
                    <div>
                      <h1 className="text-lg font-semibold">
                        Quantum AI
                      </h1>

                      <p className="text-xs text-white/40">
                        Learning Workspace
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    setCollapsed(!collapsed)
                  }
                  className="rounded-lg p-2 hover:bg-white/10"
                >
                  {collapsed ? (
                    <ChevronRight size={18} />
                  ) : (
                    <ChevronLeft size={18} />
                  )}
                </button>
              </div>

              <button
  onClick={handleNewChat}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-medium transition hover:bg-blue-500"
>
                <Plus size={18} />
                {!collapsed && "New Chat"}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setActiveTab(item.id)
                      }
                      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                        active
                          ? "bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />

                      {!collapsed && (
                        <span className="font-medium">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User */}
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold">
                  A
                </div>

                {!collapsed && (
                  <div>
                    <p className="text-sm font-medium">
                      Aryan
                    </p>

                    <p className="text-xs text-white/40">
                      Quantum Builder
                    </p>
                  </div>
                )}
              </div>
              <div className="px-4 mt-6">
  {!collapsed && (
    <> <h3 className="mb-2 text-xs uppercase text-white/40">
      Recent Chats
    </h3>
    {hasStartedChat && (
  <div className="mb-2 rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm text-white">
    ▶ {currentChatTitle}
  </div>
)}
  

  {chatHistory.map((chat) => (
  <div
    key={chat.id}
    onClick={() => {
      setMessages(chat.messages);
      setCurrentChatId(chat.id);
    }}
    className={`mb-2 cursor-pointer rounded-xl p-3 text-sm transition-all ${
  currentChatId === chat.id
    ? "bg-blue-500/20 text-white border border-blue-400/40"
    : "bg-white/5 text-white/70 hover:bg-white/10"
}`}
  >
    {chat.title}
  </div>
))}
</>
)}
</div>
            </div>

          </div>
        </motion.aside>

        {/* Workspace */}
        <main className="flex min-h-0 flex-1 flex-col">

          {/* Header */}
          <div className="border-b border-white/10 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-8">

              <div>
                <h2 className="font-semibold">
                  Quantum Workspace
                </h2>

                <p className="text-xs text-white/40">
                  Learn faster. Think deeper.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />

                <input
                  placeholder="Search..."
                  className="rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 outline-none"
                />
              </div>

            </div>
          </div>

          {/* Content */}
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-10 py-10">

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mx-auto max-w-5xl"
            >
{messages.length <= 1 && (
  <>
              <h1 className="text-5xl font-bold leading-tight">
                Learn Faster.
                <br />
                Think Deeper.
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-white/60">
                Quantum AI helps you learn,
                analyze documents, generate
                notes, and build deep knowledge
                from any source.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-2">

                                {suggestionCards.map((card) => (
                  <motion.div
                    key={card.title}
                    whileHover={{
                      y: -4,
                    }}
                    className="group cursor-pointer rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                      <Sparkles size={18} />
                    </div>

                    <h3 className="text-lg font-semibold">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                      {card.description}
                    </p>
                  </motion.div>
                ))}
              </div>
  </>
)}
              {/* Chat Preview */}
              <div className="mt-16 space-y-8">

                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.2,
                    }}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl rounded-3xl px-6 py-5 ${
                        msg.role === "assistant"
                          ? "border border-white/10 bg-white/[0.03]"
                          : "bg-blue-600"
                      }`}
                    >
                      <div className="leading-8">
  <ReactMarkdown>
    {msg.content}
  </ReactMarkdown>
</div>
                    </div>
                  </motion.div>
                ))}
                {isThinking && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start"
  >
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5">
      <div className="flex items-center gap-3">
  <span className="text-white/70">
    Quantum AI is thinking
  </span>

  <div className="flex gap-1">
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="h-2 w-2 rounded-full bg-blue-400"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: dot * 0.15,
        }}
      />
    ))}
  </div>
</div>
    </div>
  </motion.div>
)}
                <div ref={messagesEndRef} />

              </div>

            </motion.div>

          </div>

          {/* Composer */}
          <div className="border-t border-white/10 p-6 backdrop-blur-xl">

            <div className="mx-auto max-w-4xl">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-3 backdrop-blur-2xl">

                <div className="flex items-end gap-3">

                  <button className="rounded-2xl p-3 hover:bg-white/10">
                    <Paperclip size={20} />
                  </button>

                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                      onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
                    placeholder="Ask Quantum AI anything..."
                    rows={1}
                    className="max-h-40 flex-1 resize-none bg-transparent px-2 py-3 outline-none"
                  />

                  <button
  onClick={handleSend}
  className="rounded-2xl bg-blue-600 p-3 transition hover:bg-blue-500"
>
  <Send size={20} />
</button>

                </div>

    </div>
  </div>
</div>

</main>

</div>
</div>
);
}