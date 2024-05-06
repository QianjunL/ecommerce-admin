import { useSession } from "next-auth/react";

export default function HomeHeader() {
    const {data:session} =useSession();
    
    return (
        <div className="text-gray-700 flex justify-between">
        <h2 className="mt-0">
          <div className="flex gap-2 items-center">
          <img src={session?.user?.image} alt='' className="w-6 h-6 rounded-sm sm:hidden"/>
          <div>
          Hello, <b>{session?.user?.name}</b>
          </div>
          </div>
          </h2>
        <div className="hidden sm:block">
          <div className="flex text-black gap-2 rounded-md p-1.5 bg-gray-300">
          <img src={session?.user?.image} alt='' className="w-6 h-6"/>
        <span className="px-2">
        {session?.user?.name}
        </span>

          </div>
        </div>
      </div>
    );
}