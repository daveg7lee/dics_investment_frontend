import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Loader from 'react-loader-spinner';
import { IoSettingsSharp } from 'react-icons/io5';
import useUser from '../../hooks/useMe';

const SEE_EVENT_QUERY = gql`
  query seeEvent($seeEventInput: SeeEventInput!) {
    seeEvent(seeEventInput: $seeEventInput) {
      title
      purpose
      owner {
        avatar
        username
      }
      payUrl
      banner
    }
  }
`;

export default function DetailPage() {
  const {
    query: { id },
  } = useRouter();
  const { data } = useQuery(SEE_EVENT_QUERY, {
    variables: { seeEventInput: { id: Number(id) } },
  });
  const { data: userData } = useUser();
  return (
    <div>
      {data ? (
        <div className="w-full min-h-screen md:px-20">
          <div className="w-full relative my-10">
            {data?.seeEvent?.owner?.username == userData?.me?.username && (
              <IoSettingsSharp className="text-2xl cursor-pointer absolute right-0" />
            )}
            <div className="flex items-center justify-center w-full">
              <img src={data?.seeEvent?.banner} className="h-80" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-14">{data?.seeEvent?.title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: data?.seeEvent?.purpose }}
            className="maintext"
          />
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader type="TailSpin" color="#444444" height={30} width={30} />
        </div>
      )}
    </div>
  );
}
