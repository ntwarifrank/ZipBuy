import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// Use Inter for body text (more modern, better readability at small sizes)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Keep Poppins for headings
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "ZipBuy Admin",
  description: "Admin dashboard for ZipBuy e-commerce platform",
  icons: {
    icon: "/_Orange Modern Logo-modified.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased bg-gray-50 text-gray-800 text-sm">{children}</body>
    </html>
  );
}
