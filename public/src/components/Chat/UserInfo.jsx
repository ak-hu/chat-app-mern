import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";

import { ChatState } from "../../context/ChatProvider";
import styled from "styled-components";

function UserInfo() {
    const { user } = ChatState();
    const navigate = useNavigate();

    const handleClick = async () => {
        localStorage.clear();
        navigate("/login");
    };
    return (
        <Container >
            <div className='user-data'>
                <img src={process.env.REACT_APP_PROFILE_PICS_PATHS + user.profilePic}
                    alt={`${user.username}`}
                />
                <h4>{user.username}</h4>
            </div>
            <button onClick={handleClick}>
                <BiPowerOff />
            </button>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: #ededed;

    .user-data {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    img {
        border-radius: 100%;
        height: 2.5rem;
        width: 2.5rem;
        max-inline-size: 100%;
    }
    h4{
        color: #51585c;
    }  

    button{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.3rem;
        border-radius: 0.5rem;
        background-color: #51585c;
        border: none;
        cursor: pointer;

        svg {
            font-size: 1rem;
            color: #ebe7ff;
        }
    }
`;


export default UserInfo;