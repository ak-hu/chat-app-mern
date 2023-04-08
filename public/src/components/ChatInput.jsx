import { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { MdOutlineAddAPhoto } from "react-icons/md";

function ChatInput({ handleSendMsg, setNewAttach, newAttach }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputElement = useRef();
  let url;

  useEffect(() => {
    inputElement.current.focus();
  }, []);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  if (newAttach) {
    url = URL.createObjectURL(newAttach);
  }

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0 || newAttach) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="chat-input">

      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <div className="button-container">
          <div className="emoji">
            <BsEmojiSmile onClick={handleEmojiPickerhideShow} />
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
          </div>
        </div>
        <input
          ref={inputElement}
          type="text"
          placeholder="Write a message..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <div className="buttons">
          <div className="hidden-input">
            <label className="icon-button">
              <input
                ref={inputElement}
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={(event) => setNewAttach(event.target.files[0])}
              />
              <MdOutlineAddAPhoto />
            </label>
          </div>
          <button type="submit" className="icon-button submit-button">
            <IoSend />
          </button>
        </div>
      </form>

      {newAttach &&
        <div className="attachment">
          <img src={url} className="attach-file" alt={newAttach.name}/>
          <div className="close-button-wrapper">
            <button className="close-button" onClick={() => { setNewAttach() }}>
              <GrFormClose />
            </button>
          </div>
        </div>

      }
    </div>
  );
}

export default ChatInput;