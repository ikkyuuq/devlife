export const Footer = () => {
  return (
    <footer className="w-full max-w-7xl flex flex-col items-center text-zinc-500 py-4">
      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col">
          <span className="font-bold">Follow Us</span>
          <span>Discord</span>
          <span>Twitter</span>
          <span>Instagram</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Contact Us</span>
          <span>Discord Community</span>
          <span>Email: the.kittipongpras@gmail.com</span>
        </div>
      </div>
      <div className="mt-4">
        <span>
          &copy; {new Date().getFullYear()} Devlife. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
