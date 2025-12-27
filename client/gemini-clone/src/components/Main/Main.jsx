import React, { useContext, useEffect, useRef, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context.jsx";
import ReactMarkdown from "react-markdown";

const Main = () => {
  const userName = localStorage.getItem("name");
  const { onSent, messages, loading, setInput, input, error, currentChatId } =
    useContext(Context);
  const messageEndRef = useRef(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleCardClick = (cardText) => {
    setInput(cardText);
    onSent(cardText);
  };
  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.cheems_icon} alt="" />
      </div>
      <div className="main-container">
        {!currentChatId ? (
          <>
            {" "}
            <div className="greet">
              <p>
                <span>Hello{userName ? `, ${userName}` : ""}</span>
              </p>
              <p>How can i help you today</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Suggest beautiful places to see on an upcoming road trip"
                  )
                }
              >
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "What's the best way to stay productive while working from home without burning out?"
                  )
                }
              >
                <p>
                  What's the best way to stay productive while working from home
                  without burning out?
                </p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    " Explain how blockchain technology works and why people say it's revolutionary for finance"
                  )
                }
              >
                <p>
                  Explain how blockchain technology works and why people say
                  it's revolutionary for finance
                </p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "What are some beginner-friendly project ideas to build and add to my portfolio as a developer?"
                  )
                }
              >
                <p>
                  What are some beginner-friendly project ideas to build and add
                  to my portfolio as a developer?
                </p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            {error && (
              <div
                style={{
                  backgroundColor: "#ffdddd",
                  color: "#a00",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  margin: "10px 0",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "user" ? "user" : "ai"}`}
              >
                <div className="result-title">
                  <img
                    src={
                      msg.sender === "user"
                        ? assets.cheems_icon
                        : assets.gemini_icon
                    }
                    alt=""
                  />
                  <p>{msg.sender === "user" ? "You" : "Gemini"}</p>
                </div>
                <div className="result-data">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="loader">
                <hr />
                <hr />
                <hr />
              </div>
            )}

            <div ref={messageEndRef}></div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSent(input);
                }
              }}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
              name=""
              id=""
            />
            <div className="bright">
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
