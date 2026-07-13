import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import React from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({
  children,
}: Props) {
  return (
    <>
      <Header />

      <div className="layout">
        <Sidebar />

        <main className="content">
          {children}
        </main>
      </div>
    </>
  );
}