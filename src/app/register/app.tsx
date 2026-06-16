"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

export default function RegisterPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("register");

  const handleClose = () => router.push("/");

  return view === "register" ? (
    <RegisterModal
      onClose={handleClose}
      onSwitchToLogin={() => setView("login")}
    />
  ) : (
    <LoginModal
      onClose={handleClose}
      onSwitchToRegister={() => setView("register")}
    />
  );
}