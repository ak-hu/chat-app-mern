import React, { useEffect, useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { SlMagnifier } from "react-icons/sl";
import { IoIosArrowBack } from "react-icons/io";
import { io } from "socket.io-client";

import axios from "axios";
import styled from "styled-components";

import { ChatState } from "../context/ChatProvider";
import { allUsersRoute, host } from "../utils/APIRoutes";

import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Search from "../components/Search";
import UserInfo from "../components/UserInfo";

function Chat() {
  const socket = useRef();
  const [navState, setNavState] = useState("start");

  const [fetchAgain, setFetchAgain] = useState(false);


  const [searchResults, setSearchResult] = useState([]);
  const [search, setSearch] = useState('');
  const {
    selectedChat,
    user,
  } = ChatState();

  //styles for error notification
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // search function
  const handleSearch = async (event) => {
    event.preventDefault();
    if (!search) {
      toast.error("Please Enter something in search", toastOptions);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const getUsers = async () => {
        const { data } = await axios.get(`${allUsersRoute}?search=${search}`, config);
        setSearchResult(data);
      };
      getUsers();
      setNavState('add-trip')
    } catch (error) {
      toast.error("Error in searching user", toastOptions);
    }

  };

  //socket connection
  useEffect(() => {
    if (user) {
      socket.current = io(host);
      socket.current.emit("setup", user._id);
    }
  }, [user]);

  return (
    <>
      <Container>
        {user &&
          <div className="container chat-box">
            <div className="aside">
              <UserInfo />
              <div className="wrapper">
                <form className="search__chat" onSubmit={(event) => handleSearch(event)}>
                  {navState === 'start' &&
                    (<button type="submit" className="search__button"><SlMagnifier /></button>
                    )}

                  {navState === 'add-trip' && (
                    <button className="back" onClick={() => { setNavState('start') }}><IoIosArrowBack /></button>
                  )}
                  <input type="text" placeholder="Search or start new chat"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
                <div className="contacts-container">
                  {navState === 'start' ? (
                    <div>
                      <Contacts selectedChat={selectedChat} fetchAgain={fetchAgain} />
                    </div>
                  ) : (
                    <Search searchResults={searchResults} />
                  )}
                </div>
              </div>
            </div>
            {selectedChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer fetchAgain={fetchAgain} socket={socket} setFetchAgain={setFetchAgain} />
            )}
          </div>
        }
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;

  .container {
    position: relative;
    width: 1298px;
    max-width: 100%;
    height: calc(100vh - 40px);
    background: #fff;
    display: grid;
    grid-template-columns: 30% 70%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  
  .aside {
    background: #fff;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    display: grid;
    grid-template-rows: 10% 90%;
    overflow: auto;

    .search__chat {
      position: relative;
      width: 100%;
      height: 60px;
      background: #f6f6f6;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 15px;

      button{
        position: absolute;
        left: 30px;
        top: 1.2rem;
        font-size: 1.2em;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: none;
        color: #bbb;
      }

        input {
          width: 100%;
          outline: none;
          border: none;
          background: #fff;
          padding: 6px;
          height: 38px;
          border-radius: 30px;
          font-size: 14px;
          padding-left: 50px;
      
          &::placeholder {
            color: #bbb;
          }
        }

        &:focus{
          button{
            color: #000;
          }
        }
    }
  }
  .wrapper{
    display: grid;
    grid-template-rows: 10% 90%;
  }

  .contacts-container{
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      &-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  }
`;

export default Chat;
