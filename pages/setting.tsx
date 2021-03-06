import QrcodeDecoder from 'qrcode-decoder';
import useUser from '../hooks/useMe';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($EditProfileInput: EditProfileInput!) {
    editProfile(EditProfileInput: $EditProfileInput) {
      ok
      error
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation deleteUser {
    deleteUser {
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
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [isEdit, setIsEdit] = useState(false);
  const [payUrl, setPayUrl] = useState('');
  const [preview, setPreview] = useState<any>('');
  const [isAccepted, setIsAccepted] = useState(false);
  const { handleSubmit, register } = useForm();
  const onSubmit = ({ username }) => {
    editProfile({ variables: { EditProfileInput: { username } } });
    setIsEdit(false);
  };
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
            ????????? ?????????
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
          {isEdit ? (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  defaultValue={data?.me?.username}
                  className="text-4xl font-bold mb-3"
                  {...register('username')}
                />
                <div className="flex items-center justify-end">
                  <input
                    type="submit"
                    className="cursor-pointer select-none px-3 py-1.5 border border-gray-300 bg-white w-max rounded"
                    value="????????????"
                  />
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-3">{data?.me?.username}</h1>
              <p
                className="cursor-pointer underline select-none text-gray-500"
                onClick={() => setIsEdit(true)}
              >
                ????????????
              </p>
            </>
          )}
        </div>
      </section>
      <section className="mt-12">
        <div className="py-4 border-b border-gray-300">
          <h1 className="leading-10 font-bold text-xl">????????? ??????</h1>
          <p className="py-2 text-gray-500">{data?.me?.email}</p>
        </div>
        <div className="py-4 border-b border-gray-300">
          <h1 className="leading-10 font-bold text-xl">
            ??????????????? ?????? QR??????
          </h1>
          <div className="flex items-end justify-between py-3">
            <p className="text-gray-500 flex items-end m-0 h-full">
              {data?.me?.payUrl ? (
                <QRCode value={payUrl ? payUrl : data?.me?.payUrl} size={100} />
              ) : (
                <img
                  src={
                    'https://res.cloudinary.com/du4erd9mp/image/upload/v1625234278/donate/x1b5tsjvjfspfop3erhu.jpg'
                  }
                  alt="??????"
                  className="w-52"
                />
              )}
            </p>
            <label
              className="px-5 py-1.5 rounded border border-gray-300 cursor-pointer m-0"
              htmlFor="payUrl"
            >
              ????????? ?????????
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
        <div className="py-4">
          <h1 className="leading-10 font-bold text-xl">?????? ??????</h1>
          <div className="flex items-end justify-between">
            <label
              htmlFor="deleteUser"
              className="flex items-center text-gray-500 font-light"
            >
              <input
                type="checkbox"
                id="deleteUser"
                className="mr-2"
                onChange={() => setIsAccepted(!isAccepted)}
              />
              ?????? ????????? ????????? ???????????? ?????? ???????????? ????????? ??? ?????????
              ?????????????????????.
            </label>
            <button
              className="px-2 py-1.5 bg-red-400 disabled:opacity-60 rounded text-white"
              disabled={!isAccepted}
              onClick={async () => {
                await deleteUser();
              }}
            >
              ?????? ??????
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
