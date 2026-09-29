import Link from "next/link";
import { ArrowUpRight, Lock, Sparkles } from "lucide-react";

export interface PromptCardProps {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  isPremium: boolean;
  aiModel?: string;
}

export default function PromptCard({
  slug,
  title,
  category,
  description,
  imageUrl,
  isPremium,
  aiModel,
}: PromptCardProps) {
  return (
    <div className="group flex flex-col bg-[#151B28] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Free or Premium Badge */}
        <div className="absolute top-3 left-3">
          {isPremium ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-brand-orange text-white shadow-md">
              <Lock className="w-3 h-3" />
              PREMIUM
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-emerald-600 text-white shadow-md">
              <Sparkles className="w-3 h-3" />
              FREE
            </span>
          )}
        </div>

        {/* AI Model Tag */}
        {aiModel && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-medium text-gray-300">
            {aiModel}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="flex flex-col flex-grow p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange mb-1">
          {category}
        </span>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-orange transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-5 flex-grow">
          {description}
        </p>

        {/* View Prompt Button */}
        <Link
          href={`/prompt/${slug}`}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-gray-800/80 hover:bg-brand-orange transition-colors"
        >
          View Prompt
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
