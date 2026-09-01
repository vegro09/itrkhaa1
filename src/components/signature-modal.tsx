import { useRef, useState, useEffect } from "react";
import { X, Eraser, Check } from "lucide-react";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  lang?: "ar" | "en";
}

export function SignatureModal({
  isOpen,
  onClose,
  onSave,
  lang = "ar",
}: SignatureModalProps) {
  const isAr = lang === "ar";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setHasDrawn(false);
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawn(true);
    const coords = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const coords = getCoordinates(e, canvas);
    ctx.strokeStyle = "#810100";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-cherry/20 bg-card p-6 shadow-2xl space-y-4 text-start">
        <div className="flex items-center justify-between border-b border-noir/10 pb-3">
          <h3 className="font-display text-lg font-semibold text-maroon">
            {isAr ? "إعادة التوقيع" : "Re-Sign Document"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-noir/40 hover:bg-noir/5 hover:text-noir"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-noir/55">
          {isAr
            ? "ارسم توقيعك الجديد بأصبعك أو بالماوس داخل المربع أدناه:"
            : "Draw your new signature using your finger or mouse inside the box below:"}
        </p>

        <div className="relative h-44 w-full rounded-2xl border-2 border-dashed border-cherry/40 bg-white/90 dark:bg-[#121010] overflow-hidden">
          <canvas
            ref={canvasRef}
            width={500}
            height={176}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="h-full w-full cursor-crosshair touch-none"
          />
          {!hasDrawn && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-noir/35 font-medium">
              {isAr ? "ارسم توقيعك هنا..." : "Draw your signature here..."}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1.5 rounded-full border border-noir/15 px-4 py-2 text-xs font-semibold text-noir/70 hover:bg-noir/5"
          >
            <Eraser size={14} />
            <span>{isAr ? "مسح" : "Clear"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-xs font-medium text-noir/50 hover:bg-noir/5"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasDrawn}
              className="flex items-center gap-1.5 rounded-full bg-cherry px-5 py-2 text-xs font-bold text-cotton disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:opacity-90"
            >
              <Check size={14} />
              <span>{isAr ? "حفظ التوقيع" : "Save Signature"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
