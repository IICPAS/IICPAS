"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Jodit editor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface CaseStudyBuilderProps {
  chapterId: string;
  chapterName: string;
  onBack: () => void;
}

interface Task {
  id: string;
  taskName: string;
  instructions: string;
}

interface Content {
  id: string;
  type: "video" | "text" | "rich";
  videoBase64?: string;
  textContent?: string;
  richTextContent?: string;
}

interface Simulation {
  id: string;
  type: string;
  title: string;
  description: string;
  config: any;
  isOptional: boolean;
}

interface QuestionSet {
  id: string;
  name: string;
  description: string;
  excelBase64?: string;
  questions: any[];
}

export default function CaseStudyBuilder({
  chapterId,
  chapterName,
  onBack,
}: CaseStudyBuilderProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "content" | "simulations" | "questionSets">("tasks");

  // Jodit editor config
  const editorConfig = {
    readonly: false,
    height: 300,
    theme: "default",
    placeholder: "Start writing your content...",
  };

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      taskName: "",
      instructions: "",
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addContent = () => {
    const newContent: Content = {
      id: Date.now().toString(),
      type: "text",
      textContent: "",
    };
    setContent([...content, newContent]);
  };

  const updateContent = (id: string, field: keyof Content, value: any) => {
    setContent(
      content.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeContent = (id: string) => {
    setContent(content.filter((item) => item.id !== id));
  };

  const addSimulation = () => {
    const newSimulation: Simulation = {
      id: Date.now().toString(),
      type: "accounting",
      title: "",
      description: "",
      config: {
        accountTypes: ["Debit", "Credit"],
        accountOptions: ["Cash A/c", "Bank A/c", "Capital A/c"],
        columns: ["Date", "Type", "Particulars", "Debit", "Credit"],
      },
      isOptional: true,
    };
    setSimulations([...simulations, newSimulation]);
  };

  const updateSimulation = (id: string, field: keyof Simulation, value: any) => {
    setSimulations(
      simulations.map((sim) =>
        sim.id === id ? { ...sim, [field]: value } : sim
      )
    );
  };

  const removeSimulation = (id: string) => {
    setSimulations(simulations.filter((sim) => sim.id !== id));
  };

  const addQuestionSet = () => {
    const newQuestionSet: QuestionSet = {
      id: Date.now().toString(),
      name: "",
      description: "",
      questions: [],
    };
    setQuestionSets([...questionSets, newQuestionSet]);
  };

  const updateQuestionSet = (id: string, field: keyof QuestionSet, value: any) => {
    setQuestionSets(
      questionSets.map((qs) =>
        qs.id === id ? { ...qs, [field]: value } : qs
      )
    );
  };

  const removeQuestionSet = (id: string) => {
    setQuestionSets(questionSets.filter((qs) => qs.id !== id));
  };

  const handleSave = async () => {
    // TODO: Implement save to backend
    console.log("Saving case study:", {
      title,
      description,
      chapterId,
      tasks,
      content,
      simulations,
      questionSets,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Case Study for '{chapterName}'
          </h2>
          <p className="text-gray-600">Build your case study with tasks, content, simulations, and questions</p>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Topics
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Study Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter case study title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Enter case study description"
            />
          </div>
        </div>
      </div>

      {/* Component Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tasks"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "content"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Content ({content.length})
            </button>
            <button
              onClick={() => setActiveTab("simulations")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "simulations"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Simulations ({simulations.length})
            </button>
            <button
              onClick={() => setActiveTab("questionSets")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "questionSets"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Question Sets ({questionSets.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Task Instructions (Pink Banners)</h4>
                <button
                  onClick={addTask}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Add Task
                </button>
              </div>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-md font-medium text-gray-800">Task {index + 1}</h5>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task Name *
                        </label>
                        <input
                          type="text"
                          value={task.taskName}
                          onChange={(e) => updateTask(task.id, "taskName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., Pass journal entries"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instructions *
                        </label>
                        <textarea
                          value={task.instructions}
                          onChange={(e) => updateTask(task.id, "instructions", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={3}
                          placeholder="Enter task instructions"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No tasks added yet. Click "Add Task" to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Learning Content</h4>
                <button
                  onClick={addContent}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Add Content
                </button>
              </div>
              <div className="space-y-4">
                {content.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-md font-medium text-gray-800">Content {index + 1}</h5>
                      <button
                        onClick={() => removeContent(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content Type
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) => updateContent(item.id, "type", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="text">Text</option>
                          <option value="rich">Rich Text</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      
                      {item.type === "text" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text Content
                          </label>
                          <textarea
                            value={item.textContent || ""}
                            onChange={(e) => updateContent(item.id, "textContent", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={6}
                            placeholder="Enter your text content..."
                          />
                        </div>
                      )}

                      {item.type === "rich" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rich Text Content
                          </label>
                          <JoditEditor
                            value={item.richTextContent || ""}
                            config={editorConfig}
                            onBlur={(newContent) => updateContent(item.id, "richTextContent", newContent)}
                          />
                        </div>
                      )}

                      {item.type === "video" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video Upload
                          </label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const base64 = reader.result as string;
                                  updateContent(item.id, "videoBase64", base64);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {item.videoBase64 && (
                            <div className="mt-2">
                              <video controls className="w-full max-w-md">
                                <source src={item.videoBase64} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {content.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No content added yet. Click "Add Content" to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Simulations Tab */}
          {activeTab === "simulations" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Interactive Simulations (Optional)</h4>
                <button
                  onClick={addSimulation}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Add Simulation
                </button>
              </div>
              <div className="space-y-4">
                {simulations.map((sim, index) => (
                  <div key={sim.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-md font-medium text-gray-800">Simulation {index + 1}</h5>
                      <button
                        onClick={() => removeSimulation(sim.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Simulation Type
                        </label>
                        <select
                          value={sim.type}
                          onChange={(e) => updateSimulation(sim.id, "type", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="accounting">Accounting</option>
                          <option value="financial">Financial</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={sim.title}
                          onChange={(e) => updateSimulation(sim.id, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter simulation title"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={sim.description}
                        onChange={(e) => updateSimulation(sim.id, "description", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Enter simulation description"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sim.isOptional}
                          onChange={(e) => updateSimulation(sim.id, "isOptional", e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Optional (students can skip)</span>
                      </label>
                    </div>
                  </div>
                ))}
                {simulations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No simulations added yet. Click "Add Simulation" to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question Sets Tab */}
          {activeTab === "questionSets" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Assessment Questions (Excel Upload)</h4>
                <button
                  onClick={addQuestionSet}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Add Question Set
                </button>
              </div>
              <div className="space-y-4">
                {questionSets.map((qs, index) => (
                  <div key={qs.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-md font-medium text-gray-800">Question Set {index + 1}</h5>
                      <button
                        onClick={() => removeQuestionSet(qs.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Set Name
                        </label>
                        <input
                          type="text"
                          value={qs.name}
                          onChange={(e) => updateQuestionSet(qs.id, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter question set name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={qs.description}
                          onChange={(e) => updateQuestionSet(qs.id, "description", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter description"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excel File Upload
                      </label>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const base64 = reader.result as string;
                              updateQuestionSet(qs.id, "excelBase64", base64);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                ))}
                {questionSets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No question sets added yet. Click "Add Question Set" to get started.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Case Study
        </button>
      </div>
    </div>
  );
}
