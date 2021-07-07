import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Loader from 'react-loader-spinner';

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
  return (
    <div>
      {data ? (
        <div className="w-full min-h-screen md:px-20">
          <div className="w-full flex flex-col items-center justify-center my-10">
            <img src={data?.seeEvent?.banner} className="h-80" />
          </div>
          <h1 className="text-5xl font-semibold mb-14">
            {data?.seeEvent?.title}
          </h1>
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
