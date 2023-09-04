"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);

  const getStream = async () => {
    const response = await fetch("/api/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let allMessages = messages;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      const newMessages = allMessages.concat([chunkValue]);
      allMessages = newMessages;
      setMessages(newMessages);
    }
  };

  useEffect(() => {
    getStream();
  }, []);

  return (
    <div>
      <ul className="list-disc">
        {messages?.map((message) => {
          return (
            <li className="mt-2" key={message}>
              {message}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
