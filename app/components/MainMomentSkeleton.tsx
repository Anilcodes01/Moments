import Appbar from "./Appbar";
import Sidebar from "./sidebar";

export default function MainMomentSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 mb-12 to-pink-50">
      <div className="h-12">
        <Appbar />
      </div>

      <div className="flex">
        <div className="hidden md:block w-52 fixed lg:w-64 shadow-md h-full">
          <Sidebar />
        </div>

        <div className="p-4 animate-pulse flex lg:ml-64 md:ml-52 w-full flex-col">
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          <div className="mt-8 flex gap-4">
            <div className="rounded-full h-12 w-12 bg-gray-200"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
          </div>

        
          <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-auto p-2 rounded-lg mt-6 bg-gray-200">
              <div className="rounded-lg h-48 w-full bg-gray-100"></div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-1/3 rounded-lg bg-gray-100"></div>
              </div>
            </div>
            <div className="h-auto p-2 rounded-lg mt-6 bg-gray-200">
              <div className="rounded-lg h-48 w-full bg-gray-100"></div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-2/3 rounded-lg bg-gray-100"></div>
              </div>
            </div>
            <div className="h-auto p-2 rounded-lg mt-6 bg-gray-200">
              <div className="rounded-lg h-48 w-full bg-gray-100"></div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-full rounded-lg bg-gray-100"></div>
                <div className="h-6 w-2/3 rounded-lg bg-gray-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
