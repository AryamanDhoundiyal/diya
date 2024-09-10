import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: 'Roboto', sans-serif;
  }

  body {
    background-color: #f0f4f8;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #4b79a1 0%, #283e51 100%);
  position: relative; /* Needed for positioning the Go to Home button */
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Video = styled.video`
  width: 600px;
  height: 400px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const Canvas = styled.canvas`
  display: ${({ hasPhoto }) => (hasPhoto ? 'block' : 'none')};
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 1.1rem;
  color: white;
  background: ${({ danger }) => (danger ? '#e74c3c' : '#3498db')};
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.4);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const HomeButton = styled(Button)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: #1abc9c; /* Color that complements the gradient background */
`;

const Camera = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [recording, setRecording] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false); // New state for camera status
  const mediaRecorder = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    if (cameraStarted) {
      startCamera();
    }

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [cameraStarted]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera and microphone:', error);
      // Handle the error, e.g., show a message to the user
    }
  };

  const toggleRecording = () => {
    if (recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    } else {
      const stream = videoRef.current.srcObject;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = handleDataAvailable;
      mediaRecorder.current.start();
      setRecording(true);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const uploadMedia = async (blob, fileType) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, fileType === 'video' ? 'recorded_video.webm' : 'captured_photo.jpg');
      formData.append('fileType', fileType);

      await axios.post('http://localhost:3000/camera', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleUploadVideo = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      uploadMedia(blob, 'video');
    }
  };

  const handleUploadPhoto = () => {
    if (photoRef.current) {
      photoRef.current.toBlob(async (blob) => {
        if (blob) {
          await uploadMedia(blob, 'photo');
        }
      }, 'image/jpeg');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <HomeButton onClick={() => navigate('/')}>Go to Home</HomeButton>
        <Title>Camera</Title>

        <VideoContainer>
          <Video ref={videoRef} />
        </VideoContainer>

        <ButtonSection>
          <ButtonGroup>
            <Button onClick={() => setCameraStarted(true)} disabled={cameraStarted}>
              Start Camera
            </Button>
            {hasPhoto && (
              <>
                <Canvas ref={photoRef} hasPhoto={hasPhoto} />
                <Button onClick={() => setHasPhoto(false)}>Clear Photo</Button>
                <Button onClick={handleUploadPhoto}>Upload Photo</Button>
              </>
            )}
          </ButtonGroup>

          <ButtonGroup>
            <Button onClick={toggleRecording} disabled={!cameraStarted}>
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {recordedChunks.length > 0 && !recording && (
              <>
                <Button onClick={handleUploadVideo}>Upload Video</Button>
              </>
            )}
          </ButtonGroup>
        </ButtonSection>
      </Container>
    </>
  );
};

export default Camera;
