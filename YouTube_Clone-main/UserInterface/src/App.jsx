import { Navbar , Sidebar } from "./components";
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slice/authSlice";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate Redux user state from storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Navbar openChange={() => setIsOpen(prev => !prev)} />
      <div className={`flex pt-8  overflow-hidden bg-gray-50 `}>
        <Sidebar hidden={isOpen} />
        <div
          id="main-content"
          className={`relative w-full h-full overflow-y-auto bg-gray-50 ${isOpen ? "lg:ml-52" : "ml-0"} `}
          style={{ paddingTop: 32 }}
        >
          <main>
            <Outlet/>
          </main>
        </div>
      </div>
    </>
  );;
}

export default App;;