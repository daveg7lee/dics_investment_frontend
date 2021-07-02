import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import QrcodeDecoder from 'qrcode-decoder';
import { toast } from 'react-toastify';

const CREATE_EVENT_MUTATION = gql`
  mutation createEvent($CreateEventInput: CreateEventInput!) {
    createEvent(CreateEventInput: $CreateEventInput) {
      error
      ok
    }
  }
`;

export default function PostEvent({ title, purpose }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [payUrl, setPayUrl] = useState('');
  const onCompleted = (data: any) => {
    const {
      createEvent: { ok },
    } = data;
    if (ok) {
      router.push('/');
    }
  };
  const [createEventMutation] = useMutation(CREATE_EVENT_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (payUrl) {
      createEventMutation({
        variables: { CreateEventInput: { title, purpose, payUrl } },
      });
    } else {
      toast.error('카카오페이 송금 QR코드가 없습니다');
    }
  };
  const getFile = async (e) => {
    const qr = new QrcodeDecoder();
    const reader = new FileReader();
    const files = e.target.files;
    reader.onload = async () => {
      const { data } = await qr.decodeFromImage(reader.result);
      setPayUrl(data);
    };
    reader.readAsDataURL(files[0]);
  };
  return <div></div>;
}
