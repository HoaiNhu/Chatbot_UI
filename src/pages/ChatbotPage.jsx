import ChatbotComponent from "../components/ChatbotComponent/ChatbotComponent";
import styles from "./ChatbotPage.module.css";

function ChatbotPage() {
  return (
    <div
      className={`min-h-screen bg-gray-100 flex items-center justify-center ${styles.page}`}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4 flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Bot Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <h1 className="text-lg font-semibold">CakeBot</h1>
        </div>
        <ChatbotComponent />
      </div>
    </div>
  );
}

export default ChatbotPage;
