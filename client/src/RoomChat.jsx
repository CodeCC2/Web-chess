import { useEffect, useRef, useState } from "react";

const QUICK_EMOJIS = [
  "♟️",
  "♜",
  "♞",
  "♝",
  "♛",
  "♚",
  "👍",
  "👎",
  "😀",
  "😂",
  "🔥",
  "💪",
  "🎉",
  "❤️",
  "👏",
];

export default function RoomChat({ messages, onSend, disabled }) {
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  function submit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    onSend(text);
    setDraft("");
  }

  function appendEmoji(emoji) {
    setDraft((prev) => `${prev}${emoji}`.slice(0, 200));
  }

  return (
    <div className="room-chat">
      <h3 className="room-chat-title">แชทในห้อง</h3>
      <div className="room-chat-messages" ref={listRef}>
        {messages.length === 0 ? (
          <p className="room-chat-empty">ยังไม่มีข้อความ — ทักทายกันได้เลย</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`room-chat-msg ${msg.color}`}>
              <span className="room-chat-author">{msg.name}</span>
              <span className="room-chat-text">{msg.text}</span>
            </div>
          ))
        )}
      </div>
      <div className="room-chat-emojis">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="emoji-btn"
            disabled={disabled}
            onClick={() => appendEmoji(emoji)}
            aria-label={`เพิ่ม ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <form className="room-chat-form" onSubmit={submit}>
        <input
          type="text"
          value={draft}
          maxLength={200}
          placeholder="พิมพ์ข้อความ..."
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="primary" disabled={disabled || !draft.trim()}>
          ส่ง
        </button>
      </form>
    </div>
  );
}
