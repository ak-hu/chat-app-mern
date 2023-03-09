import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import { RxExit, RxPencil2 } from "react-icons/rx";
import { GoKebabVertical } from "react-icons/go";
import { ChatState } from "../context/ChatProvider";
import UpdateProfile from "./UpdateProfile";

function UserInfo({ fetchAgain, setFetchAgain }) {
    const { user } = ChatState();
    const navigate = useNavigate();
    const [showToggle, setShowToggle] = useState(false);
    const [modalUpdateActive, setModalUpdateActive] = useState('not');
    const [modalSubmitActive, setModalSubmitActive] = useState('not');

    const handleClick = async () => {
        localStorage.clear();
        navigate("/login");
    };
    return (
        <div className="user-info" >
            <div className='user-data'>
                <img src={process.env.REACT_APP_PROFILE_PICS_PATHS + user.profilePic}
                    alt={`${user.username}`}
                />
                <h4>{user.username}</h4>
            </div>
            <div className="chat-menu">
                <button className="chat-menu__button" onClick={() => { setShowToggle(!showToggle) }}>
                    <GoKebabVertical />
                </button>
            </div>
            <div className={`${showToggle ? 'chat-menu-toggle ' : 'none'}`}>
                <button className="list-item" onClick={() => { { setModalUpdateActive("active") } { setShowToggle(!showToggle) } }}>
                    <RxPencil2 />
                    <span>Update profile</span>
                </button>
                <button className="list-item" onClick={() => { { setModalSubmitActive("active") } { setShowToggle(!showToggle) } }}>
                    <BiPowerOff />
                    <span>Log out</span>
                </button>
            </div>
            {modalUpdateActive === "active"
                ? <UpdateProfile fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setModalActive={setModalUpdateActive} />
                : <></>
            }
        </div>
    );
}

export default UserInfo;