import { GrFormClose } from "react-icons/gr";
import styled from "styled-components";

function UserBage({ user, handleFunction, admin }) {
    return (
        <Container>
            {user.username}
            {admin._id === user._id
                ? (<span> (Admin)</span>)
                : (<button onClick={handleFunction}>
                    <GrFormClose />
                </button>)}
        </Container>
    );
}
const Container = styled.div`
    background-color: #e5ddd5;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    gap: 0.5rem;

    button{
        border: none;
        background: transparent;
        text-align: center;
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
        cursor: pointer;
    }
`;

export default UserBage;