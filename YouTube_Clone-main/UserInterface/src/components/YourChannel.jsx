import { useState , useEffect } from "react";
import React  from 'react'
import { Link , Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";

function YourChannel() {
  const data = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.status);
  const [userdata, setUserData] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!authStatus || !token || !data._id) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/account/userData/${data._id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [authStatus, data._id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          {/*-------------------content---------------------  */}
          <div className="mt-4 flex items-center gap-5">
            {userdata ? (
              <>
                <img className="w-28 h-28 rounded-full" src={userdata.avatar} alt="not found" />
                <div className="font-bold dark:text-black">
                  <div className='text-lg'>{(userdata.name || "Admin").toUpperCase()}</div>
                  <div className="text-sm mb-3 text-gray-500">Joined in {formatDate(userdata.createdAt)}</div>
                  <Link to={"/customize_channel"}>
                    <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-2.5 py-2.5 me-2">Customize channel</button>
                  </Link>
                </div>
              </>
            ) : (
              // Show placeholder with channel name if available, else generic loading
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-gray-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {data?.name ? `${data.name.toUpperCase()} :` : "Loading channel..."}
                  </div>
                  <div className="text-sm text-gray-400">Loading channel info...</div>
                </div>
              </div>
            )}
          </div>
          {/* --------------------------------tab-------------------------------- */}
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
              <li className="me-2">
                <Link
                  to={""}
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
                >
                  <svg
                    className="w-4 h-4 me-2 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>
                   All Videos
                </Link>
              </li>
              <li className="me-2">
                <Link
                  to={"upload_video"}
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  <svg
                    className="w-4 h-4 me-2 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
                  </svg>
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>

          {/* --------------------------------tab-------------------------------- */}
          {/* <hr className='mt-4' /> */}

          <Outlet />


        
      
       {/*-------------------content---------------------  */}
    </div>
    </div>
    </>
  )
}

export default YourChannel