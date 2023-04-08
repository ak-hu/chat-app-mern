import { GrFormClose } from "react-icons/gr";

function UserBage({ user, handleFunction, admin }) {
    return (
        <div className="user-badge-item">
            {user.username}
            {admin._id === user._id
                ? <span> (Admin)</span>
                : <button onClick={handleFunction}>
                    <GrFormClose />
                </button>
            }
        </div>
    );
}

export default UserBage;