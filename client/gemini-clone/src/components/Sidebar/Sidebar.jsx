import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
const Sidebar = () => {
  const navigate = useNavigate();
  const [extended, setExtended] = useState(false);
  const {
    setCurrentChatId,
    fetchMessages,
    chats,
    createNewChat,
    deleteChat,
  } = useContext(Context);

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu bright"
          src={assets.menu_icon}
          alt="menu"
        />
        <div
          onClick={async () => {
            const chatId = await createNewChat();
            if (chatId) {
              setCurrentChatId(chatId);
              navigate("/newchat"); // or "/" if same page
            }
          }}
          className="new-chat"
        >
          <img src={assets.plus_icon} alt="plus" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-tittle">Recent</p>
            {chats.map((chat) => (
              <div key={chat.id} className="chat-item">
                <div
                  className="chat-left"
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    fetchMessages(chat.id);
                    navigate("newchat")
                  }}
                >
                  <p className="chat-title">
                    {chat.title
                      ? chat.title.length > 7
                        ? chat.title.slice(0, 7) + "…"
                        : chat.title
                      : "New Chat"}
                  </p>
                </div>

                <Trash2
                  size={14}
                  className="chat-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div
          onClick={() => navigate("/help")}
          className="bottom-item recent-entry bright"
        >
          <img src={assets.question_icon} alt="question" />
          {extended ? <p>Help</p> : null}
        </div>
        <div
          onClick={() => navigate("/activity")}
          className="bottom-item recent-entry bright"
        >
          <img src={assets.history_icon} alt="question" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div
          onClick={() => navigate("/settings")}
          className="bottom-item recent-entry bright"
        >
          <img src={assets.setting_icon} alt="question" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
