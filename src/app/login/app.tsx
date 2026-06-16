"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("login");

  const handleClose = () => router.push("/");

  return view === "login" ? (
    <LoginModal
      onClose={handleClose}
      onSwitchToRegister={() => setView("register")}
    />
  ) : (
    <RegisterModal
      onClose={handleClose}
      onSwitchToLogin={() => setView("login")}
    />
  );
}