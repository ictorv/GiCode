import "./globals.css";
import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-gray-950 text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}