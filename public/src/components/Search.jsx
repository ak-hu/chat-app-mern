import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { accessChatRoute } from "../utils/APIRoutes";
import { ChatState } from "../context/ChatProvider";

function Search({ searchResults }) {
  const setCurrentChat = useState(undefined);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  //styles for error notification
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const postUsers = async () => {
        const { data } = await axios.post(`${accessChatRoute}`, { userId }, config);

        if (!chats.find((chat) => chat._id === data._id)) {
          setChats([data, ...chats])
        };
        setSelectedChat(data);
      };
      postUsers();
      toast.success("The user is added to your contacts");
      console.log(chats);
    } catch (error) {
      toast.error("Error fetching the chat", toastOptions);
    }
  };

  return (
    <>
      <div className="search">
        {searchResults.length !== 0 ? (
          <div className="results">
            {searchResults?.map((result) => (
              <div
                className="outer"
                onClick={() => accessChat(result._id)}
              >
                <div className="result" onClick={() => handleChatChange}>
                  <img
                    alt={result.username}
                    src={process.env.REACT_APP_PROFILE_PICS_PATHS + result.profilePic}
                  />
                  <div>
                    <h4>{result.username}</h4>
                  </div>
                </div>
              </div>
            ))
            }
          </div>
        ) : (
          <div className="chat-loading">
            <b>No users found</b>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default Search;