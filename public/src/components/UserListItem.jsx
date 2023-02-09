import styled from "styled-components";

const UserListItem = ({ handleFunction, result }) => {
  return (
    <Container
      onClick={handleFunction}
    >
      <div className="result" >
        <img
          alt={result.username}
          src={process.env.REACT_APP_PROFILE_PICS_PATHS + result.profilePic}
        />
        <div>
          <h4>{result.username}</h4>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  width: 100%;

  .result {
    display: grid;
    grid-template-columns: 20% 80%;
    align-items: stretch;
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 1s ease;

    &:last-child{
      border-bottom: none;
    }
    &:hover{
      background: #f5f5f5;
    }
    &:focus{
      background-color: #9a86f3;
    }

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
`;

export default UserListItem;