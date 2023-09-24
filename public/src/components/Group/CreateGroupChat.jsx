import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { GrFormClose } from "react-icons/gr";
import { BsPencil } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";

import axios from "axios";

import { ChatState } from "../../context/ChatProvider";
import { groupChatRoute, allUsersRoute } from "../../utils/APIRoutes";
import { toastOptions } from "../utils/constants";

import UserListItem from "../Aux/UserListItem"
import UserBage from "../Aux/UserBage";

function GroupChatCreate({ setModalActive }) {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeSearch, setActiveSearch] = useState(false)
    const { user, chats, setChats } = ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warning("User already added", toastOptions);
            return;
        } else {
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setActiveSearch(true);
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const getUsers = async () => {
                const { data } = await axios.get(`${allUsersRoute}?search=${query}`, config);
                setLoading(false);
                setSearchResult(data);
            };
            getUsers();
        } catch (error) {
            toast.error("Failed to load the Search Results", toastOptions);
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!groupChatName || !selectedUsers) {
            toast.warning("Please fill all the feilds", toastOptions);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${groupChatRoute}`,
                { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) },
                config
            );
            setChats([data, ...chats]);
            console.log(data)
            toast.success("New Group Chat Created!", toastOptions);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
    };
    return (
        <>
            <div className="create-group modal-wrapper">
                <div className={`modal-container ${activeSearch ? 'active-search' : ''}`}>
                    <div className="close-button-wrapper">
                        <button className="close-button" onClick={() => { setModalActive("not") }}>
                            <GrFormClose />
                        </button>
                    </div>
                    <div className="modal-header">
                        <h2>Create Group Chat</h2>
                    </div>
                    <form className="modal-content" onSubmit={(event) => handleSubmit(event)}>
                        <div className="inputs">
                            <div className="modal-input">
                                <input
                                    type="text"
                                    placeholder="Chat Name"
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <BsPencil />
                            </div>
                            <div className="modal-input">
                                <input
                                    type="text"
                                    placeholder="Add Users eg: John, Jane"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <AiOutlineUserAdd />
                            </div>
                            <div className="selected-users-wrapper">
                                {selectedUsers.map((u) => (
                                    <UserBage
                                        key={u._id}
                                        user={u}
                                        admin={user}
                                        handleFunction={() => handleDelete(u)}
                                    />
                                ))}
                            </div>
                            {loading || !activeSearch || search === ""
                                ? (<></>)
                                : (<div className="contacts">
                                    {searchResult?.slice(0, 4).map((result) => (
                                        <UserListItem key={result._id} result={result} handleFunction={() => handleGroup(result)} />
                                    ))}
                                </div>)}
                        </div>
                        <div className="button-submit">
                            <button className="button" type="submit">
                                Create Chat
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default GroupChatCreate;