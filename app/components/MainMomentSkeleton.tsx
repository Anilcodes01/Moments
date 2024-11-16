import Appbar from "./Appbar";


export default function MainMomentSkeleton() {


    return <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-purple-50  to-pink-52">
        <div className="h-16">
            <Appbar />
        </div>

        <div className="p-4 animate-pulse flex flex-col">
            <div className="h-12 bg-gray-200 rounded-lg w-full "></div>
            <div className="mt-8 flex gap-4">
                <div className="rounded-full h-12 w-12 bg-gray-200"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
            </div>
            <div>
                <div className="rounded-lg h-48 w-full bg-gray-800 mt-6"></div>
                <div className="mt-4 flex flex-col gap-2">
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded mt-2"></div>
                </div>
            </div>
        </div>
    </div>
}