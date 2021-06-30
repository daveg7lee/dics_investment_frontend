import QrcodeDecoder from 'qrcode-decoder';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import { toast } from 'react-toastify';

const CREATE_EVENT_MUTATION = gql`
  mutation createEvent($CreateEventInput: CreateEventInput!) {
    createEvent(CreateEventInput: $CreateEventInput) {
      error
      ok
    }
  }
`;

export default function CreateEvent() {
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
  const onSubmit = ({ title, purpose }) => {
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
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <div className="w-2/3 flex justify-start mb-2">
        <h1 className="text-3xl font-semibold">이벤트 게시하기</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-2/3 border border-gray-400 rounded flex flex-col items-center py-8"
      >
        <div className="w-3/5 mb-5">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            placeholder="제목을 입력하세요"
            className="w-full"
            {...register('title')}
          />
        </div>
        <div className="w-3/5 mb-5">
          <label htmlFor="purpose">목적</label>
          <input
            type="text"
            id="purpose"
            placeholder="목적을 입력하세요"
            className="w-full"
            {...register('purpose')}
          />
        </div>
        <div className="w-3/5 mb-5">
          <label>카카오페이 송금 QR코드</label>
          {payUrl && <QRCode value={payUrl} />}
          <label
            htmlFor="payUrl"
            className="px-2.5 py-1.5  border border-gray-300 rounded w-max mt-0.5 cursor-pointer"
          >
            {payUrl ? '수정하기' : '업로드'}
          </label>
          <input
            type="file"
            name="payUrl"
            id="payUrl"
            className="hidden"
            onChange={getFile}
          />
        </div>
        <div className="w-3/5 flex items-center justify-end">
          <input
            type="submit"
            value="게시하기"
            className="px-2.5 py-1.5 bg-red-400 rounded text-white cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
}
