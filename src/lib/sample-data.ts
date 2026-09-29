import { PromptCardProps } from "@/components/shared/PromptCard";

export interface FullPrompt extends PromptCardProps {
  promptContent: string;
  promptType: "Video" | "Image" | "Story" | "Character";
  createdAt: string;
}

export const CATEGORIES = [
  "All Categories",
  "Animals & Pets",
  "Art & Animation",
  "ASMR",
  "Comedy",
  "DIY & Crafts",
  "Emotional",
  "Fantasy & Sci-Fi",
  "Food",
  "Kids & Family",
  "Nature & Wildlife",
  "Sports & Action",
];

export const allPromptsData: FullPrompt[] = [
  {
    id: "1",
    slug: "cute-panda-rescue-story",
    title: "Cute Panda Rescue Story",
    category: "Animals & Pets",
    promptType: "Video",
    description: "Cinematic emotional rescue story of an adorable baby panda in a bamboo forest.",
    promptContent:
      "Cinematic slow-motion shot, a gentle human hand rescuing an adorable baby panda trapped near a mountain creek, misty bamboo forest background, photorealistic 8k, golden volumetric sunbeams, emotional warm color grading --ar 16:9 --v 6.0",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&auto=format&fit=crop&q=80",
    isPremium: false,
    aiModel: "Kling AI",
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    slug: "cyberpunk-dhaka-2099",
    title: "Cyberpunk Dhaka Rickshaw City",
    category: "Fantasy & Sci-Fi",
    promptType: "Video",
    description: "Neon futuristic nighttime visual of Dhaka city with floating rickshaws and vibrant rain reflections.",
    promptContent:
      "Ultra-detailed cyberpunk aesthetic cityscape of Dhaka in the year 2099, futuristic hovering neon rickshaws gliding over wet asphalt streets, vibrant holographic Bengali signboards, cinematic lens flare, Unreal Engine 5 render style --ar 16:9",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
    isPremium: true,
    aiModel: "Veo / Sora",
    createdAt: "2025-01-12",
  },
  {
    id: "3",
    slug: "asmr-traditional-pottery",
    title: "ASMR Traditional Clay Pottery Making",
    category: "ASMR",
    promptType: "Video",
    description: "Close-up slow motion cinematic lighting of hands shaping earthen clay pots with satisfying water droplets.",
    promptContent:
      "Macro 4k close up shot of artisan hands shaping wet earthen clay on a rotating pottery wheel, smooth gliding water drops, deep warm acoustic ambient shadows, 60fps buttery smooth video output",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80",
    isPremium: true,
    aiModel: "Seedance",
    createdAt: "2025-01-15",
  },
  {
    id: "4",
    slug: "bengali-village-sunrise-nature",
    title: "Misty Sunrise Over Rural River",
    category: "Nature & Wildlife",
    promptType: "Image",
    description: "Golden hour photorealistic morning mist rising over green paddy fields and tranquil village boats.",
    promptContent:
      "National Geographic style photography, tranquil rural riverbank of Bangladesh at dawn, wooden dinghy boat gently floating, thick golden mist rising over lush green rice fields, soft pastel dawn sky, extremely detailed --ar 16:9",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    isPremium: false,
    aiModel: "Midjourney",
    createdAt: "2025-01-18",
  },
  {
    id: "5",
    slug: "retro-3d-clay-animation-character",
    title: "Cute Claymation Bakery Chef",
    category: "Art & Animation",
    promptType: "Video",
    description: "Charming claymation style short video prompt featuring a tiny chef baking mini croissants.",
    promptContent:
      "Handmade stop-motion plasticine clay animation of a miniature joyful baker in a checkered apron pulling glowing golden miniature bread from a clay brick oven, charming tactile clay textures, Aardman studio style",
    imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80",
    isPremium: true,
    aiModel: "Kling AI",
    createdAt: "2025-01-20",
  },
  {
    id: "6",
    slug: "hyperrealistic-spicy-biryani-macro",
    title: "Sizzling Kacchi Biryani Macro Shot",
    category: "Food",
    promptType: "Image",
    description: "Mouth-watering commercial advertisement shot of steaming basmati rice with golden tender meat.",
    promptContent:
      "Top-tier commercial food photography of Old Dhaka traditional Kacchi Biryani served on an antique brass platter, visible aromatic steam curls, saffron infused grains, tender roasted potato, dramatic commercial side-lighting --ar 16:9",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    isPremium: false,
    aiModel: "Veo",
    createdAt: "2025-01-22",
  },
  {
    id: "7",
    slug: "funny-cat-coffee-barista",
    title: "Cat Barista Making Latte Art",
    category: "Comedy",
    promptType: "Video",
    description: "Whimsical funny clip of a fluffy cat carefully pouring a heart into coffee foam.",
    promptContent:
      "Hilarious photorealistic video clip of an intelligent ginger tabby wearing tiny round eyeglasses and an apron, concentrated paws holding a pitcher to pour heart latte art in an aesthetic modern cafe setting",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
    isPremium: false,
    aiModel: "Midjourney",
    createdAt: "2025-01-24",
  },
  {
    id: "8",
    slug: "magical-forest-fairy-lighting",
    title: "Bioluminescent Forest Waterfall",
    category: "Fantasy & Sci-Fi",
    promptType: "Image",
    description: "Glowing mushrooms and ethereal blue waterfalls in a nighttime enchanted jungle.",
    promptContent:
      "Surreal fairytale landscape at midnight, towering glowing cyan bioluminescent mushrooms surrounding a cascading crystalline waterfall, floating spark particles, magical atmosphere, hyper-detailed fantasy wallpaper --ar 16:9",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    isPremium: false,
    aiModel: "Gemini",
    createdAt: "2025-01-25",
  },
  {
    id: "9",
    slug: "bengali-wedding-cinematic-portrait",
    title: "Royal Crimson Bengali Bridal Portrait",
    category: "Art & Animation",
    promptType: "Image",
    description: "Exquisite details of gold jewelry, red katan saree, and cinematic warm studio lighting.",
    promptContent:
      "Vogue editorial portrait of an elegant South Asian bride in traditional handcrafted crimson red Banarasi saree, intricate gold choker jewelry, artistic chandan artwork on forehead, warm soft box portraiture, 85mm lens --ar 4:5",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    isPremium: false,
    aiModel: "Midjourney",
    createdAt: "2025-01-26",
  },
];

export const popularPrompts = allPromptsData.slice(0, 3);
export const latestPrompts = allPromptsData.slice(3, 6);
export const freePrompts = allPromptsData.slice(6, 9);
