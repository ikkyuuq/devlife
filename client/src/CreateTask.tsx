import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";

import { Button } from "./components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import MarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "./lib/utils";

interface TestCase {
  input: string[];
  expected: string;
}

const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  objective: z
    .string()
    .min(10, "Objective must be at least 10 characters")
    .max(1000, "Objective must be less than 1000 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(10000, "Content must be less than 10000 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  tests: z
    .array(z.object({ input: z.array(z.string()), expected: z.string() }))
    .min(1, "At least one test case is required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

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
    algorithm: {
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
    string: {
      bg: "bg-pink-500/10",
      text: "text-pink-500",
      border: "border-pink-500/20",
    },
    array: {
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

const tagOptions = [
  { value: "algorithm", label: "Algorithm" },
  { value: "data-structures", label: "Data Structures" },
  { value: "math", label: "Math" },
  { value: "string", label: "String" },
  { value: "array", label: "Array" },
  { value: "python", label: "Python" },
];

export const CreateTask = () => {
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      objective: "",
      content: "",
      tags: [],
      tests: [],
    },
  });

  const title = watch("title");
  const content = watch("content");
  const objective = watch("objective");
  const tags = watch("tags");
  const tests = watch("tests");

  const handleJsonFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setUploadStatus("error");
      setUploadedFileName("");
      alert("File size must be less than 1MB");
      return;
    }

    if (!file.type && !file.name.endsWith(".json")) {
      setUploadStatus("error");
      setUploadedFileName("");
      alert("Only JSON files are allowed");
      return;
    }

    setUploadedFileName(file.name);
    setUploadStatus("uploading");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        if (!Array.isArray(jsonData)) {
          throw new Error("JSON must contain an array of test cases");
        }

        if (jsonData.length === 0) {
          throw new Error("Test cases array cannot be empty");
        }

        const formattedTests = jsonData.map((test) => ({
          input: test.input,
          expected: test.expected,
        }));
        setValue("tests", formattedTests);
        trigger("tests");
        setUploadStatus("success");
      } catch (error) {
        console.error("Error processing JSON file:", error);
        setUploadStatus("error");
        setUploadedFileName("");
        alert(error instanceof Error ? error.message : "Invalid JSON format");
      }
    };

    reader.onerror = () => {
      setUploadStatus("error");
      setUploadedFileName("");
      alert("Error reading file");
    };

    reader.readAsText(file);
  };

  const onSubmit = async (data: TaskFormValues) => {
    const id = data.title.toLowerCase().replace(/\s+/g, "");
    const user = await fetch("http://localhost:3000/user", {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: "devlife_session",
      },
    });
    const userData = await user.json();

    const author = userData.user.id;

    const taskData = {
      task: {
        id,
        title: data.title,
        objective: data.objective,
        tags: data.tags,
        content: data.content,
        author,
        tests: JSON.stringify({
          data: data.tests.map((test) => ({
            input: test.input,
            expected: test.expected,
          })),
        }),
      },
    };

    try {
      console.log("Submitting task:", taskData);
      const response = await fetch("http://localhost:3000/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        navigate("/explore");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };
  return (
    <div className="my-28 lg:px-6 px-8 w-full max-w-7xl mx-auto">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex justify-end">
            <Button>⚙ Editor</Button>
          </div>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="bg-zinc-900 border-none text-zinc-100 overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-zinc-50 text-xl font-bold">
              Devlife Task Editor
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-zinc-200"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className={cn(
                  "flex h-10 w-full rounded-md border bg-zinc-900 px-3 py-2 text-sm ring-offset-zinc-900 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-colors",
                  errors.title ? "border-red-500" : "border-zinc-700",
                )}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="objective"
                className="text-sm font-medium text-zinc-200"
              >
                Objective
              </label>
              <input
                type="text"
                id="objective"
                className={cn(
                  "flex h-10 w-full rounded-md border bg-zinc-900 px-3 py-2 text-sm ring-offset-zinc-900 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-colors",
                  errors.objective ? "border-red-500" : "border-zinc-700",
                )}
                {...register("objective")}
              />
              {errors.objective && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.objective.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="text-sm font-medium text-zinc-200"
              >
                Tags
              </label>
              <div className="relative">
                <div
                  className={`flex h-10 w-full rounded-md border ${
                    errors.tags ? "border-red-500" : "border-zinc-700"
                  } bg-zinc-900 px-3 py-2 text-sm ring-offset-zinc-900 text-zinc-100 cursor-pointer`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={`${getTagColor(tag).bg} ${getTagColor(tag).text} px-2 py-0.5 rounded-md text-xs`}
                        >
                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-500">Select tags...</span>
                  )}
                </div>
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
                    {tagOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${
                          tags.includes(option.value)
                            ? "font-semibold bg-zinc-700"
                            : ""
                        }`}
                        onClick={() => {
                          const newTags = tags.includes(option.value)
                            ? tags.filter((t) => t !== option.value)
                            : [...tags, option.value];
                          setValue("tags", newTags);
                          trigger("tags");
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tags.message}
                </p>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="text-sm font-medium text-zinc-200"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  className={cn(
                    "flex min-h-[120px] w-full rounded-md border bg-zinc-900 px-3 py-2 text-sm ring-offset-zinc-900 text-zinc-100 focus:border-zinc-500 focus:outline-none transition-colors",
                    errors.content ? "border-red-500" : "border-zinc-700",
                  )}
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label>Test Cases</label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleJsonFileUpload}
                        className="hidden"
                        id="json-upload"
                        required
                      />
                      <label
                        htmlFor="json-upload"
                        className={`cursor-pointer px-4 py-2 text-sm border rounded-md ${
                          uploadStatus === "success"
                            ? "border-green-500 text-green-500"
                            : uploadStatus === "error"
                              ? "border-red-500 text-red-500"
                              : "border-zinc-700 text-zinc-100"
                        } hover:bg-zinc-800 transition-colors flex items-center gap-2`}
                      >
                        {uploadStatus === "uploading"
                          ? "Uploading..."
                          : "Upload JSON"}
                        {uploadedFileName && uploadStatus === "success" && (
                          <span className="text-xs opacity-75">
                            ({uploadedFileName})
                          </span>
                        )}
                      </label>
                      {uploadStatus === "error" && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.tests?.message || "Failed to parse JSON file"}
                        </p>
                      )}
                      {tests.length > 0 && uploadStatus === "success" && (
                        <p className="text-green-500 text-xs mt-1">
                          {tests.length} test cases loaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-8 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors"
              variant="outline"
              onClick={handleSubmit(onSubmit)}
            >
              Create Task
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-full max-w-7xl mx-auto ">
        <h1 className="text-2xl font-bold mb-4 text-green-400">{title}</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-zinc-500">
            Objective
          </h2>
          <p className="text-zinc-300">{objective}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-zinc-500">Content</h2>
          <div className="bg-black/20 rounded-md">
            <MarkDown
              className="text-zinc-300 prose prose-invert prose-pre:bg-zinc-800 prose-pre:text-zinc-300 prose-code:text-zinc-300 prose-code:block prose-code:font-mono prose-code:bg-black/20 prose-code:rounded prose-code:p-4 prose-strong:text-zinc-200 prose-headings:text-zinc-200 max-w-none"
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </MarkDown>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-zinc-500">Tags</h2>
          <div className="flex gap-2">
            {tags.map((tag, index) => {
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
          <h2 className="text-xl font-semibold mb-2 text-zinc-500">
            Test Cases
          </h2>
          <div className="space-y-2">
            {tests.slice(0, 3).map((test: TestCase, index: number) => (
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
                    <code className="block font-mono text-zinc-300">
                      {test.input.join("\n")}
                    </code>
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
                      {test.expected.toString()}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
