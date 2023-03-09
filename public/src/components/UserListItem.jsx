const UserListItem = ({ handleFunction, result }) => {
  return (
    <div className="user-list"
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
    </div>
  );
};

export default UserListItem;