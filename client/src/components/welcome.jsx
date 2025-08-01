import React from "react";

const Welcome = ({ username, role }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-indigo-100 px-4">
      <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-3xl w-full max-w-md p-8 sm:p-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-800 mb-4 tracking-tight">
          {role == "user" ? "Welcome 👋" : `Hello ${role}`}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-6">
          {username}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-8">
          You’re now signed in. Enjoy your personalized experience.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
