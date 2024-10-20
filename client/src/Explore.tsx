import { Card, CardContent } from "./components/ui/card";
import {
  Label,
  Pie,
  PieChart,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import * as React from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { status: "done", tasks: 275, fill: "hsl(var(--done))" },
  { status: "inProgress", tasks: 200, fill: "hsl(var(--in-progress))" },
  { status: "todo", tasks: 287, fill: "hsl(var(--todo))" },
  { status: "official", tasks: 173, fill: "hsl(var(--official))" },
  { status: "community", tasks: 190, fill: "hsl(var(--community))" },
];

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  done: {
    label: "Done",
    color: "hsl(var(--done))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--in-progress)",
  },
  todo: {
    label: "Todo",
    color: "hsl(var(--todo))",
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

export function TaskChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.tasks, 0);
  }, []);

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
                data={chartData}
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
                            y={viewBox.cy}
                            className="fill-zinc-50 text-2xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Tasks
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
          {chartData.map((data) => (
            <div key={data.status} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: data.fill }}
              />
              <div className="text-zinc-50 text-xs font-medium">
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
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
import { useEffect } from "react";

const chartTechData = [
  { tech: "Python", available: 306 },
  { tech: "JavaScript", available: 225 },
  { tech: "Golang", available: 323 },
  { tech: "C++", available: 271 },
];

const chartTechConfig = {
  available: {
    label: "Available",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TechChart() {
  return (
    <Card className="w-full h-full border-none bg-transparent">
      <CardContent className="pb-0">
        <ChartContainer
          config={chartTechConfig}
          className="mx-auto aspect-square max-w-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartTechData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis
                dataKey="tech"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarGrid stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis domain={[0, 500]} tick={false} />
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
            {chartTechData.map((data) => (
              <span key={data.tech} className="flex items-center gap-2 ">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(var(--chart-1))` }}
                ></span>
                {data.tech}: {data.available}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const Explore = () => {
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [searchContext, setSearchContext] = React.useState<string>("");

  const tasks = [
    {
      status: "Done",
      title: "Hello World Python",
      tags: ["Python", "Programming"],
      level: "Newbie",
    },
    {
      status: "In Progress",
      title: "Build a REST API",
      tags: ["JavaScript", "Node.js", "Express"],
      level: "Intermediate",
    },
    {
      status: "Todo",
      title: "Implement Machine Learning Model",
      tags: ["Python", "TensorFlow", "AI"],
      level: "Advanced",
    },
    {
      status: "Done",
      title: "Create a React Component",
      tags: ["JavaScript", "React", "Frontend"],
      level: "Intermediate",
    },
    {
      status: "In Progress",
      title: "Database Design for E-commerce",
      tags: ["SQL", "Database", "Design"],
      level: "Advanced",
    },
  ];

  const statusOptions = [
    { value: "done", label: "Done" },
    { value: "inProgress", label: "In Progress" },
    { value: "todo", label: "Todo" },
    { value: "official", label: "Official" },
    { value: "community", label: "Community" },
  ];

  const levelOptions = [
    { value: "newbie", label: "Newbie" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advance", label: "Advance" },
  ];

  const tagOptions = [
    { value: "Python", label: "Python" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "Express", label: "Express" },
    { value: "TensorFlow", label: "TensorFlow" },
    { value: "AI", label: "AI" },
    { value: "React", label: "React" },
    { value: "Frontend", label: "Frontend" },
    { value: "SQL", label: "SQL" },
    { value: "Database", label: "Database" },
    { value: "Design", label: "Design" },
  ];

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => {
      const statusMatch =
        selectedStatus.length === 0 ||
        selectedStatus.includes(task.status.toLowerCase().replace(" ", ""));
      const levelMatch =
        selectedLevel.length === 0 ||
        selectedLevel.includes(task.level.toLowerCase());
      const tagMatch =
        selectedTags.length === 0 ||
        task.tags.some((tag) => selectedTags.includes(tag));
      const titleMatch = task.title
        .toLowerCase()
        .includes(searchContext.toLowerCase());

      return statusMatch && levelMatch && tagMatch && titleMatch;
    });

    console.log(filteredTasks);
  }, [selectedStatus, selectedLevel, selectedTags, searchContext, tasks]);

  return (
    <div className="min-h-screen h-full">
      <section className="mt-28 w-full max-w-7xl mx-auto lg:px-6 px-8">
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <TaskChart />
          <TechChart />
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
                options={levelOptions}
                onValueChange={setSelectedLevel}
                defaultValue={selectedLevel}
                placeholder="Level"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-50 uppercase tracking-wider">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-zinc-600 divide-y divide-zinc-200">
                {tasks.map((task) => (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300 border-none">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.tags.map((tag) => (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {task.level}
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
