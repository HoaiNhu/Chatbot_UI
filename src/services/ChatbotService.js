// const API_BASE_URL = "http://localhost:3001/api/chatbot";
const API_BASE_URL = "https://chatbot-be-715r.onrender.com/";

export const sendMessage = async (message, sessionId) => {
  console.log("Sending message to API:", { message, sessionId });

  try {
    const response = await fetch(`${API_BASE_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const createSession = async (userId = null, platform = "web") => {
  try {
    const response = await fetch(`${API_BASE_URL}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, platform }),
    });

    if (!response.ok) {
      throw new Error("Failed to create session");
    }

    const result = await response.json();
    return result.sessionId;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const getConversationHistory = async (sessionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/conversation/${sessionId}/history`
    );

    if (!response.ok) {
      throw new Error("Failed to get conversation history");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error getting conversation history:", error);
    throw error;
  }
};

export const rateConversation = async (sessionId, rating) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/conversation/${sessionId}/rate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to rate conversation");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error rating conversation:", error);
    throw error;
  }
};

export const getStatistics = async (timeRange = "7d") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/statistics?timeRange=${timeRange}`
    );

    if (!response.ok) {
      throw new Error("Failed to get statistics");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error getting statistics:", error);
    throw error;
  }
};
