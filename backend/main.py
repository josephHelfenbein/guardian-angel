import base64
import json
from threading import local
import cv2
import gaze
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCIceCandidate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    pc = RTCPeerConnection() 

    # When a media track (audio/video) is received, this callback is invoked.
    @pc.on("track")
    async def on_track(track):
        print(f"Received track of kind: {track.kind}")
        try:
            with mp.solutions.face_mesh.FaceMesh(
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5,
            ) as face_mesh:
                while True:
                    try:
                        frame = await track.recv()
                        if hasattr(frame, 'to_ndarray'):
                            # Convert VideoFrame to numpy array
                            image = frame.to_ndarray(format="bgr24")
                            
                            # Process image through face mesh
                            image.flags.writeable = False
                            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # frame to RGB for the face-mesh model
                            results = face_mesh.process(image)
                            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # frame back to BGR for OpenCV
                            
                            # Perform gaze detection if face landmarks are found
                            if results.multi_face_landmarks:
                                direction = gaze.gaze(image, results.multi_face_landmarks[0])  # get gaze direction
                                # Send gaze detection results back to client
                                await websocket.send_json({
                                    "direction": direction,
                                    "detected": True
                                })
                            else:
                                await websocket.send_json({
                                    "direction": "unknown",
                                    "detected": False
                                })
                            
                    except Exception as e:
                        print(f"Error processing frame: {e}")
                        break
        except Exception as e:
            print(f"Error in track handling: {e}")
        finally:
            cv2.destroyAllWindows()

    try:
        while True:
            # Wait for a message from the client
            message = await websocket.receive_text()
            # interact(local=locals())
            data = json.loads(message)
            
            # If the client sends an offer...
            if data.get("type") == "offer":
                offer = data["offer"]
                # Set the remote description using the offer received
                await pc.setRemoteDescription(RTCSessionDescription(sdp=offer["sdp"], type=offer["type"]))
                # Create an answer
                answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                # Send back the answer to the client in a similar structure
                response = {
                    "type": "answer",
                    "answer": {
                        "sdp": pc.localDescription.sdp,
                        "type": pc.localDescription.type
                    }
                }
                await websocket.send_text(json.dumps(response))
            
            # If the client sends an ICE candidate...
            elif data.get("type") == "candidate":
                candidate_info = data["candidate"]
                candidate = RTCIceCandidate(
                    sdpMid=candidate_info["sdpMid"],
                    sdpMLineIndex=candidate_info["sdpMLineIndex"],
                    component=1,
                    foundation="0",
                    ip="0.0.0.0",
                    port=0,
                    priority=0,
                    protocol="udp",
                    type="host"
                )
                await pc.addIceCandidate(candidate)
    except WebSocketDisconnect:
        await pc.close()
