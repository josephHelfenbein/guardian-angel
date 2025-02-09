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

# mp_face_mesh = mp.solutions.face_mesh

# cap = cv2.VideoCapture(0)  # chose camera index (try 1, 2, 3)
# with mp_face_mesh.FaceMesh(
#         max_num_faces=1,
#         refine_landmarks=True,
#         min_detection_confidence=0.5,
#         min_tracking_confidence=0.5) as face_mesh:
#     while cap.isOpened():
#         success, image = cap.read()
#         if not success:
#             print("Ignoring empty camera frame.")
#             continue
#
#         # To improve performance, optionally mark the image as not writeable to
#         # pass by reference.
#         image.flags.writeable = False
#         image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # frame to RGB for the face-mesh model
#         results = face_mesh.process(image)
#         image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # frame back to BGR for OpenCV
#         if results.multi_face_landmarks:
#             gaze.gaze(image, results.multi_face_landmarks[0])  # gaze estimation
#
#         cv2.imshow('output window', image)
#         if cv2.waitKey(2) & 0xFF == 27:
#             break

# cap.release()

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
                            
                            # Display the processed frame
                            cv2.imshow('output window', image)
                            if cv2.waitKey(2) & 0xFF == 27:
                                break
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
                print("OFFER")
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
                print("Sending answer:", response)
                await websocket.send_text(json.dumps(response))
            
            # If the client sends an ICE candidate...
            elif data.get("type") == "candidate":
                print("ICE CANDIDATE")
                candidate_info = data["candidate"]
                candidate = RTCIceCandidate(
                    sdpMid=candidate_info["sdpMid"],
                    sdpMLineIndex=candidate_info["sdpMLineIndex"],
                    component=1,  # RTP component ID (1 for RTP, 2 for RTCP)
                    foundation="0",  # Foundation identifier
                    ip="0.0.0.0",  # Will be parsed from candidate string
                    port=0,  # Will be parsed from candidate string
                    priority=0,  # Will be parsed from candidate string
                    protocol="udp",  # Default protocol
                    type="host"  # Default type for local candidates
                )
                await pc.addIceCandidate(candidate)
    except WebSocketDisconnect:
        # On disconnect, close the RTCPeerConnection
        await pc.close()

# @app.websocket("/api/ws/")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#
#     with mp.solutions.face_mesh.FaceMesh(
#         max_num_faces=1,
#         refine_landmarks=True,
#         min_detection_confidence=0.5,
#         min_tracking_confidence=0.5,
#     ) as face_mesh:
#         while True:
#             data = await websocket.receive_text()
#             image_data = base64.b64decode(data.split(",")[1])
#             buff_arr = np.frombuffer(image_data, np.uint8)
#             image = cv2.imdecode(buff_arr, cv2.IMREAD_COLOR)
#
            # image.flags.writeable = False
            # image = cv2.cvtColor(
            #     image, cv2.COLOR_BGR2RGB
            # )  # frame to RGB for the face-mesh model
            # results = face_mesh.process(image)
            # image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # frame back to BGR for OpenCV
            # if results.multi_face_landmarks:
            #     gaze.gaze(image, results.multi_face_landmarks[0])  # gaze estimation
            #
            # if cv2.waitKey(2) & 0xFF == 27:
            #     break
            #
            # cv2.imshow('output window', image)
            #
            # await websocket.send_json({"direction": "right", "detected": True})
