import { useState, useEffect } from "react";
import styles from "./StaffDashboard.module.css";

const API_BASE_URL = "https://chatbot-be-715r.onrender.com/api/chatbot";

function StaffDashboard() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentId] = useState("staff_001"); // Tạm thời hardcode

  useEffect(() => {
    fetchEscalatedConversations();
    // Polling mỗi 30 giây để cập nhật danh sách
    const interval = setInterval(fetchEscalatedConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEscalatedConversations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conversations/escalated?agentId=${agentId}`
      );
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/conversation/${selectedConversation.sessionId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: replyMessage,
            agentId: agentId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setReplyMessage("");
        // Cập nhật conversation với tin nhắn mới
        setSelectedConversation((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              text: replyMessage,
              sender: "agent",
              timestamp: new Date(),
              agentId: agentId,
            },
          ],
        }));
        // Refresh danh sách
        fetchEscalatedConversations();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      default:
        return "green";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Staff Dashboard</h1>
        <p>Agent ID: {agentId}</p>
      </div>

      <div className={styles.container}>
        {/* Danh sách conversations */}
        <div className={styles.conversationList}>
          <h2>Conversations cần xử lý ({conversations.length})</h2>
          {conversations.map((conv) => (
            <div
              key={conv.sessionId}
              className={`${styles.conversationItem} ${
                selectedConversation?.sessionId === conv.sessionId
                  ? styles.selected
                  : ""
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className={styles.conversationHeader}>
                <span className={styles.sessionId}>
                  ID: {conv.sessionId.slice(0, 8)}...
                </span>
                <span
                  className={styles.priority}
                  style={{ backgroundColor: getPriorityColor(conv.priority) }}
                >
                  {conv.priority}
                </span>
              </div>
              <div className={styles.conversationInfo}>
                <span>Platform: {conv.platform}</span>
                <span>Messages: {conv.messages?.length || 0}</span>
              </div>
              <div className={styles.conversationTime}>
                {formatDate(conv.lastActivity || conv.createdAt)}
              </div>
            </div>
          ))}
        </div>

        {/* Chi tiết conversation */}
        <div className={styles.conversationDetail}>
          {selectedConversation ? (
            <>
              <div className={styles.detailHeader}>
                <h3>Conversation: {selectedConversation.sessionId}</h3>
                <div className={styles.detailInfo}>
                  <span>Platform: {selectedConversation.platform}</span>
                  <span>Status: {selectedConversation.status}</span>
                  <span>Priority: {selectedConversation.priority}</span>
                </div>
              </div>

              <div className={styles.messages}>
                {selectedConversation.messages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`${styles.message} ${
                      msg.sender === "user"
                        ? styles.userMessage
                        : msg.sender === "agent"
                        ? styles.agentMessage
                        : styles.botMessage
                    }`}
                  >
                    <div className={styles.messageHeader}>
                      <span className={styles.sender}>
                        {msg.sender === "user"
                          ? "User"
                          : msg.sender === "agent"
                          ? "Staff"
                          : "Bot"}
                      </span>
                      <span className={styles.time}>
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                    <div className={styles.messageText}>{msg.text}</div>
                  </div>
                ))}
              </div>

              <div className={styles.replySection}>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Nhập tin nhắn trả lời..."
                  className={styles.replyInput}
                  rows={3}
                />
                <button
                  onClick={handleReply}
                  disabled={loading || !replyMessage.trim()}
                  className={styles.replyButton}
                >
                  {loading ? "Đang gửi..." : "Gửi trả lời"}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noSelection}>
              <p>Chọn một conversation để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
