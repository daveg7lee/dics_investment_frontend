import { gql, useQuery } from '@apollo/client';
import EventBanner from '../components/EventBanner';

const MY_EVENTS_QUERY = gql`
  query myEvents {
    myEvents {
      id
      title
      banner
      payUrl
      owner {
        username
      }
    }
  }
`;

export default function myEvent() {
  const { data } = useQuery(MY_EVENTS_QUERY);
  return (
    <div>
      {data?.myEvents?.map((event) => {
        return <EventBanner {...event} key={event.id} />;
      })}
    </div>
  );
}
