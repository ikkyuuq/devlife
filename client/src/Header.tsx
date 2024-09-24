import { Button } from "./components/ui/button";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from "./components/ui/dialog";
export const Header = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 mx-auto w-full max-w-7xl flex justify-between items-center py-4">
      <div>
        <h1 className="text-xl text-zinc-50 font-bold">
          <a href={isRoot ? "#devlife" : "/#devlife"}>Devlife</a>
        </h1>
      </div>
      <div className="flex-grow">
        <ul className="flex gap-6 justify-center text-zinc-50">
          <li>
            <a href="/explore">Explore</a>
          </li>
          <li>
            <a href="/roadmaps">Roadmaps</a>
          </li>
          <li>
            <a href={isRoot ? "#features" : "/#features"}>Features</a>
          </li>
        </ul>
      </div>
      <div className="flex gap-4">
        <Dialog>
          <DialogTrigger>
            <Button variant={"ghost"}>Sign in</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign in</DialogTitle>
              <DialogDescription>Welcome come back stranger</DialogDescription>
            </DialogHeader>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <Button variant={"outline"}>Sign up</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign up</DialogTitle>
              <DialogDescription>Welcome come stranger</DialogDescription>
            </DialogHeader>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};
