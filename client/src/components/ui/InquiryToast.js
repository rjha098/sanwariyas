export default function Toast({ isVisible, message, type, onClose }) {
  if (!isVisible) return null;
  return (
    <div className="fixed top-20 right-5 z-[9999] bg-white border border-gray-200 p-4 shadow-2xl flex items-center gap-4 rounded-md">
      <p className={type === 'error' ? 'text-red-600' : 'text-green-600'}>{message}</p>
      <button onClick={onClose} className="text-gray-500 font-bold">X</button>
    </div>
  );
}

