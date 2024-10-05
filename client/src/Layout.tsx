import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="relative overflow-hidden min-h-screen h-full flex flex-col items-center bg-black">
      {/* <div className="opacity-75 transition-all duration-1000 -top-20 -right-20 absolute lg:w-[600px] lg:h-[600px] w-[450px] h-[450px] bg-gradient-to-br from-white to-green-300 rounded-full blur-3xl"></div> */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_center,_#ffffff20_1px,_transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,_black_20%,_transparent_100%)]"></div>
      <Header />
      <main className="relative flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
