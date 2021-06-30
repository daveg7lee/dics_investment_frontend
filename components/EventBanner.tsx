import { FaDonate } from 'react-icons/fa';

export default function EventBanner({ id, title, purpose, owner, payUrl }) {
  return (
    <div className="w-full bg-white rounded shadow">
      <div className="bg-red-400 w-full h-36 rounded-t"></div>
      <div className="p-4">
        <h1 className="font-semibold text-lg">{title}</h1>
        <p className="text-sm font-light">{purpose}</p>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={owner.avatar} className="rounded-full w-8 h-8 mr-2" />
          <h1>{owner.username}</h1>
        </div>
        <div>
          <a
            rel="noopener noreferrer"
            target="_blank"
            className="flex justify-center items-center cursor-pointer"
            href={payUrl}
          >
            <FaDonate className="text-2xl" />
          </a>
        </div>
      </div>
    </div>
  );
}
