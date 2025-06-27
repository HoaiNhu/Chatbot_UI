import { useState, useEffect, useRef } from "react";
import styles from "./ChatbotComponent.module.css";
import { createSession, sendMessage } from "../../services/ChatbotService";
import avatar from "../../assets/image/LogoAvocado.png";
import { io } from "socket.io-client";

const SOCKET_URL = "https://chatbot-be-715r.onrender.com"; // URL backend NodeJS

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

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = { text: messageText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      let currentSessionId = sessionId;

      // 👉 Tạo session nếu chưa có
      if (!currentSessionId) {
        currentSessionId = await createSession();
        setSessionId(currentSessionId);
      }

      const response = await sendMessage(messageText, currentSessionId);

      // Kiểm tra xem bot có trả lời không
      if (response.noReply) {
        // Bot không trả lời, hiển thị thông báo chờ staff
        const waitingMessage = {
          text: "Tin nhắn của bạn đã được chuyển cho nhân viên hỗ trợ. Họ sẽ phản hồi sớm nhất có thể.",
          sender: "bot",
          isWaiting: true,
        };
        setMessages((prev) => [...prev, waitingMessage]);
      } else if (response.text) {
        // Bot có trả lời
        const botMessage = { text: response.text, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      }

      // Nếu backend trả session mới thì cập nhật
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }
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
              msg.sender === "user"
                ? styles.userMessage
                : msg.isWaiting
                ? styles.botMessage + " " + styles.waiting
                : styles.botMessage
            }`}
          >
            {msg.sender === "bot" && !msg.isWaiting && (
              <img src={avatar} alt="Bot Avatar" className={styles.botAvatar} />
            )}
            <div
              className={`${styles.messageText} ${
                msg.sender === "user"
                  ? styles.userText
                  : msg.isWaiting
                  ? styles.waitingText
                  : styles.botText
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
          placeholder="Soạn tin..."
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
