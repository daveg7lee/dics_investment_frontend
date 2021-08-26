import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

const GET_USER_QUERY = gql`
  query getUser($GetUserInput: GetUserInput!) {
    getUser(GetUserInput: $GetUserInput) {
      id
      username
      email
      avatar
    }
  }
`;

export default function userProfile() {
  const router = useRouter();
  const { data } = useQuery(GET_USER_QUERY, {
    variables: {
      GetUserInput: { id: router?.query?.userId },
    },
  });
  console.log(data);
  return <div>Hello</div>;
}
