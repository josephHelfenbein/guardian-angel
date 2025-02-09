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
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertLevel, setAlertLevel] = useState('Normal');
  const [eyesClosedCount, setEyesClosedCount] = useState(0);
  const [displayTime, setDisplayTime] = useState('00:00');
  const [currentDirection, setCurrentDirection] = useState('Not Detected');
  const drivingTimeRef = useRef<number>(0);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [phoneCheckCount, setPhoneCheckCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const eyesClosedStartTime = useRef<number | null>(null);
  const lookingDownStartTime = useRef<number | null>(null);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize alert audio
  useEffect(() => {
    alertAudioRef.current = new Audio('/alert.wav');
    alertAudioRef.current.load(); // Preload the audio
  }, []);

  const playAlertSound = () => {
    if (alertAudioRef.current) {
      alertAudioRef.current.currentTime = 0; // Reset to start
      alertAudioRef.current.play().catch((error) => {
        console.error('Error playing alert sound:', error);
      });
    }
  };

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

  const handleGazeDirection = (direction: string, detected: boolean) => {
    if (!detected) {
      eyesClosedStartTime.current = null;
      lookingDownStartTime.current = null;
      setCurrentDirection('Not Detected');
      return;
    }

    // Update current direction with a more user-friendly message
    switch (direction) {
      case 'forward':
        setCurrentDirection('Looking Forward');
        eyesClosedStartTime.current = null;
        lookingDownStartTime.current = null;
        setAlertLevel('Normal');
        break;

      case 'closed':
        setCurrentDirection('Eyes Closed');
        const currentTime = Date.now();
        if (!eyesClosedStartTime.current) {
          eyesClosedStartTime.current = currentTime;
        } else if (currentTime - eyesClosedStartTime.current >= 3000) {
          setEyesClosedCount((prev) => prev + 1);
          setAlertLevel('Warning');
          playAlertSound();
          toast.error('⚠️ Wake Up! You appear to be falling asleep! 😴', {
            style: {
              background: '#eab308', // Red background for serious warning
            },
          });
          eyesClosedStartTime.current = null;
        }
        break;

      case 'down':
        setCurrentDirection('Looking Down');
        const downCheckTime = Date.now();
        if (!lookingDownStartTime.current) {
          lookingDownStartTime.current = downCheckTime;
        } else if (downCheckTime - lookingDownStartTime.current >= 2000) {
          setPhoneCheckCount((prev) => prev + 1);
          setAlertLevel('Warning');
          playAlertSound();
          toast('⚠️ Eyes on the Road! Stop checking your phone! 📱', {
            style: {
              background: '#ef4444', // Yellow background for caution
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              padding: '16px',
              borderRadius: '8px',
            },
          });
          lookingDownStartTime.current = null;
        }
        break;
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
        handleGazeDirection(data.direction, data.detected);
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
        console.log('Requesting camera access...');
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
        });
        console.log('Camera access granted, setting up video stream...');
        videoRef.current.srcObject = userMediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing...');
          videoRef.current?.play();
        };
        setStream(userMediaStream);
        return userMediaStream;
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert(
          'Failed to access camera. Please make sure you have granted camera permissions.',
        );
        return null;
      }
    }
    console.error('Video reference not found');
    return null;
  };

  const stopCamera = () => {
    if (stream) {
      console.log('Stopping camera stream...');
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isMonitoring) {
      // Start the timer
      timeIntervalRef.current = setInterval(() => {
        drivingTimeRef.current += 1;
        // Update display every second but not the state
        setDisplayTime(formatTime(drivingTimeRef.current));
      }, 1000);
    } else {
      // Reset timer when monitoring stops
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      drivingTimeRef.current = 0;
      setDisplayTime('00:00');
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      // Clear all timers on cleanup
      eyesClosedStartTime.current = null;
      lookingDownStartTime.current = null;
    };
  }, [isMonitoring]);

  // Add keyboard event handler for testing
  useEffect(() => {
    type KeyStates = {
      f: boolean;
      c: boolean;
      d: boolean;
      n: boolean;
    };

    const keyStates: KeyStates = {
      f: false,
      c: false,
      d: false,
      n: false,
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMonitoring) return;

      const key = event.key.toLowerCase();
      if (key in keyStates && !keyStates[key as keyof KeyStates]) {
        keyStates[key as keyof KeyStates] = true;

        // Only handle forward and not detected immediately
        if (key === 'f') {
          handleGazeDirection('forward', true);
        } else if (key === 'n') {
          handleGazeDirection('forward', false);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key in keyStates) {
        keyStates[key as keyof KeyStates] = false;

        // Reset timers when keys are released
        if (key === 'c') {
          eyesClosedStartTime.current = null;
        } else if (key === 'd') {
          lookingDownStartTime.current = null;
        }
      }
    };

    // Check held keys every 100ms
    const checkHeldKeys = setInterval(() => {
      if (!isMonitoring) return;

      if (keyStates.c) {
        handleGazeDirection('closed', true);
      } else if (keyStates.d) {
        handleGazeDirection('down', true);
      }
    }, 100);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(checkHeldKeys);
    };
  }, [isMonitoring]);

  // Add instructions for testing
  const renderTestingInstructions = () => {
    if (!isMonitoring) return null;

    return (
      <div className="absolute left-4 top-4 rounded-lg bg-black/50 p-4 text-sm text-white">
        <h3 className="mb-2 font-bold">Testing Controls:</h3>
        <ul className="space-y-1">
          <li>
            <kbd className="rounded bg-gray-700 px-2 py-1">F</kbd> - Looking
            Forward
          </li>
          <li>
            <kbd className="rounded bg-gray-700 px-2 py-1">C</kbd> - Hold for
            Eyes Closed
          </li>
          <li>
            <kbd className="rounded bg-gray-700 px-2 py-1">D</kbd> - Hold for
            Looking Down
          </li>
          <li>
            <kbd className="rounded bg-gray-700 px-2 py-1">N</kbd> - Not
            Detected
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="r r mx-auto max-w-7xl rounded-lg px-4">
          <header className="mb-2 flex h-16 items-center">
            <div className="flex w-1/4 items-center">
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                <ArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="w-2/4 text-center">
              <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
                Guardian Angel
              </h1>
            </div>
            <div className="w-1/4"></div>
          </header>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 lg:col-span-3">
              <div className="relative mb-4 flex aspect-[16/9] items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full rounded-lg object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {renderTestingInstructions()}
                <div
                  className={`absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-semibold ${
                    currentDirection === 'Looking Forward'
                      ? 'bg-green-500 text-white'
                      : currentDirection === 'Not Detected'
                        ? 'bg-gray-500 text-white'
                        : currentDirection === 'Looking Down'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                  }`}
                >
                  {currentDirection}
                </div>
              </div>
              <div className="mt-6 flex flex-col space-y-4">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center">
                    <div
                      className={`mr-2 h-4 w-4 rounded-full ${
                        alertLevel === 'Normal' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                    <span className="text-lg font-semibold">{alertLevel}</span>
                  </div>
                  <button
                    onClick={toggleMonitoring}
                    className={`rounded-full px-4 py-2 text-base font-semibold transition-all ${
                      isMonitoring
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isMonitoring ? (
                      <Square className="mr-2 inline h-4 w-4" />
                    ) : (
                      <Play className="mr-2 inline h-4 w-4" />
                    )}
                    {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 px-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Alertness Score
                    </div>
                    <div className="mt-1 flex items-center">
                      <Eye className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-xl font-bold text-green-500">
                        {Math.max(
                          0,
                          100 - (eyesClosedCount * 5 + phoneCheckCount * 10),
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Session Time
                    </div>
                    <div className="mt-1 flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-blue-500" />
                      <span className="text-xl font-semibold">
                        {displayTime}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Eyes Closed Events
                    </div>
                    <div className="mt-1 flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                      <span className="text-xl font-semibold text-red-500">
                        {eyesClosedCount}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Phone Check Events
                    </div>
                    <div className="mt-1 flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                      <span className="text-xl font-semibold text-yellow-500">
                        {phoneCheckCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <AlertCircle className="mr-2" /> Safety Tips
                </h2>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <span className="mr-2 mt-0.5 text-yellow-500">•</span>
                    <p>
                      Keep your eyes on the road - frequent checks reduce
                      reaction time
                    </p>
                  </li>
                  <li className="flex items-start rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <span className="mr-2 mt-0.5 text-yellow-500">•</span>
                    <p>Put your phone on "Do Not Disturb" while driving</p>
                  </li>
                  <li className="flex items-start rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <span className="mr-2 mt-0.5 text-yellow-500">•</span>
                    <p>Take a 15-minute break every 2 hours of driving</p>
                  </li>
                  <li className="flex items-start rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <span className="mr-2 mt-0.5 text-yellow-500">•</span>
                    <p>Maintain proper posture to prevent fatigue</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
