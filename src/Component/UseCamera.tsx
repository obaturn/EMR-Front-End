import { useState, useRef, useEffect } from "react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  education: string;
  certifications: string[];
  bio: string;
  profileImage?: string;
}

const useCamera = (
  setEditData: React.Dispatch<React.SetStateAction<ProfileData>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraSupported(false);
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === "videoinput");
        setCameraSupported(hasCamera);
      } catch (error) {
        console.error("Error checking camera support:", error);
        setCameraSupported(false);
      }
    };

    checkCameraSupport();
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera API is not supported in your browser");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            setError("Camera permission denied. Please allow camera access in your browser settings.");
            break;
          case "NotFoundError":
            setError("No camera found. Please check if your camera is connected.");
            break;
          case "NotReadableError":
            setError("Camera is already in use by another application.");
            break;
          default:
            setError("Unable to access camera. Please check your camera permissions.");
        }
      } else {
        setError("Unable to access camera. Please check your camera permissions.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        if (validateImageSize(imageDataUrl)) {
          setEditData(prev => ({ ...prev, profileImage: imageDataUrl }));
        }
        stopCamera();
      }
    }
  };

  const validateImageSize = (base64String: string): boolean => {
    if (!base64String) return false;

    try {
      const base64 = base64String.split(",")[1];
      if (!base64) return false;

      const sizeInBytes = Math.ceil((base64.length * 3) / 4);
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 2) {
        setError("Image is too large. Please choose an image smaller than 2MB.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error validating image size:", error);
      return false;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image is too large. Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const target = e.target as FileReader | null;
      if (target?.result) {
        const base64String = target.result as string;
        if (validateImageSize(base64String)) {
          setEditData(prev => ({ ...prev, profileImage: base64String }));
        }
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setError("Error uploading image. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  return {
    isCapturing,
    cameraSupported,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    handleImageUpload,
  };
};

export default useCamera;