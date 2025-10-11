"use client";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/app/chatbot/chatbot"), {
  ssr: false,
});

export default Chatbot;
