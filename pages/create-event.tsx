import dynamic from 'next/dynamic';
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

export default function CreateEvent() {
  return (
    <div className="flex flex-col items-center min-h-screen pb-10 px-32">
      <input
        type="text"
        maxLength={30}
        className="w-full h-24 mt-6 text-3xl font-semibold border-0 outline-none placeholder-gray-300"
        placeholder="제목을 입력하세요."
      />
      <div className="w-full rounded">
        <CustomToolbar />
        <ReactQuill
          modules={modules}
          formats={formats}
          onChange={(content, delta, source, editor) =>
            console.log(editor.getHTML())
          }
          className="w-full border-none"
        />
      </div>
      <div className="w-full mt-5 flex justify-end items-center">
        <button className="button bg-red-400 rounded text-white">다음</button>
      </div>
    </div>
  );
}
