const API_URL = "http://localhost:5005/chat"; // Thay bằng URL của Render sau khi deploy
const API_KEY = "your-api-key"; // Thay bằng API key thực tế từ config.py

export const sendMessage = async (message, sessionId) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return await response.json();
};
