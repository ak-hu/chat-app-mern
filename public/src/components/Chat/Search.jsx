import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import { accessChatRoute } from "../../utils/APIRoutes";
import { ChatState } from "../../context/ChatProvider";

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
      <Container>
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
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  .results{
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  .outer{
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: 0.5s ease-in-out;

    &:last-child{
      border-bottom: none;
    }
    &:hover{
      background: #f5f5f5;
    }
    &:focus{
      background-color: #9a86f3;
    }
  }

  .result {
    display: grid;
    grid-template-columns: 20% 80%;
    align-items: stretch;

    img {
      border-radius: 100%;
      height: 3rem;
      width: 3rem;
      max-inline-size: 100%;
    }
    h4 {
      color: #111;
    }
  } 
}
.chat-loading{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30rem;
}
`;
export default Search;