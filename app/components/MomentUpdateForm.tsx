// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { useParams, useRouter } from 'next/navigation';


// type Media = {
//     id: string;
//     url: string;
//     type: "PHOTO" | "VIDEO";
//     caption: string;
//     createdAt: string; 
//   };

// interface Moment {
//    moment: {
//     id: string;
//     title: string;
//     caption: string;
//     coverImage: string;
//     createdAt: string;
//     media: Media[];
//     user: {
//       id: string;
//       username: string;
//       name: string;
//       avatarUrl: string;
//     };
//    }
//   };

// const MomentUpdateForm = () => {
//   const { id } = useParams();
//   const [showForm, setShowForm] = useState(false);
//   const [mediaFile, setMediaFile] = useState(null);
//   const [mediaCaption, setMediaCaption] = useState('');

//   const mediaInputRef = useRef(null);

//   const handleAddMedia = () => {
//     setShowForm(true);
//   };

//   const handleMediaFileChange = (e: any) => {
//     setMediaFile(e.target.files[0]);
//   };

//   const handleMediaCaptionChange = (e: any) => {
//     setMediaCaption(e.target.value);
//   };

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
  
//       if (mediaFile) {
//         formData.append('media_0', mediaFile);
//       }
  
//       formData.append('caption_0', mediaCaption);
  
//       const response = await axios.put(`/api/moments/updateMoment/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       const { moment: updatedMoment, media } = response.data;
//       console.log('Updated moment:', updatedMoment);
//       console.log('New media:', media);
  
//       setShowForm(false);
//       setMediaFile(null);
//       setMediaCaption('');
  
//       if (mediaInputRef.current) {
//         (mediaInputRef.current as HTMLInputElement).value = '';
//       }
//     } catch (error) {
//       console.error('Error updating moment:', error);
//     }
//   };

//   return (
//     <div>
//       {!showForm && (
//         <button
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//           onClick={handleAddMedia}
//         >
//           Add Media
//         </button>
//       )}
//       {showForm && (
//         <div className="mt-4">
//           <input
//             type="file"
//             ref={mediaInputRef}
//             onChange={handleMediaFileChange}
//             className="block w-full text-sm text-slate-500
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-full file:border-0
//               file:text-sm file:font-semibold
//               file:bg-violet-50 file:text-violet-700
//               hover:file:bg-violet-100"
//           />
//           <textarea
//             value={mediaCaption}
//             onChange={handleMediaCaptionChange}
//             placeholder="Enter media caption"
//             className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MomentUpdateForm;