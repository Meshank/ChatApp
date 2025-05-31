import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setChat((prev) => [...prev, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', message);
      setMessage('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="border p-4 h-96 overflow-y-scroll bg-gray-100 rounded-xl">
        {chat.map((msg, index) => (
          <div key={index} className="p-2 my-1 bg-white rounded shadow">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded-l-xl"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-r-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}