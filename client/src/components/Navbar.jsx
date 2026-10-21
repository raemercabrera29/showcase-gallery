import {
  Boxes,
  LayoutGrid,
  Settings2,
} from "lucide-react";

export default function Navbar({
  view,
  onChangeView,
}) {
  const tabClass = (tab) =>
    `flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
      view === tab
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
        : "text-slate-500 hover:bg-slate-100"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <button
          onClick={() => onChangeView("gallery")}
          className="flex items-center gap-3 text-left"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-400 text-white shadow-md shadow-indigo-100">
            <Boxes size={23} strokeWidth={2.3} />
          </span>

          <span>
            <span className="block text-xl font-extrabold tracking-tight text-slate-900">
              Show
              <span className="text-indigo-600">
                Case
              </span>
            </span>

            <span className="block text-[11px] font-medium text-slate-400">
              Your product collection
            </span>
          </span>
        </button>

        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1 rounded-full bg-slate-100 p-1"
        >
          <button
            onClick={() => onChangeView("gallery")}
            className={tabClass("gallery")}
          >
            <LayoutGrid size={15} />
            Gallery
          </button>

          <button
            onClick={() => onChangeView("manage")}
            className={tabClass("manage")}
          >
            <Settings2 size={15} />
            Manage
          </button>
        </nav>
      </div>
    </header>
  );
}