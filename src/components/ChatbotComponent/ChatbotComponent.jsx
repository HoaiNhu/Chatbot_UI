import { useState, useEffect, useRef } from "react";
import styles from "./ChatbotComponent.module.css";
import { sendMessage } from "../../services/ChatbotService";

function ChatbotComponent() {
  const [messages, setMessages] = useState([
    {
      text: "Chào bạn! Mình là CakeBot, bạn muốn tìm bánh gì nè?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = { text: messageText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMessage(messageText, sessionId);
      const botMessage = { text: response.text, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      setSessionId(response.sessionId);
    } catch (error) {
      const errorMessage = {
        text: "Oops, có lỗi xảy ra! Thử lại nha.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (payload) => {
    handleSend(payload);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src="https://via.placeholder.com/30"
                alt="Bot Avatar"
                className={styles.botAvatar}
              />
            )}
            <div
              className={`${styles.messageText} ${
                msg.sender === "user" ? styles.userText : styles.botText
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={styles.typing}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhắn tin nè..."
          className={styles.input}
        />
        <button onClick={() => handleSend()} className={styles.sendButton}>
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatbotComponent;
