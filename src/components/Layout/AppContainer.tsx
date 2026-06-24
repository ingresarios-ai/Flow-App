export default function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[480px] min-h-screen bg-[#0a0e15] relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)] flex flex-col mx-auto">
      {children}
    </div>
  );
}
