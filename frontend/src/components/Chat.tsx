import React, { useEffect, useState, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import './Chat.css';

let socket: Socket;

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const username = localStorage.getItem('username') || '';
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);
  

  useEffect(() => {
    socket = io('http://localhost:5000');

    socket.on('message', (message: { user: string; text: string }) => {
        setMessages((messages) => [...messages, message]);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (event: React.KeyboardEvent | React.MouseEvent) => {
    event.preventDefault();
  
    if (message) {
      socket.emit('sendMessage', { user: username, text: message }, () => setMessage(''));
    }
  };


  return (
<div>
    <div className='chat'>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage(event);
          }
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
    <article className='list' ref={messagesEndRef}>
    {messages.map((message, i) => (
      <div className="message" key={i}>
        <strong className='user'>{message.user}</strong>
        <p className='text' style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
      </div>
    ))}
    </article>
  </div>
  );
}

export default Chat;
