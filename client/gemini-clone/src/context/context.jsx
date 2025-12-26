import { createContext, useEffect, useState } from "react";
import gemini from "../config/gemini";
import { useFormState } from "react-dom";
import useDarkMode from "../Custom-Hooks/DarkMode.Js";

export const Context = createContext();

const ContextProvider = (props) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useDarkMode();
  const [error, setError] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
const BASE_URL = "https://gemini-clone-542w.onrender.com"


  const fetchChats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found, skipping fetchChats");
      return;
    }

    try {
      const res = await fetch(`http://${BASE_URL}/api/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setChats(data.chats);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://${BASE_URL}/api/chats/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) return;

      setMessages(data.messages);
    } catch (err) {
      console.error("Failed to load messages");
    }
  };
  const createNewChat = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`http://${BASE_URL}/api/chats`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();

    // ✅ THIS is the missing part
    setChats((prev) => [data.chat, ...prev]);

    return data.chat.id;
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setError("");
    setLoading(true);

    let chatId = currentChatId;

    // 🔹 AUTO CREATE CHAT (home page OR New Chat)
    if (!chatId) {
      const res = await fetch(`http://${BASE_URL}/api/chats`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      chatId = data.chat.id;
      setCurrentChatId(chatId);
    }

    const userMessage = prompt ?? input;

    if (!userMessage || !userMessage.trim()) {
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Save user message
      await fetch(`http://${BASE_URL}/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sender: "user",
          content: userMessage,
        }),
      });

      // 2️⃣ Gemini response
      const response = await gemini(userMessage);

      await fetch(`http://${BASE_URL}/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sender: "gemini",
          content: String(response),
        }),
      });

      // 3️⃣ Load messages
      await fetchMessages(chatId);

      setInput("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };
  const deleteChat = async (chatId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://${BASE_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      if (!res.ok) {
        console.error("Delete chat failed");
        return;
      }

      setChats((prev) => prev.filter((c) => c.id !== chatId));

      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }


    if (currentChatId && messages.length === 0) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, title: input.slice(0, 20) }
            : chat
        )
      );
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    input,
    setInput,
    newChat,
    chats,
    messages,
    setDark,
    error,
    fetchMessages,
    setCurrentChatId,
    fetchChats,
    currentChatId,
    createNewChat,
    deleteChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
