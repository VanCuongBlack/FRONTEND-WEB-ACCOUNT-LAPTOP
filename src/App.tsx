import AppRoutes from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "border border-[#3d63ff]/25 bg-[#211b42] text-white shadow-[0_18px_48px_rgba(0,0,0,0.35)]",
            title: "text-white font-bold",
            description: "text-[#d9d6ee]",
            actionButton: "bg-[#1677ff] text-white",
            cancelButton: "bg-white/10 text-white",
            closeButton: "bg-[#171233] text-white border-[#3d63ff]/30",
          },
        }}
      />
    </>
  );
}

export default App;
