import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
export const metadata: Metadata = { title: "PromptHaat — AI Prompt Marketplace", description: "Discover ready-to-use AI prompts for images, videos, and creative content." };
const themeScript = `try{var t=localStorage.getItem('prompthaat-theme'); if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`;
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="bn" className="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head>
  <body className="min-h-screen flex flex-col antialiased"><Header/><main className="flex-grow">{children}</main><Footer/></body></html>;
}
