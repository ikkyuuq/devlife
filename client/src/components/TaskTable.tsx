<<<<<<< HEAD
=======
import { Task } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <table className="min-w-full shadow-sm rounded-lg overflow-hidden">
      <thead className="bg-zinc-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Tags
          </th>
        </tr>
      </thead>
      <tbody className="bg-zinc-600 divide-y divide-zinc-200">
        {tasks.map((task) => (
          <tr
            key={task.id}
            className="cursor-pointer hover:bg-zinc-500 transition-colors"
            onClick={() => (window.location.href = `/task/${task.id}`)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  task.status.toLowerCase().replace(" ", "") === "passed"
                    ? "bg-green-400 text-green-100"
                    : task.status.toLowerCase().replace(" ", "") === "failed"
                    ? "bg-red-400 text-red-100"
                    : "bg-gray-400 text-gray-100"
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300 border-none">
              {task.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full border text-zinc-50 mr-2"
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
>>>>>>> Snippet
<<<<<<< HEAD
=======
import { Task } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <table className="min-w-full shadow-sm rounded-lg overflow-hidden">
      <thead className="bg-zinc-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Tags
          </th>
        </tr>
      </thead>
      <tbody className="bg-zinc-600 divide-y divide-zinc-200">
        {tasks.map((task) => (
          <tr
            key={task.id}
            className="cursor-pointer hover:bg-zinc-500 transition-colors"
            onClick={() => (window.location.href = `/task/${task.id}`)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  task.status.toLowerCase().replace(" ", "") === "passed"
                    ? "bg-green-400 text-green-100"
                    : task.status.toLowerCase().replace(" ", "") === "failed"
                    ? "bg-red-400 text-red-100"
                    : "bg-gray-400 text-gray-100"
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300 border-none">
              {task.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full border text-zinc-50 mr-2"
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
>>>>>>> Snippet
<<<<<<< HEAD
=======
import { Task } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <table className="min-w-full shadow-sm rounded-lg overflow-hidden">
      <thead className="bg-zinc-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
            Tags
          </th>
        </tr>
      </thead>
      <tbody className="bg-zinc-600 divide-y divide-zinc-200">
        {tasks.map((task) => (
          <tr
            key={task.id}
            className="cursor-pointer hover:bg-zinc-500 transition-colors"
            onClick={() => (window.location.href = `/task/${task.id}`)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  task.status.toLowerCase().replace(" ", "") === "passed"
                    ? "bg-green-400 text-green-100"
                    : task.status.toLowerCase().replace(" ", "") === "failed"
                    ? "bg-red-400 text-red-100"
                    : "bg-gray-400 text-gray-100"
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300 border-none">
              {task.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full border text-zinc-50 mr-2"
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
>>>>>>> Snippet

