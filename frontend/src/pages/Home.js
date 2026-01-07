import React from "react";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { ValueProposition } from "../components/ValueProposition";

export function Home({ onLoginClick }) {
  return (
    <>
      <Hero onLoginClick={onLoginClick} />
      <Features />
      <ValueProposition />
    </>
  );
}
