import {
  ImagePlus,
  UploadCloud,
} from "lucide-react";

const MAX_SIZE = 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ImageUpload({
  image,
  onChange,
  onError,
}) {
  function handleFile(file) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError(
        "Please select a JPG, PNG, or WEBP image."
      );
      return;
    }

    if (file.size > MAX_SIZE) {
      onError(
        "Image is too large. Maximum size is 1 MB."
      );
      return;
    }

    onError("");

    const reader = new FileReader();

    reader.onload = () => {
      onChange(String(reader.result));
    };

    reader.onerror = () => {
      onError(
        "Could not read your image. Please try again."
      );
    };

    reader.readAsDataURL(file);
  }

  return (
    <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
      {image ? (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
            alt="Selected product preview"
            className="h-full w-full object-contain"
          />

          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
            Click to replace image
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center px-5 py-7">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm">
            <ImagePlus size={23} />
          </span>

          <span className="mt-3 text-sm font-bold text-slate-700">
            Upload product image
          </span>

          <span className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <UploadCloud size={13} />
            JPG, PNG or WEBP · Max 1 MB
          </span>
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </label>
  );
}