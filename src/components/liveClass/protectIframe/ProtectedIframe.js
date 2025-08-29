import { useEffect } from "react";
import { toast } from "sonner";

const ProtectedIframe = ({ joinUrl }) => {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.warning("Right-click is disabled in this section.");
    };

    const handleKeyDown = (e) => {
      // Block F12
      if (e.keyCode === 123) {
        e.preventDefault();
        toast.warning("Developer tools are disabled in this section.");
      }

      // Block Ctrl+Shift+I/C/J
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "C", "J"].includes(e.key.toUpperCase())
      ) {
        e.preventDefault();
        toast.warning("Developer tools are disabled in this section.");
      }

      // Block Ctrl+U (view page source)
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        toast.warning("Viewing source code is disabled in this section.");
      }

      // Block PrintScreen key
      if (e.key === "PrintScreen") {
        e.preventDefault();
        toast.warning("Screenshots are disabled in this section.");
      }

      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+S
      if (
        e.ctrlKey &&
        ["c", "v", "x", "a", "s"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        toast.warning("Copy, paste, and save actions are disabled here.");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[999999] bg-black">
      <iframe
        src={joinUrl}
        allow="camera; microphone; fullscreen"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
};

export default ProtectedIframe;
