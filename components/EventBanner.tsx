import Link from 'next/link';
import { FaDonate } from 'react-icons/fa';

export default function EventBanner({ id, title, owner, payUrl, banner }) {
  return (
    <div className="w-full bg-white rounded shadow">
      <Link href={`/detail/${id}`}>
        <a>
          <div className="w-full h-44 rounded-t overflow-hidden flex justify-center items-center">
            <img src={banner} />
          </div>
          <div className="px-4 py-3">
            <h1 className="font-semibold text-lg">{title}</h1>
          </div>
        </a>
      </Link>
      <div className="px-4 py-3 flex items-center justify-between">
        <a href={owner.username}>
          <div className="flex items-center">
            <img src={owner.avatar} className="rounded-full w-8 h-8 mr-2" />
            <h1 className="font-medium">{owner.username}</h1>
          </div>
        </a>
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
