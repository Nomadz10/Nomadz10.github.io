// ChatBotComponent.js
import React, { useState } from 'react';
import './assets/styles/ChatBot.css';

const ChatBotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (inputText.trim()) {
            setMessages((prev) => [...prev, { sender: 'user', text: inputText }]);
            setIsLoading(true);

            try {
                const response = await fetch('https://nomadz10-my-chatbot-backend.hf.space/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: inputText }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                const data = await response.json();

                setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
            } catch (error) {
                console.error('Error during fetch:', error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender: 'bot',
                        text: 'Sorry, I am having trouble responding right now. Please try again later.',
                    },
                ]);
            } finally {
                setIsLoading(false);
                setInputText('');
            }
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chatbot-message ${msg.sender}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className="chatbot-message bot">
                        <p>Typing...</p>
                    </div>
                )}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} disabled={isLoading}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBotComponent;
