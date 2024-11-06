import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./Home";
import { Explore } from "./Explore";
import { Roadmap } from "./Roadmap";
import { Task } from "./Task";
import { CreateTask } from "./CreateTask";
import { EditTask } from "./EditTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/roadmaps" element={<Roadmap />} />
          <Route path="/task/:id" element={<Task />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/edit-task/:id" element={<EditTask />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
