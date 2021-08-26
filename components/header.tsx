import Popup from 'reactjs-popup';
import Link from 'next/link';
import { isLoggedInVar, logUserOut } from '../apollo';
import Auth from './auth';
import useUser from '../hooks/useMe';
import { useRef } from 'react';

const menuContentStyle = {
  padding: 'none',
  border: 'none',
  width: 'auto',
  height: 'auto',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  marginTop: '15px',
};

export default function Header() {
  const menuRef = useRef();
  const openMenu = () => menuRef?.current?.open();
  const closeMenu = () => menuRef?.current?.close();
  const { data } = useUser();
  return (
    <div className="w-full h-16 fixed bg-white z-10">
      <div className="lg:w-lg lg:p-0 lg:m-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center h-full">
          <a className="cursor-pointer">
            <Link href="/">
              <h1 className="text-base">Logo</h1>
            </Link>
          </a>
        </div>
        <div className="flex items-center h-full">
          {isLoggedInVar() && (
            <a className="mr-3.5 text-sm font-semibold cursor-pointer button rounded-full border border-gray-300 hover:bg-gray-300">
              <Link href="/create-event">새 이벤트</Link>
            </a>
          )}
          {!isLoggedInVar() && (
            <Popup
              trigger={
                <button className="py-1.5 px-3 hover:bg-gray-200 border border-gray-300 rounded-full font-semibold">
                  로그인
                </button>
              }
              modal
              nested
            >
              {(close) => <Auth close={close} />}
            </Popup>
          )}
          {isLoggedInVar() && (
            <>
              <Popup
                ref={menuRef}
                trigger={
                  <img
                    src={data?.me?.avatar}
                    className="w-9 h-9 rounded-full cursor-pointer"
                    onClick={openMenu}
                  />
                }
                arrow={false}
                contentStyle={menuContentStyle}
                overlayStyle={{
                  display: 'none',
                }}
                position="bottom right"
                closeOnDocumentClick
              >
                <div>
                  <Link href="/my-event">
                    <div
                      className="px-10 py-3  cursor-pointer hover:bg-gray-100"
                      onClick={closeMenu}
                    >
                      <a>내 이벤트</a>
                    </div>
                  </Link>
                  <Link href="/setting">
                    <div
                      className="px-10 py-3  cursor-pointer hover:bg-gray-100"
                      onClick={closeMenu}
                    >
                      <a>설정</a>
                    </div>
                  </Link>
                  <div
                    className="px-10 py-3  cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      closeMenu();
                      logUserOut();
                    }}
                  >
                    로그아웃
                  </div>
                </div>
              </Popup>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
