import React from 'react';

const Toolbar = ({ color, setColor, strokeWidth, setStrokeWidth, onClear, tool, setTool }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-2 shadow-md w-full justify-center">
      {/* Tool Buttons */}
      <button
        onClick={() => setTool('pencil')}
        className={`flex items-center gap-1 px-3 py-1 rounded ${
        tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-gray-300'
        }`}
      >
       {/* Pencil SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
      >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
      <path d="M20.71 7.04c0.39-0.39 0.39-1.02 0-1.41l-2.34-2.34c-0.39-0.39-1.02-0.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
                Pencil
      </button>
      <button
      onClick={() => setTool('eraser')}
      className={`flex items-center gap-1 px-3 py-1 rounded ${
      tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-300'
      }`}
      >
    {/* Eraser SVG */}
     <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      >
      <path d="M16.24 3.56a2 2 0 0 0-2.83 0L3.56 13.41a2 2 0 0 0 0 2.83l4.6 4.6a2 2 0 0 0 2.83 0l9.85-9.85a2 2 0 0 0 0-2.83l-4.6-4.6zM7.47 19.18l-2.65-2.65 2.83-2.83 2.65 2.65-2.83 2.83zM12 6.34l5.66 5.66-2.83 2.83L9.17 9.17 12 6.34z" />
      </svg>
                 Eraser
      </button>
      {/* Color Picker */}
      <div className="flex gap-2">
        {["black", "red", "blue", "green","orange"].map((c) => (
          <button
            key={c}
            className={`w-6 h-6 rounded-full border-2 ${color === c ? "border-gray-800" : "border-white"}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          ></button>
        ))}
      </div>
      {/* Stroke Width Slider */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium" s style={{ fontSize: "14px",fontWeight: "500",color: color}}>Stroke</label>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-32"
        />
      </div>
      {/* Clear Button */}
      <button
        className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
        onClick={onClear}
      >
      Clear Canvas
      </button>
    </div>
  );
};

export default Toolbar;
