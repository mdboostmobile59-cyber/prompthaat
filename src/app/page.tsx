export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <span className="px-3 py-1 text-xs font-semibold text-brand-orange bg-brand-orange/10 border border-brand-orange/30 rounded-full mb-4">
        Phase 1: Project Foundation Ready 🚀
      </span>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        Welcome to <span className="text-brand-orange">PromptHaat</span>
      </h1>
      <p className="text-brand-grayText max-w-lg mb-8">
        বাংলাদেশের প্রথম AI প্রম্পট মার্কেটপ্লেস। আমাদের প্রাথমিক সেটআপ সফলভাবে সম্পন্ন হয়েছে।
      </p>
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-brand-orange text-white font-medium rounded-lg shadow-md">
          ফাউন্ডেশন তৈরি
        </div>
      </div>
    </div>
  );
}
