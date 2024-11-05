import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const tagColors: Record<string, { bg: string; text: string; border: string }> =
  {
    javascript: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-500",
      border: "border-yellow-500/20",
    },
    python: {
      bg: "bg-blue-400/10",
      text: "text-blue-400",
      border: "border-blue-400/20",
    },
    go: {
      bg: "bg-cyan-400/10",
      text: "text-cyan-400",
      border: "border-cyan-400/20",
    },
    algorithms: {
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      border: "border-purple-500/20",
    },
    "data-structures": {
      bg: "bg-green-500/10",
      text: "text-green-500",
      border: "border-green-500/20",
    },
    math: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
    },
    strings: {
      bg: "bg-pink-500/10",
      text: "text-pink-500",
      border: "border-pink-500/20",
    },
    arrays: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-500",
      border: "border-indigo-500/20",
    },
  };

const getTagColor = (tag: string) => {
  return (
    tagColors[tag] || {
      bg: "bg-zinc-500/10",
      text: "text-zinc-400",
      border: "border-zinc-500/20",
    }
  );
};

import MarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { group } from "console";

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
      <h1 className="text-2xl font-bold mb-4 text-green-400">
        {data.task.title}
      </h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-500">Objective</h2>
        <p className="text-zinc-300">{data.task.objective}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-500">Content</h2>
        <div className="bg-black/20 rounded-md">
          <MarkDown
            className="text-zinc-300 prose prose-invert prose-pre:bg-zinc-800 prose-pre:text-zinc-300 prose-code:text-zinc-300 prose-code:block prose-code:font-mono prose-code:bg-black/20 prose-code:rounded prose-code:p-4 prose-strong:text-zinc-200 prose-headings:text-zinc-200 max-w-none"
            remarkPlugins={[remarkGfm]}
          >
            {data.task.content}
          </MarkDown>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-500">Tags</h2>
        <div className="flex gap-2">
          {data.task.tags.map((tag, index) => {
            const { bg, text, border } = getTagColor(tag);
            return (
              <span
                key={index}
                className={`${bg} ${text} ${border} px-2 py-1 rounded-md `}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800">Test Cases</h2>
        <div className="space-y-2">
          {testCases.map((test: TestCase, index: number) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gradient-to-r from-zinc-800/80 via-zinc-800 to-zinc-800/80 border border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-zinc-300 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <p className="font-semibold text-emerald-400">Input:</p>
                </div>
                <div className="bg-black/20 rounded-md p-3 min-h-12">
                  {test.input.slice(0, 3).map((line, i) => {
                    if (line.trim() === "") {
                      return;
                    }
                    return (
                      <code key={i} className="block font-mono text-zinc-300">
                        {line}
                      </code>
                    );
                  })}
                </div>
              </div>
              <div className="text-zinc-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <p className="font-semibold text-purple-400">
                    Expected Output:
                  </p>
                </div>
                <div className="bg-black/20 rounded-md p-3">
                  <code className="block font-mono text-zinc-300">
                    {test.expected}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        className="w-full text-base text-center p-8 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-lg border border-emerald-900/30 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
        onClick={async () => {
          await navigator.clipboard.writeText(`devlife submit ${data.task.id}`);
          toast("Copied to clipboard ", {
            type: "success",
            duration: 1000,
          });
        }}
      >
        <code className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-lg">
          <span className="text-emerald-600 group-hover:text-emerald-500 transition-colors">
            $
          </span>
          <span className="group-hover:text-emerald-300 transition-colors">
            devlife submit
          </span>
          <strong className="text-emerald-300 group-hover:text-emerald-200 transition-colors">
            {data.task.id}
          </strong>
          <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
            {"<your_solution>.{py,js,go}"}
          </span>
        </code>
      </Button>
      <Toaster />
    </div>
  );
};
