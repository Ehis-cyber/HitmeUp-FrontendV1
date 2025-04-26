'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Task = {
  id: string;
  title: string;
  description: string;
  skills: string;
  payment: string;
  duration: string;
  postedBy: string;
  createdAt: Date;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
