import { gql, useQuery } from '@apollo/client';
import EventBanner from '../components/EventBanner';

const SEE_EVENTS_QUERY = gql`
  query seeEvents {
    seeEvents {
      id
      title
      payUrl
      banner
      owner {
        id
        avatar
        username
      }
    }
  }
`;

export default function home() {
  const { data } = useQuery(SEE_EVENTS_QUERY);
  return (
    <div className=" mt-6 py-10 grid lg:grid-cols-3 grid-flow-row gap-10 md:grid-cols-2 sm:grid-cols-1">
      {data?.seeEvents?.map((event) => {
        return (
          <EventBanner
            key={event.id}
            id={event.id}
            title={event.title}
            owner={event.owner}
            payUrl={event.payUrl}
            banner={event.banner}
          />
        );
      })}
    </div>
  );
}
