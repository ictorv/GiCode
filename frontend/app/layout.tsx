import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "CodeMind — Multi-Agent Code Intelligence",
  description: "AI-powered duplicate detection and shared library design across repositories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}