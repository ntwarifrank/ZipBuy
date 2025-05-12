import "./globals.css";

export const metadata = {
  title: "ZipBuy Admin",
  description: "Admin dashboard for ZipBuy e-commerce platform",
  icons: {
    icon: "/_Orange Modern Logo-modified.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* External font links */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-gray-50 text-gray-800 text-sm font-poppins">
        {children}
      </body>
    </html>
  );
}
