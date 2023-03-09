import { useEffect, useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { SlMagnifier } from "react-icons/sl";
import { IoIosArrowBack } from "react-icons/io";
import { GrFormClose } from "react-icons/gr";
import { io } from "socket.io-client";

import axios from "axios";

import { ChatState } from "../context/ChatProvider";
import { allUsersRoute, host } from "../utils/APIRoutes";

import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Search from "../components/Search";
import UserInfo from "../components/UserInfo";


export default function Chat() {
  const socket = useRef();
  const [navState, setNavState] = useState("start");

  const [fetchAgain, setFetchAgain] = useState(false);
  const [searchResults, setSearchResult] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (search === '') {
      toast.error("Please Enter something in search", toastOptions);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const getUsers = async () => {
        const { data } = await axios.get(`${allUsersRoute}?search=${search}`, config);
        setLoading(false);
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
      <div className="chat-container">
        {user &&
          <div className={`container chat-box`}>
            <div className="aside">
              <UserInfo fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
              
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
                  {search !== ''
                    ? <button className="right-button" onClick={() => { setSearch("") }}><GrFormClose /></button>
                    : <></>}
                </form>
                <div className="contacts-container">
                  {search === "" || navState === 'start' ? (
                    <div>
                      <Contacts socket={socket} selectedChat={selectedChat} fetchAgain={fetchAgain}  />
                    </div>
                  ) : (
                    <Search socket={socket} searchResults={searchResults}  />
                  )}
                </div>
              </div>
            </div>
            {selectedChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer socket={socket} fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain} />
            )}

          </div>
        }

      </div>
      <ToastContainer />
    </>
  );
}