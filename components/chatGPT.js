import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { OpenAIApi, Configuration } from 'openai';
import styles from '../styles/Home.module.css'

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY }));


export function ChatGPT({ isOpen, onClose }) {
  const [messages, setMessages] = useState([{}]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    });

    setMessages([...messages, { role: 'user', content: input }]);
    setMessages([
      ...messages,
      { role: 'ChatGPT:', content: res?.data?.choices[0]?.message?.content },
    ]);
    setInput('');
    setIsLoading(false);
  };

  return (
    <>
      {isOpen && (
        <div className="border border-gray-400 p-4 rounded-lg shadow-lg absolute max-w-45 absolute -left-5 top-12 w-60" ref={chatRef}>
          <div className="flex justify-center mt-w-45">
            {messages.map((message, index) => (
              <div key={index} className="w-45">
                <span className="max-w-md">{message.role}</span>
                <span className="w-10">{message.content}</span>
              </div>
            ))}
            {isLoading && (
            <div className="w-45">
              <span>ChatGPT: </span>
              <span>. . .</span>
              </div>)}
          </div>
          <div className="flex justify-center max-w-45">
            <input value={input} onChange={(e) => setInput(e.target.value)}  className="bg-gray-200 w-full max-w-md" />
          </div>
          <button onClick={sendMessage} className="w-full mt-4 bg-emerald-500 text-white px-3 py-1 rounded-md ml-0 hover:bg-emerald-700">Send</button>
          <button className="w-full mt-4 bg-gray-300 text-gray-700 px-3 py-1 rounded-md ml-0 hover:bg-gray-400" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </>
  );
}
