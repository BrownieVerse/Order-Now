import { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../../services/ai';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I\'m BrownieBot 🍫 Ask me about pricing, delivery, or allergies!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const newMessages = [...messages, userMsg];
      const aiReply = await getAIResponse(newMessages);
      setMessages(prev => [...prev, { role: 'ai', content: aiReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops! I\'m having trouble connecting. Try again in a moment.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-widget ${isOpen ? 'chat-widget--open' : ''}`} aria-hidden={!isOpen}>
      <button 
        className="chat-widget__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-widget__panel" role="dialog" aria-label="BrownieVerse AI Assistant">
          <header className="chat-widget__header">
            <h3>🍫 BrownieBot</h3>
            <span className={`chat-widget__status ${isLoading ? 'status--typing' : 'status--online'}`}>
              {isLoading ? 'typing...' : 'online'}
            </span>
          </header>

          <div className="chat-widget__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                <p>{msg.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-msg chat-msg--ai">
                <span className="typing-indicator"><span></span><span></span><span></span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-widget__input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about brownies, pricing, delivery..."
              disabled={isLoading}
              aria-label="Type your message"
              autoFocus={isOpen}
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
