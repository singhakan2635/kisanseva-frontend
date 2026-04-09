import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg shadow-primary-500/25 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
            FR
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">FasalRakshak</h1>
          <p className="text-gray-500 mt-1">Your Crop's Guardian</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-4 sm:p-8 border border-white/40">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
