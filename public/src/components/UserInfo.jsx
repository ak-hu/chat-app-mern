import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import { RxPencil2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";

import { ChatState } from "../context/ChatProvider";
import { deleteUserRoute } from "../utils/APIRoutes";
import { toastOptions } from "../utils/constants";
import UpdateProfile from "./UpdateProfile";
import SubmitModal from "./Aux/SubmitModal";


function UserInfo({ fetchAgain, setFetchAgain }) {
    const { user } = ChatState();
    const navigate = useNavigate();
    const [modalUpdateActive, setModalUpdateActive] = useState("not");
    //submit hooks
    const [deleteActive, setDeleteActive] = useState("not");
    const [warnText, setWarnText] = useState("");
    const [submText, setSubmText] = useState("");

    const handleLogout = async () => {
        localStorage.clear();
        navigate("/auth");
    };

    const deleteAccount = async () => {
        setModalUpdateActive("not");
        setDeleteActive("yes");
        setWarnText("You cannot restore your account. All your chats and messages will be permanently deleted.");
        setSubmText("Are you sure you want to leave your contacts and delete an account in ChatApp?")
    };

    const handleDelete = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}`, } };
            const { data } = await axios.put(`${deleteUserRoute}`, { userId: user._id, }, config);
            setFetchAgain(!fetchAgain);
            toast.success("Your account is succefuly deleted", toastOptions);
            if (data.status === true) {
                localStorage.clear();
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
    };

    return (
        <div className="user-info">
            <div className="user-data tooltip">
                <img src={process.env.REACT_APP_PROFILE_PICS_PATHS + user.profilePic}
                    alt={user.username}
                    className="icon-button" />
                <span className="tooltiptext">{user.username}</span>
            </div>
            <div className="user-info buttons">
                <div className="tooltip">
                    <button className="icon-button" onClick={() => { setModalUpdateActive("active") }}>
                        <RxPencil2 />
                    </button>
                    <span className="tooltiptext">Update info</span>
                </div>
                <div className="tooltip">
                    <button className="icon-button" onClick={handleLogout}>
                        <BiPowerOff />
                    </button>
                    <span className="tooltiptext">Logout</span>
                </div>
            </div>
            {modalUpdateActive === "active" &&
                <UpdateProfile fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                    setModalActive={setModalUpdateActive} handleDelete={deleteAccount} />
            }
            {deleteActive === "yes" &&
                <SubmitModal setModalActive={setDeleteActive} warnText={warnText}
                    submText={submText} handleFunction={handleDelete} />
            }
        </div>
    );
}

export default UserInfo;