

import MomentUploadForm from '@/app/components/MomentUploadForm';
import Appbar from '../components/Appbar';
import Sidebar from '../components/sidebar';

export default function UploadPage() {
  return (
    <div className='min-h-screen'>
      <div className="">
        <Appbar />
      </div>

      <div className="hidden md:block w-52 lg:w-80 bg-white shadow-md h-full">
          <Sidebar />
        </div>
      
      <MomentUploadForm />

      <div className="md:hidden h-12 fixed bottom-0 w-full bg-white border-t border-gray-500">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
}
