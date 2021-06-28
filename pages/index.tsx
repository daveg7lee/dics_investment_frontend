import Popup from 'reactjs-popup';
import { isLoggedInVar, logUserOut } from '../apollo';
import Auth from '../components/auth';

export default function home() {
  return (
    <div className="flex w-full min-h-screen">
      {!isLoggedInVar() && (
        <Popup trigger={<button>로그인</button>} modal>
          <Auth />
        </Popup>
      )}
      {isLoggedInVar() && (
        <button onClick={logUserOut}>
          <h1>로그아웃</h1>
        </button>
      )}
    </div>
  );
}
