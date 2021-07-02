import { gql, useMutation } from '@apollo/client';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import dynamic from 'next/dynamic';
import QrcodeDecoder from 'qrcode-decoder';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SlidingPane from 'react-sliding-pane';
import { toast } from 'react-toastify';
import CreateEventSlidePage from '../components/CreateEventSlidePage';
const ReactQuill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: {
    container: '#toolbar',
  },
};

const CustomToolbar = () => (
  <div id="toolbar" className="flex items-center h-14">
    <select className="ql-header">
      <option value="1"></option>
      <option value="2"></option>
      <option value="3"></option>
      <option value="4" selected></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>
    <select className="ql-background"></select>
    <button className="ql-link"></button>
    <button className="ql-image"></button>
    <button className="ql-code-block"></button>
  </div>
);

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'align',
  'color',
  'background',
  'image',
  'code-block',
];

const CREATE_EVENT_MUTATION = gql`
  mutation createEvent($CreateEventInput: CreateEventInput!) {
    createEvent(CreateEventInput: $CreateEventInput) {
      error
      ok
    }
  }
`;

export default function CreateEvent() {
  const { register, getValues } = useForm();
  const router = useRouter();
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
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [payUrl, setPayUrl] = useState<any>('');
  const [bannerPreview, setBannerPreview] = useState<any>('');
  const [banner, setBanner] = useState('');
  const [purpose, setPurpose] = useState('');
  const onChangeQRCode = (e) => {
    const qr = new QrcodeDecoder();
    const reader = new FileReader();
    const files = e.target.files;
    reader.onload = async () => {
      const { data } = await qr.decodeFromImage(reader.result);
      setPayUrl(data);
    };
    reader.readAsDataURL(files[0]);
  };
  const onChangeBannerImg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setBanner(file);
    reader.onload = () => {
      setBannerPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const onSubmit = async () => {
    const { title } = getValues();
    let bannerUrl;
    if (banner) {
      const formData = new FormData();
      formData.append('file', banner);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLIAD_PRESET);
      formData.append('timestamp', String(Date.now() / 1000));
      const {
        data: { url },
      } = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_URL}/image/upload`,
        formData
      );
      bannerUrl = url;
    }
    if (title && purpose && payUrl) {
      await createEventMutation({
        variables: {
          CreateEventInput: { title, purpose, banner: bannerUrl, payUrl },
        },
      });
    } else {
      toast.error('모든 항목은 필수로 채워져야 합니다.');
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen pb-10 md:px-32">
      <input
        type="text"
        maxLength={30}
        className="w-full h-24 mt-6 text-3xl font-semibold border-0 outline-none placeholder-gray-300"
        placeholder="제목을 입력하세요."
        {...register('title')}
      />
      <div className="w-full rounded">
        <CustomToolbar />
        <ReactQuill
          modules={modules}
          formats={formats}
          onChange={(content, delta, source, editor) =>
            setPurpose(editor.getHTML())
          }
          className="w-full border-none"
        />
      </div>
      <div className="w-full mt-5 flex justify-end items-center">
        <button
          className="button bg-red-400 rounded text-white"
          onClick={() => setIsPaneOpen(!isPaneOpen)}
        >
          다음
        </button>
      </div>
      <SlidingPane
        overlayClassName="z-10 m-0"
        width="100%"
        isOpen={isPaneOpen}
        title="이벤트 게시하기"
        from="bottom"
        shouldCloseOnEsc
        onRequestClose={() => {
          setIsPaneOpen(false);
        }}
      >
        <div className="py-5">
          <CreateEventSlidePage
            payUrl={payUrl}
            onChangeQRCode={onChangeQRCode}
            onChangeBannerImg={onChangeBannerImg}
            bannerPreview={bannerPreview}
            onSubmit={onSubmit}
          />
        </div>
      </SlidingPane>
    </div>
  );
}
