import React, { useEffect, useRef, useState } from "react";

const DrawingCanvas = ({ socket, roomId, color, strokeWidth, tool }) => {
  const canvasRef = useRef();
  const ctxRef = useRef();
  const [drawing, setDrawing] = useState(false);

  const colorRef = useRef(color);
  const widthRef = useRef(strokeWidth);
  useEffect(() => {
    colorRef.current = color;
    widthRef.current = strokeWidth;
  }, [color, strokeWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  const addText = (x, y) => {
    const ctx = ctxRef.current;
    const text = prompt("Enter text:");
    if (!text) return;
    const fontSize = Math.max(widthRef.current * 10, 16);

    ctx.font = `${fontSize}px Arial`;
    ctx.textBaseline = "top"; 
    ctx.fillStyle = colorRef.current;
    ctx.fillText(text, x, y);

    // Emit to other users
    socket?.emit("draw-text", {
      roomId,
      x,
      y,
      text,
      color: colorRef.current,
      strokeWidth: widthRef.current,
    });
  };

  // Mouse down - start drawing or add text
  const startDrawing = ({ nativeEvent }) => {
    if (!socket?.connected) return;
    const { offsetX, offsetY } = nativeEvent;

    if (tool === "text") {
      addText(offsetX, offsetY);
      return;
    }

    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.strokeStyle = tool === "eraser" ? "#fff" : colorRef.current;
    ctx.lineWidth = widthRef.current;
    setDrawing(true);

    socket.emit("draw-start", {
      roomId,
      offsetX,
      offsetY,
      color: ctx.strokeStyle,
      strokeWidth: widthRef.current,
    });
  };

  // Mouse move - draw line
  const draw = ({ nativeEvent }) => {
    if (!drawing || !socket?.connected) return;
    const { offsetX, offsetY } = nativeEvent;

    const ctx = ctxRef.current;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    socket.emit("draw-move", { roomId, offsetX, offsetY });
  };

  // Mouse up - stop drawing
  const endDrawing = () => {
    if (!drawing || !socket?.connected) return;
    ctxRef.current.closePath();
    setDrawing(false);
    socket.emit("draw-end", { roomId });
  };

  // Listen for incoming socket events
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleDrawStart = ({ offsetX, offsetY, color, strokeWidth }) => {
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
    };

    const handleDrawMove = ({ offsetX, offsetY }) => {
      const ctx = ctxRef.current;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    };

    const handleDrawEnd = () => ctxRef.current.closePath();

    const handleClearCanvas = () => {
      const canvas = canvasRef.current;
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleDrawText = ({ x, y, text, color, strokeWidth }) => {
      const ctx = ctxRef.current;
      const fontSize = Math.max(strokeWidth * 10, 16);
      ctx.font = `${fontSize}px Arial`;
      ctx.textBaseline = "top";
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    };

    socket.on("draw-start", handleDrawStart);
    socket.on("draw-move", handleDrawMove);
    socket.on("draw-end", handleDrawEnd);
    socket.on("clear-canvas", handleClearCanvas);
    socket.on("draw-text", handleDrawText);

    return () => {
      socket.off("draw-start", handleDrawStart);
      socket.off("draw-move", handleDrawMove);
      socket.off("draw-end", handleDrawEnd);
      socket.off("clear-canvas", handleClearCanvas);
      socket.off("draw-text", handleDrawText);
    };
  }, [socket, roomId]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      className="absolute inset-0 z-0 bg-white"
    />
  );
};

export default DrawingCanvas;
