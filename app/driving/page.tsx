'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  AlertCircle,
  Camera,
  Eye,
  Clock,
  ArrowLeft,
  Play,
  Square,
} from 'lucide-react';

export default function Page() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertLevel, setAlertLevel] = useState('Normal');
  const [eyesClosedCount, setEyesClosedCount] = useState(0);
  const [drivingTime, setDrivingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const downTimer = useRef<NodeJS.Timeout | null>(null);

  const connectWebRTC = async (mediaStream: MediaStream) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    try {
      // Log the tracks we're adding
      console.log('Adding tracks from stream:', mediaStream.getTracks());
      mediaStream.getTracks().forEach((track) => {
        if (peerConnection.current) {
          console.log('Adding track:', track.kind);
          peerConnection.current.addTrack(track, mediaStream);
        }
      });
    } catch (error) {
      console.error('Error adding tracks:', error);
    }

    // Add track event listener to verify tracks are being added
    peerConnection.current.ontrack = (event) => {
      console.log('Track received:', event.track.kind);
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && ws?.current) {
        ws.current.send(
          JSON.stringify({ type: 'candidate', candidate: event.candidate }),
        );
      }
    };
  };

  const startSession = async () => {
    if (!peerConnection.current) return;
    try {
      const offer = await peerConnection.current.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: false,
      });
      await peerConnection.current.setLocalDescription(offer);
      ws.current?.send(
        JSON.stringify({
          type: 'offer',
          offer: {
            sdp: offer.sdp,
            type: offer.type,
          },
        }),
      );
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const connectWebSocket = (mediaStream: MediaStream) => {
    ws.current = new WebSocket('ws://localhost:8000/api/ws');
    ws.current.onopen = async () => {
      console.log('Connected to WebSocket');
      await connectWebRTC(mediaStream);
      await startSession();
    };
    ws.current.onclose = () => console.log('Disconnected from WebSocket');
    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'answer' && peerConnection.current) {
        try {
          console.log('Received answer:', data.answer);
          const remoteDesc = new RTCSessionDescription({
            type: data.answer.type,
            sdp: data.answer.sdp,
          });
          await peerConnection.current.setRemoteDescription(remoteDesc);
          console.log('Remote description set successfully');
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      } else if (data.type === 'candidate' && peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(data.candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      } else if (data.direction) {
        console.log(
          'Gaze direction:',
          data.direction,
          'Detected:',
          data.detected,
        );
        if (data.detected) {
          switch (data.direction) {
            case 'forward':
              if (downTimer.current) {
                clearInterval(downTimer.current);
                downTimer.current = null;
              }
              break;
            case 'left':
              if (downTimer.current) {
                clearInterval(downTimer.current);
                downTimer.current = null;
              }
              break;
            case 'right':
              if (downTimer.current) {
                clearInterval(downTimer.current);
                downTimer.current = null;
              }
              break;
            case 'down':
              if (!downTimer.current) {
                downTimer.current = setInterval(() => {
                  alert('Heads up! You have been looking down for 5 seconds.');
                  const audio = new Audio('/alert.wav');
                  audio.play();
                }, 3000);
              }
              break;
          }
        } else {
          if (downTimer.current) {
            clearInterval(downTimer.current);
            downTimer.current = null;
          }
        }
      }
    };
  };

  const disconnectWebSocket = () => {
    ws.current?.close();
    ws.current = null;
  };

  const toggleMonitoring = async () => {
    if (isMonitoring) {
      stopCamera();
      disconnectWebSocket();
    } else {
      const mediaStream = await startCamera();
      if (mediaStream) {
        connectWebSocket(mediaStream);
      } else {
        console.error('Failed to start camera');
      }
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
        return userMediaStream;
      } catch (error) {
        console.error('Error accessing camera:', error);
        return null;
      }
    }
    return null;
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
        setDrivingTime((prevTime) => prevTime + 1);
        if (Math.random() < 0.1) {
          setAlertLevel('Warning');
          setEyesClosedCount((prev) => prev + 1);
        } else {
          setAlertLevel('Normal');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          <h1 className="text-2xl font-bold">Driving Monitor</h1>
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
                  className={`mr-2 h-3 w-3 rounded-full ${alertLevel === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                <span className="font-semibold">{alertLevel}</span>
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
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <h2 className="mb-2 flex items-center text-xl font-semibold">
                <Eye className="mr-2" /> Alertness
              </h2>
              <p className="text-3xl font-bold">{100 - eyesClosedCount}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Eyes closed: {eyesClosedCount} times
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <h2 className="mb-2 flex items-center text-xl font-semibold">
                <Clock className="mr-2" /> Driving Time
              </h2>
              <p className="text-3xl font-bold">{formatTime(drivingTime)}</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <h2 className="mb-2 flex items-center text-xl font-semibold">
                <AlertCircle className="mr-2" /> Tips
              </h2>
              <ul className="list-inside list-disc text-sm">
                <li>Take a break every 2 hours</li>
                <li>Stay hydrated</li>
                <li>Adjust your posture regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
