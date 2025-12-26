'use client';
export default function BottomSheet({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full max-w-md rounded-t-lg p-4">
        <button className="mb-2 text-gray-500" onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
}