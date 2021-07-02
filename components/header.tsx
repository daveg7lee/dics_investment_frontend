import Popup from 'reactjs-popup';
import Link from 'next/link';
import { AiFillPlusCircle } from 'react-icons/ai';
import { isLoggedInVar, logUserOut } from '../apollo';
import Auth from './auth';
import useUser from '../hooks/useMe';

export default function Header() {
  const { data } = useUser();
  return (
    <div className="w-full h-16 fixed bg-white">
      <div className="lg:w-lg lg:p-0 lg:m-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center h-full">
          <a className="cursor-pointer">
            <Link href="/">
              <h1>Logo</h1>
            </Link>
          </a>
        </div>
        <div className="flex items-center h-full">
          {isLoggedInVar() && (
            <a className="mr-3.5 text-xl cursor-pointer">
              <Link href="/create-event">
                <AiFillPlusCircle className="text-2xl" />
              </Link>
            </a>
          )}
          {!isLoggedInVar() && (
            <Popup
              trigger={
                <button className="py-1.5 px-2.5 hover:bg-gray-200 border border-gray-300 rounded font-semibold">
                  로그인
                </button>
              }
              modal
              nested
              repositionOnResize
            >
              {(close) => <Auth close={close} />}
            </Popup>
          )}
          {isLoggedInVar() && (
            <Popup
              trigger={
                <img
                  src={data?.me?.avatar}
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              }
              arrowStyle={{ display: 'none' }}
              contentStyle={{
                padding: 0,
                border: 'none',
                borderRadius: 0,
              }}
              position="bottom right"
              closeOnEscape
            >
              <div className="shadow">
                <div className="p-3 cursor-pointer hover:bg-gray-100">
                  내 이벤트
                </div>
                <Link href="/setting">
                  <div className="p-3 cursor-pointer hover:bg-gray-100">
                    <a>설정</a>
                  </div>
                </Link>
                <div
                  className="p-3 cursor-pointer hover:bg-gray-100"
                  onClick={logUserOut}
                >
                  로그아웃
                </div>
              </div>
            </Popup>
          )}
        </div>
      </div>
    </div>
  );
}