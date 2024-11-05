import { Card, CardContent } from "./components/ui/card";
import {
  Label,
  Pie,
  PieChart,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  official: {
    label: "Official",
    color: "hsl(var(--official))",
  },
  community: {
    label: "Community",
    color: "hsl(var(--community))",
  },
} satisfies ChartConfig;

interface ITaskChartProps {
  data: { status: string; tasks: number; fill: string }[];
}

interface ITechChartProps {
  data: { tech: string; available: number }[];
}

export function TaskChart({ data }: ITaskChartProps) {
  return (
    <Card className="flex flex-col border-none bg-transparent w-full">
      <CardContent className="flex flex-col items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-square max-w-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="tasks"
                nameKey="status"
                innerRadius="60%"
                outerRadius="80%"
                strokeWidth={3}
                label={true}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-muted-foreground text-2xl font-bold"
                          >
                            {data.reduce((sum, item) => sum + item.tasks, 0)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Total Tasks
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((task) => (
            <div key={task.status} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: task.fill }}
              />
              <div className="text-zinc-50 text-xs font-medium">
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Input } from "./components/ui/input";
import { MultiSelect } from "./components/ui/multi-select";
import { useEffect, useState } from "react";

const chartTechData = [
  { tech: "Python", available: 2 },
  { tech: "JavaScript", available: 0 },
  { tech: "Golang", available: 0 },
  { tech: "C++", available: 0 },
];

const chartTechConfig = {
  available: {
    label: "Available",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TechChart({ data }: ITechChartProps) {
  return (
    <Card className="w-full h-full border-none bg-transparent">
      <CardContent className="pb-0">
        <ChartContainer
          config={chartTechConfig}
          className="mx-auto aspect-square max-w-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis
                dataKey="tech"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarGrid stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis domain={[0, 2 / 2]} tick={false} />
              <Radar
                dataKey="available"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.6}
                stroke="hsl(var(--chart-1))"
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex justify-center mt-4">
          <div className="flex flex-wrap justify-center gap-4 text-zinc-50 text-xs font-medium">
            {data.map((e) => (
              <span key={e.tech} className="flex items-center gap-2 ">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(var(--chart-1))` }}
                ></span>
                {e.tech}: {e.available}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Task {
  id: string;
  title: string;
  status: string;
  tags: string[];
  author: string;
}

export const Explore = () => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchContext, setSearchContext] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFileteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const userResp = await fetch("http://localhost:3000/user", {
        credentials: "include",
      });
      const userData = await userResp.json();
      if (!userData.user.id) {
        return;
      }
      const tasksResp = await fetch(
        `http://localhost:3000/task/status/${userData.user.id}`,
      );
      const tasksData = await tasksResp.json();
      setTasks(tasksData.tasksWithStatus);
    };

    fetchTasks();
  }, []);

  const statusOptions = [
    { value: "done", label: "Done" },
    { value: "failed", label: "Failed" },
    { value: "notdone", label: "Not Done" },
  ];

  const tagOptions = [
    { value: "Python", label: "Python" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Golang", label: "Golang" },
    { value: "C++", label: "C++" },
    { value: "Official", label: "Official" },
    { value: "Community", label: "Community" },
    { value: "Node.js", label: "Node.js" },
    { value: "Express", label: "Express" },
    { value: "React", label: "React" },
    { value: "Frontend", label: "Frontend" },
    { value: "SQL", label: "SQL" },
  ];

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => {
      const statusMatch =
        selectedStatus.length === 0 ||
        selectedStatus.includes(task.status.toLowerCase().replace(" ", ""));
      const tagMatch =
        selectedTags.length === 0 ||
        task.tags.some((tag) => {
          selectedTags.includes(tag.toLowerCase().replace(" ", ""));
        });
      const titleMatch = task.title
        .toLowerCase()
        .includes(searchContext.toLowerCase());

      return statusMatch && tagMatch && titleMatch;
    });

    setFileteredTasks(filteredTasks);
  }, [selectedStatus, selectedTags, searchContext, tasks]);

  const calcTaskCounts = (tasks: Task[]) => {
    const counts = tasks.reduce(
      (acc, task) => {
        const authorType = task.author === "devlife" ? "official" : "community";
        acc[authorType] = (acc[authorType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return [
      {
        status: "official",
        tasks: counts.official || 0,
        fill: "hsl(var(--official))",
      },
      {
        status: "community",
        tasks: counts.community || 0,
        fill: "hsl(var(--community))",
      },
    ];
  };

  const calcTechCounts = (tasks: Task[]) => {
    const counts = tasks.reduce(
      (acc, task) => {
        const techTags = task.tags.filter((tag) => {
          const normalizedTag = tag.toLowerCase();
          return (
            normalizedTag === "python" ||
            normalizedTag === "javascript" ||
            normalizedTag === "golang" ||
            normalizedTag === "c++"
          );
        });

        techTags.forEach((tag) => {
          acc[tag.toLowerCase()] = (acc[tag.toLowerCase()] || 0) + 1;
        });

        return acc;
      },
      {} as Record<string, number>,
    );

    return [
      { tech: "Python", available: counts["python"] || 0 },
      { tech: "JavaScript", available: counts["javascript"] || 0 },
      { tech: "Golang", available: counts["golang"] || 0 },
      { tech: "C++", available: counts["c++"] || 0 },
    ];
  };

  return (
    <div className="min-h-screen h-full">
      <section className="mt-28 w-full max-w-7xl mx-auto lg:px-6 px-8">
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <TaskChart data={calcTaskCounts(tasks)} />
          <TechChart data={calcTechCounts(tasks)} />
        </div>
      </section>
      <section className="mt-12">
        <div className="w-full max-w-7xl mx-auto lg:px-4 px-8">
          <div className="overflow-x-auto space-y-4">
            <div className="flex gap-4">
              <MultiSelect
                options={statusOptions}
                onValueChange={setSelectedStatus}
                defaultValue={selectedStatus}
                placeholder="Status"
                variant="inverted"
                animation={2}
                maxCount={1}
              />
              <MultiSelect
                options={tagOptions}
                onValueChange={setSelectedTags}
                defaultValue={selectedTags}
                placeholder="Tag"
                variant="inverted"
                animation={2}
                maxCount={1}
              />
              <Input
                placeholder="Search title"
                onChange={(e) => setSearchContext(e.target.value)}
              />
            </div>
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
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="cursor-pointer hover:bg-zinc-500 transition-colors"
                    onClick={() => (window.location.href = `/task/${task.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300 border-none">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
