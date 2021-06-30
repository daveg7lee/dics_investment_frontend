import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import KaKaoLogin from 'react-kakao-login';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

const AUTH_MUTATION = gql`
  mutation auth($AuthInput: AuthInput!) {
    auth(AuthInput: $AuthInput) {
      error
      ok
      token
    }
  }
`;

export default function Auth() {
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
    <div className="flex flex-col items-center h-96">
      <div className="pt-16">
        <h1 className="text-4xl font-semibold">App Title</h1>
      </div>
      <div className="flex flex-col justify-center items-center h-full">
        <KaKaoLogin
          token={process.env.NEXT_PUBLIC_KAKAO_KEY}
          onSuccess={onKakaoLogin}
          onFail={console.error}
          onLogout={console.info}
        />
      </div>
    </div>
  );
}
