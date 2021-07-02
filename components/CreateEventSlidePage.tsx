import { BsImage } from 'react-icons/bs';
import QRCode from 'react-qr-code';

const CreateEventSlidePage = ({
  payUrl,
  onChangeQRCode,
  onChangeBannerImg,
  bannerPreview,
  onSubmit,
}) => (
  <div className="w-full h-full flex flex-col items-center">
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-2 w-80 text-left">
        배너 이미지
      </h1>
      <div className=" w-80 bg-gray-300 h-44 rounded flex flex-col justify-center items-center mb-8 overflow-hidden">
        {bannerPreview ? (
          <img src={bannerPreview} className="object-cover" />
        ) : (
          <>
            <BsImage className="text-7xl" />
            <label
              htmlFor="banner"
              className="button rounded cursor-pointer bg-blue-400 text-white mt-2"
            >
              이미지 업로드
              <input
                type="file"
                name="banner"
                id="banner"
                className="hidden"
                onChange={onChangeBannerImg}
              />
            </label>
          </>
        )}
      </div>
    </div>
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-2 w-80">카카오페이 QR코드</h1>
      {payUrl && <QRCode value={payUrl} />}
      <div className="w-80">
        <label
          htmlFor="payUrl"
          className="button rounded cursor-pointer bg-blue-400 text-white mt-2 w-max"
        >
          이미지 업로드
          <input
            type="file"
            name="payUrl"
            id="payUrl"
            className="hidden"
            onChange={onChangeQRCode}
          />
        </label>
      </div>
    </div>
    <div className="w-80 flex justify-end items-center">
      <input
        type="submit"
        value="게시하기"
        className="button rounded bg-red-400 text-white cursor-pointer"
        onClick={onSubmit}
      />
    </div>
  </div>
);

export default CreateEventSlidePage;
