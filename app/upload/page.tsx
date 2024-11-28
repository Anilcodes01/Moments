

import MomentUploadForm from '@/app/components/MomentUploadForm';
import Appbar from '../components/Appbar';
import Sidebar from '../components/sidebar';

export default function UploadPage() {
  return (
    <div className=' '>
      <div className="">
        <Appbar />
      </div>

    <div className='flex'>
    <div className="hidden md:block fixed w-52 pt-12 lg:w-64 bg-white shadow-md h-full">
          <Sidebar />
        </div>
      
      <div className='bg-gradient-to-br md:ml-52 min-h-screen md:w-full md:p-8 w-full  from-blue-50 via-purple-50 flex items-center  to-pink-50'>
      <MomentUploadForm />
      </div>
    </div>

      <div className="md:hidden h-12 fixed bottom-0 w-full bg-white border-t border-slate-200">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
}
