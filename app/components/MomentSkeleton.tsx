


export default function MomentSkeleton() {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50  to-pink-50">
        
        <div className=" animate-pulse min-h-screen ">
            <div className="flex flex-col">
                <div className="flex gap-2 mb-4 items-center">
                    <div className="rounded-full h-12 w-12 bg-gray-200"></div>
                    <div className="h-8 w-36 rounded bg-gray-200"></div>
                </div>
            <div className="h-48 w-full bg-gray-200"></div>
            <div className="flex mt-4 gap-4">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
                <div className="h-6 rounded bg-gray-200 w-2/3"></div>
            </div>
            <div className="h-6 rounded w-full bg-gray-200 mt-2"></div>


                <div className="flex gap-2 mb-4 mt-8 items-center">
                    <div className="rounded-full h-12 w-12 bg-gray-200"></div>
                    <div className="h-8 w-36 rounded bg-gray-200"></div>
                </div>
            <div className="h-48 w-full bg-gray-200"></div>
            <div className="flex mt-4 gap-4">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
                <div className="h-6 rounded bg-gray-200 w-2/3"></div>
            </div>
            <div className="h-6 rounded w-full bg-gray-200 mt-2"></div>
            </div>
            
        </div>
    </div>
}