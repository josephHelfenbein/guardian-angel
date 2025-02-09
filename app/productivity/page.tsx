'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  AlertCircle,
  Camera,
  Clock,
  ArrowLeft,
  Play,
  Square,
  CheckSquare,
  PlusCircle,
} from 'lucide-react';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Page() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [focusScore, setFocusScore] = useState(100);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const connectWebRTC = async () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });
    }

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && ws?.current) {
        ws.current.send(
          JSON.stringify({ type: 'candidate', candidate: event.candidate }),
        );
      }
    };
  };

  const connectWebSocket = () => {
    ws.current = new WebSocket('ws://localhost:8000/ws');
    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      connectWebRTC();
    };
    ws.current.onclose = () => console.log('Disconnected from WebSocket');
    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'offer') {
        await peerConnection.current?.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        const answer = await peerConnection.current?.createAnswer();
        if (answer) {
          await peerConnection?.current?.setLocalDescription(answer);
          ws.current?.send(JSON.stringify({ type: 'answer', answer }));
        }
      } else if (data.type === 'candidate') {
        await peerConnection.current?.addIceCandidate(
          new RTCIceCandidate(data.candidate),
        );
      }
    };
  };

  const disconnectWebSocket = () => {
    ws.current?.close();
    ws.current = null;
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      stopCamera();
      disconnectWebSocket();
    } else {
      startCamera();
      connectWebSocket();
    }
    setIsMonitoring(!isMonitoring);
  };

  const startCamera = async () => {
    if (videoRef.current) {
      try {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = userMediaStream;
        setStream(userMediaStream);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            setIsBreak(!isBreak);
            return isBreak ? 25 * 60 : 5 * 60;
          }
          return prevTime - 1;
        });

        setFocusScore((prevScore) => {
          const change = Math.floor(Math.random() * 5) - 2;
          return Math.max(0, Math.min(100, prevScore + change));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask.trim(), completed: false },
      ]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <ArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold">Productivity Monitor</h1>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 md:col-span-2">
            <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`mr-2 h-3 w-3 rounded-full ${focusScore > 70 ? 'bg-green-500' : focusScore > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                ></div>
                <span className="font-semibold">
                  Focus Score: {focusScore}%
                </span>
              </div>
              <button
                onClick={toggleMonitoring}
                className={`rounded-full px-4 py-2 font-semibold ${
                  isMonitoring
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isMonitoring ? (
                  <Square className="mr-2 inline" />
                ) : (
                  <Play className="mr-2 inline" />
                )}
                {isMonitoring ? 'Stop Session' : 'Start Session'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <h2 className="mb-2 flex items-center text-xl font-semibold">
                <Clock className="mr-2" /> Pomodoro Timer
              </h2>
              <p className="text-3xl font-bold">{formatTime(timeLeft)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isBreak ? 'Break Time' : 'Work Time'}
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <h2 className="mb-2 flex items-center text-xl font-semibold">
                <CheckSquare className="mr-2" /> Tasks
              </h2>
              <div className="mb-2 flex">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-grow rounded-l-md border p-2 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Add a new task"
                />
                <button
                  onClick={addTask}
                  className="rounded-r-md bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                  <PlusCircle size={24} />
                </button>
              </div>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mr-2"
                    />
                    <span
                      className={
                        task.completed ? 'text-gray-500 line-through' : ''
                      }
                    >
                      {task.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <h2 className="mb-2 flex items-center text-xl font-semibold">
                <AlertCircle className="mr-2" /> Tips
              </h2>
              <ul className="list-inside list-disc text-sm">
                <li>Take regular short breaks</li>
                <li>Stay hydrated</li>
                <li>Adjust your posture</li>
                <li>Use the Pomodoro technique</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
