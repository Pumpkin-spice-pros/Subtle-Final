import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { OpenAIApi, Configuration } from 'openai';
import styles from '../styles/Home.module.css'

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY }));


export function ChatGPT({ isOpen, onClose }) {
  const [messages, setMessages] = useState([{}]);
  const [input, setInput] = useState('');

  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !(chatRef.current && chatRef.current.contains(event.target))) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.keyCode === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const sendMessage = async () => {
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    });

    setMessages([...messages, { role: 'user', content: input }]);
    setMessages([
      ...messages,
      { role: 'ChatGPT :', content: res?.data?.choices[0]?.message?.content },
    ]);
    setInput('');
  };

  return (
    <>
      {isOpen && (
        <div className="" ref={chatRef}>
          <button className={styles.closeButtonGPT} onClick={onClose}>
            Close
          </button>
          <div className={styles.messagesGPT}>
            {messages.map((message, index) => (
              <div key={index}>
                <span>{message.role}</span>
                <span>{message.content}</span>
              </div>
            ))}
          </div>
          <div className={styles.inputGPT}>
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
