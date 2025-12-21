"use client";

import React, { useRef, useState, useEffect } from "react";

export default function EnterCode() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // keep digits only
    const updated = [...code];
    updated[index] = value.slice(-1); // only last char
    setCode(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeydown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const key = e.key;
    if (key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    const digitsOnly = pasted.replace(/\D/g, "");
    if (/^\d{6}$/.test(digitsOnly)) {
      const digits = digitsOnly.split("");
      setCode(digits);
      inputsRef.current[5]?.focus();
    } else {
      const chars = digitsOnly.split("").slice(0, 6);
      if (chars.length) {
        const newCode = ["", "", "", "", "", ""];
        chars.forEach((c, i) => (newCode[i] = c));
        setCode(newCode);
        const nextIndex = Math.min(chars.length, 5);
        inputsRef.current[nextIndex]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullCode = code.join("");

    if (fullCode.length !== 6 || /\D/.test(fullCode)) {
      setMessage("Please enter all 6 digits");
      setIsError(true);
      return;
    }

    setMessage("Code verified successfully!");
    setIsError(false);
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Enter the six digits <br />
            <span className="text-blue-300">Code</span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-white/80 leading-snug">
            We have sent a six digit code to your email
            <br className="hidden md:block" />
            Please enter it below to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  if (inputsRef.current) {
                    inputsRef.current[index] = el;
                  }
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(index, e)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeydown(index, e)}
                onPaste={handlePaste}
                className="w-12 p-4 text-center text-2xl font-bold bg-white/10 backdrop-blur-sm text-white
                  focus:outline-none border-b-2 border-transparent focus:border-b-blue-400
                   transition-all duration-300"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Verify Code
          </button>

          <p className="text-center text-sm text-white/70">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-300 hover:underline font-medium"
            >
              Back to Login
            </a>
          </p>
        </form>

        {message && (
          <p
            className={`text-center text-sm font-medium ${
              isError ? "text-red-300" : "text-green-300"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
