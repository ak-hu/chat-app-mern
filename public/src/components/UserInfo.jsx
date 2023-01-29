import React from 'react';
import { ChatState } from "../context/ChatProvider";
import styled from "styled-components";
import Logout from "./Logout";

function UserInfo(props) {
    const { user } = ChatState();
    return (
        <Container >
            <div className='user-data'>
                <img src={process.env.REACT_APP_PROFILE_PICS_PATHS + user.profilePic}
                    alt={`${user.username}`}
                />
                <h4>{user.username}</h4>
            </div>
            <Logout />
        </Container>
    );
}

const Container = styled.div`
background: #ededed;
display: flex;
justify-content: space-between;
padding: 0 15px;
align-items: center;

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
`;


export default UserInfo;