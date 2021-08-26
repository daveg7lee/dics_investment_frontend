import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import KaKaoLogin from 'react-kakao-login';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { IoCloseOutline } from 'react-icons/io5';

const AUTH_MUTATION = gql`
  mutation auth($AuthInput: AuthInput!) {
    auth(AuthInput: $AuthInput) {
      error
      ok
      token
    }
  }
`;

export default function Auth({ close }) {
  const router = useRouter();
  const onCompleted = (data: any) => {
    const {
      auth: { ok, token, error },
    } = data;
    console.log(ok, token, error);
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      router.reload();
    }
  };
  const [auth] = useMutation(AUTH_MUTATION, { onCompleted });
  const onKakaoLogin = ({ profile }: any) => {
    const username = profile.properties.nickname;
    const avatar = profile.properties.profile_image;
    const email = profile.kakao_account.email;
    const id = profile.id.toString();
    auth({
      variables: {
        AuthInput: {
          id,
          username,
          avatar,
          email,
        },
      },
    });
  };
  return (
    <div className="flex items-center h-full w-full">
      <button
        className="absolute top-10 right-10 md:top-5 md:right-5"
        onClick={close}
      >
        <IoCloseOutline className="text-3xl" />
      </button>
      <div className="md:flex items-center justify-center w-5/12 text-white animate-background hidden">
        <h1 className="text-3xl font-semibold">환영합니다!</h1>
      </div>
      <div className="flex flex-col justify-center items-center h-full md:w-7/12 w-full">
        <h1 className="leading-10 text-3xl font-semibold mb-8">
          ?에 로그인하기
        </h1>
        <KaKaoLogin
          token={process.env.NEXT_PUBLIC_KAKAO_KEY}
          onSuccess={onKakaoLogin}
          onFail={console.error}
          onLogout={console.info}
          className="font-semibold"
        />
      </div>
    </div>
  );
}
