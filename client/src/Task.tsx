import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkDown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TestCase {
  input: string[];
  expected: string;
}

interface TaskData {
  task: {
    id: string;
    title: string;
    objective: string;
    tags: string[];
    content: string;
    createdAt: string;
    updatedAt: string;
    tests: string;
  };
}

export const Task = () => {
  const { id } = useParams();
  const [data, setData] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setError(null);

    const fetchTask = async () => {
      try {
        setLoading(true);

        const cachedData = localStorage.getItem(`task-${id}`);
        if (cachedData) {
          const { data: taskData, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < 3600000) {
            setData(taskData);
            setLoading(false);
            return;
          }
        }

        const resp = await fetch(`http://localhost:3000/task/${id}`, {
          method: "GET",
        });

        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const taskData = await resp.json();

        localStorage.setItem(
          `task-${id}`,
          JSON.stringify({
            data: taskData,
            timestamp: Date.now(),
          }),
        );
        setData(taskData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]); // Only depend on ID changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No task found</div>;
  }

  const testCases = JSON.parse(data.task.tests).data;

  return (
    <div className="mt-28 w-full max-w-7xl mx-auto lg:px-6 px-8">
      <h1 className="text-2xl font-bold mb-4 text-zinc-100">
        {data.task.title}
      </h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800">Objective</h2>
        <p className="text-zinc-300">{data.task.objective}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800">Content</h2>
        <div className="text-zinc-300 prose prose-invert prose-pre:bg-zinc-800 prose-pre:text-zinc-300 prose-code:text-zinc-300 prose-strong:text-zinc-200 prose-headings:text-zinc-200 max-w-none">
          <MarkDown
            className="text-zinc-300 prose prose-invert prose-pre:bg-zinc-800 prose-pre:text-zinc-300 prose-code:text-zinc-300 prose-strong:text-zinc-200 prose-headings:text-zinc-200 max-w-none"
            remarkPlugins={[remarkGfm]}
          >
            {data.task.content}
          </MarkDown>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800">Tags</h2>
        <div className="flex gap-2">
          {data.task.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-zinc-700 px-2 py-1 rounded text-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800">Test Cases</h2>
        <div className="space-y-2">
          {testCases.map((test: TestCase, index: number) => (
            <div key={index} className="border p-2 rounded bg-zinc-800">
              <div className="text-zinc-300 mb-2">
                <p className="font-semibold mb-1">Input:</p>
                {test.input.map((line, i) => (
                  <code key={i} className="block pl-4 font-mono">
                    {line}
                  </code>
                ))}
              </div>
              <div className="text-zinc-300">
                <p className="font-semibold mb-1">Expected Output:</p>
                <code className="block pl-4 font-mono">{test.expected}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm text-zinc-400">
        <p>Created: {new Date(data.task.createdAt).toLocaleDateString()}</p>
        <p>Updated: {new Date(data.task.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
