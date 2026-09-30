"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { allPromptsData, FullPrompt } from "@/lib/sample-data";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const promptId = params?.promptId as string;

  const [prompt, setPrompt] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bKash" | "Nagad" | "Card">("bKash");
  const [accountNo, setAccountNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadPromptDetails() {
      try {
        const res = await fetch("/api/prompts");
        const data = await res.json();
        const found = data.prompts?.find((p: any) => p.id === promptId);

        if (found) {
          setPrompt(found);
        } else {
          const fallback = allPromptsData.find((p: FullPrompt) => p.id === promptId || p.slug === promptId);
          setPrompt(fallback ? { ...fallback, price: 49 } : null);
        }
      } catch {
        const fallback = allPromptsData.find((p: FullPrompt) => p.id === promptId || p.slug === promptId);
        setPrompt(fallback ? { ...fallback, price: 49 } : null);
      } finally {
        setFetching(false);
      }
    }
    if (promptId) {
      loadPromptDetails();
    }
  }, [promptId]);

  if (fetching) {
    return <div className="text-center py-20 text-gray-400">তথ্য লোড হচ্ছে...</div>;
  }

  if (!prompt) {
    return (
      <div className="text-center py-20 text-white">
        <p>প্রম্পট খুঁজে পাওয়া যায়নি।</p>
        <Link href="/browse" className="text-brand-orange underline mt-2 inline-block">
          সব প্রম্পট দেখুন
        </Link>
      </div>
    );
  }

  const promptPrice = Number(prompt.price || 49);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: prompt.id,
          method: paymentMethod,
          accountNo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "পেমেন্ট ব্যর্থ হয়েছে");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/prompt/${prompt.slug}?unlocked=true`);
        }, 1500);
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href={`/prompt/${prompt.slug}`}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel & Return
      </Link>

      <div className="bg-[#151B28] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider">
            Premium Unlock Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Unlock: {prompt.title}
          </h1>
        </div>

        <div className="bg-[#0B0F17] border border-gray-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={prompt.imageUrl}
              alt={prompt.title}
              className="w-16 h-12 object-cover rounded-lg border border-gray-700"
            />
            <div>
              <h4 className="text-sm font-bold text-white line-clamp-1">{prompt.title}</h4>
              <span className="text-xs text-brand-orange">{prompt.category}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Total Amount</span>
            <span className="text-xl font-black text-brand-orange">৳{promptPrice}</span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-8 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">পেমেন্ট সফল হয়েছে!</h3>
            <p className="text-sm text-gray-300">
              প্রম্পটটি আনলক করা হয়েছে। আপনাকে প্রম্পটের পেজে নিয়ে যাওয়া হচ্ছে...
            </p>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["bKash", "Nagad", "Card"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3.5 px-4 rounded-xl font-bold text-sm border transition-all ${
                      paymentMethod === method
                        ? "border-brand-orange bg-brand-orange/10 text-brand-orange shadow-md"
                        : "border-gray-700 bg-[#0B0F17] text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                {paymentMethod === "Card" ? "Card Number" : `${paymentMethod} Mobile Number`}
              </label>
              <input
                type="text"
                required
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder={paymentMethod === "Card" ? "4242 •••• •••• 4242" : "01XXXXXXXXX"}
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>নিরাপদ ও এনক্রিপ্টেড পেমেন্ট প্রসেসিং</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-base transition-all shadow-xl shadow-brand-orange/25 disabled:opacity-60"
            >
              {loading ? "Processing..." : `Pay ৳${promptPrice} with ${paymentMethod}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
