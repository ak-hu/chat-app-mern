import Robot from "../assets/robot.gif";
import { ChatState } from "../context/ChatProvider";

function Welcome() {
  const { user } = ChatState();

  return (
    <div className="welcome">
      <img src={Robot} alt="Robot waves his palm" />
      <h1>
        Welcome, <span>{user.username}!</span>
      </h1>
      <h3>Select a chat to start messaging.</h3>
    </div>
  );
}

export default Welcome;
