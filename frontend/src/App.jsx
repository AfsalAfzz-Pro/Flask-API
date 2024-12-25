import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Loader2 } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/tasks')
      .then(response => response.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load tasks');
        setLoading(false);
      });
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setIsAdding(true);
      try {
        const response = await fetch('http://127.0.0.1:5000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTask }),
        });
        const data = await response.json();
        setTasks(prev => [...prev, data]);
        setNewTask('');
      } catch (err) {
        setError('Failed to add task');
      } finally {
        setIsAdding(false);
      }
    }
  };

  const toggleTaskCompletion = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed: !task.completed }),
        });
        const data = await response.json();
        setTasks(tasks.map(t => (t.id === id ? data : t)));
      } catch (err) {
        setError('Failed to update task');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Task Manager
        </h1>

        {error && (
          <div className="mb-4 bg-red-50 text-red-900 px-4 py-3 rounded-lg border border-red-200">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={addTask} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            <button
              type="submit"
              disabled={isAdding || !newTask.trim()}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Add Task
            </button>
          </div>
        </form>

        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <span
                  className={`flex-1 text-gray-800 transition-opacity ${
                    task.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            No tasks yet. Add some tasks to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default App;