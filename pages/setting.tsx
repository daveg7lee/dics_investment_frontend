import QrcodeDecoder from 'qrcode-decoder';
import useUser from '../hooks/useMe';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import axios from 'axios';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($EditProfileInput: EditProfileInput!) {
    editProfile(EditProfileInput: $EditProfileInput) {
      ok
      error
    }
  }
`;

export default function Setting() {
  const { data } = useUser();
  const onCompleted = (data: any) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok) {
      window.location.reload();
    }
  };
  const [editProfile] = useMutation(EDIT_PROFILE_MUTATION, { onCompleted });
  const [payUrl, setPayUrl] = useState('');
  const [preview, setPreview] = useState<any>('');
  const getProfileFile = async (e) => {
    const formData = new FormData();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = async () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    formData.append('file', file);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLIAD_PRESET);
    formData.append('timestamp', String(Date.now() / 1000));
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_URL}/image/upload`,
      formData
    );
    editProfile({
      variables: { EditProfileInput: { avatar: response.data.url } },
    });
  };
  const getPayUrlFile = async (e) => {
    const qr = new QrcodeDecoder();
    const reader = new FileReader();
    const files = e.target.files;
    reader.onload = async () => {
      const { data } = await qr.decodeFromImage(reader.result);
      editProfile({ variables: { EditProfileInput: { payUrl: data } } });
      setPayUrl(data);
    };
    reader.readAsDataURL(files[0]);
  };
  return (
    <main>
      <section className="flex h-52">
        <div className="pr-6 flex flex-col">
          <img
            src={preview ? preview : data?.me?.avatar}
            className="w-32 h-32 rounded-full mb-5"
          />
          <label
            className="px-5 py-1.5 rounded border border-gray-300 cursor-pointer"
            htmlFor="img"
          >
            이미지 업로드
            <input
              type="file"
              accept="image/*"
              name="img"
              id="img"
              className="hidden"
              onChange={getProfileFile}
            />
          </label>
        </div>
        <div className="pl-6 flex flex-col border-l border-gray-300">
          <h1 className="text-4xl font-bold mb-3">{data?.me?.username}</h1>
          <p className="cursor-pointer underline select-none">수정하기</p>
        </div>
      </section>
      <section className="mt-12">
        <div className="py-4 border-b border-gray-300">
          <h1 className="leading-10 font-bold text-xl">이메일 주소</h1>
          <p className="py-2 text-gray-500">{data?.me?.email}</p>
        </div>
        <div className="py-4 border-b border-gray-300">
          <h1 className="leading-10 font-bold text-xl">
            카카오페이 송금 QR코드
          </h1>
          <div className="flex items-end justify-between">
            <p className="py-2 text-gray-500">
              {data?.me?.payUrl ? (
                <QRCode value={payUrl ? payUrl : data?.me?.payUrl} size={100} />
              ) : (
                '없음'
              )}
            </p>
            <label
              className="px-5 py-1.5 rounded border border-gray-300 cursor-pointer"
              htmlFor="payUrl"
            >
              이미지 업로드
              <input
                type="file"
                name="payUrl"
                id="payUrl"
                className="hidden"
                onChange={getPayUrlFile}
              />
            </label>
          </div>
        </div>
      </section>
    </main>
  );
}
