export interface SeoCategoryData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  heroBadge: string;
  description: string;
  features: Array<{ title: string; desc: string }>;
  faqs: Array<{ q: string; a: string }>;
  keywords: string[];
}

export const SEO_CATEGORIES: Record<string, SeoCategoryData> = {
  "digital-wedding-invitations": {
    slug: "digital-wedding-invitations",
    title: "Digital Wedding Invitations",
    metaTitle: "Digital Wedding Invitations | Modern Online Invitation Website Maker",
    metaDescription: "Create stunning digital wedding invitations with background music, RSVP tracking, Google Maps directions, and mobile-friendly interactive templates.",
    h1: "Digital Wedding Invitations",
    subtitle: "Share Your Special Day with Modern Elegance & Interactive Magic",
    heroBadge: "Modern Digital Experience",
    description: "Upgrade your wedding experience with luxury digital wedding invitations. Seamlessly share live websites featuring couple photos, interactive event schedules, venue Google Maps navigation, background music, and instant WhatsApp RSVPs.",
    features: [
      { title: "Background Music & Animations", desc: "Delight your guests with smooth traditional or contemporary background melodies as they open your card." },
      { title: "Instant Mobile Sharing", desc: "Send your wedding link directly on WhatsApp, Instagram, or email with rich thumbnail previews." },
      { title: "Google Maps Venue Integration", desc: "Ensure every guest finds your venue effortlessly with built-in interactive Google Maps directions." },
      { title: "Real-Time Customization", desc: "Preview your exact couple names, dates, times, and venue address before purchasing." }
    ],
    faqs: [
      { q: "What is a digital wedding invitation?", a: "A digital wedding invitation is a personalized website link that presents your wedding details interactively on mobile devices and laptops, complete with music, RSVP, map directions, and animations." },
      { q: "How do guests open the digital wedding invitation?", a: "Guests simply tap the link you send them via WhatsApp or email. No app download or sign-in is required." }
    ],
    keywords: ["digital wedding invitations", "online wedding card", "digital marriage invitation", "wedding website maker"]
  },
  "wedding-invitation-maker": {
    slug: "wedding-invitation-maker",
    title: "Wedding Invitation Maker",
    metaTitle: "Online Wedding Invitation Maker | Personalize & Publish Instantly",
    metaDescription: "The easiest online wedding invitation maker for Indian & international weddings. Personalize templates live with zero coding needed.",
    h1: "Online Wedding Invitation Maker",
    subtitle: "Create & Customize Your Dream Wedding Website in Under 5 Minutes",
    heroBadge: "Zero Code Needed",
    description: "Varnam Invites is the premier online wedding invitation maker. Choose from professionally crafted templates, enter your wedding details in our live visual editor, and receive a published website link instantly.",
    features: [
      { title: "Live Visual Preview", desc: "See your wedding details update instantly in real-time as you type." },
      { title: "No Tech Knowledge Required", desc: "Designed for couples to create professional wedding websites without editing code." },
      { title: "Lifetime Web Hosting Included", desc: "Every invitation purchase includes 1 full year of active website hosting with zero maintenance." },
      { title: "Multi-Event Schedules", desc: "Add engagement, Sangeet, Haldi, Mehendi, wedding ceremony, and reception details." }
    ],
    faqs: [
      { q: "Can I customize the wedding invitation on my mobile phone?", a: "Yes! Our wedding invitation maker is 100% mobile-friendly and works smoothly on mobile browsers." },
      { q: "How long does it take to make a wedding invitation website?", a: "You can customize and publish your full wedding invitation website in less than 5 minutes." }
    ],
    keywords: ["wedding invitation maker", "create wedding card online", "wedding website generator", "make marriage invitation"]
  },
  "online-wedding-invitations": {
    slug: "online-wedding-invitations",
    title: "Online Wedding Invitations",
    metaTitle: "Online Wedding Invitations | Eco-Friendly & Interactive Cards",
    metaDescription: "Send eco-friendly online wedding invitations to guests around the world. Featuring music, countdown timers, maps, and instant WhatsApp RSVPs.",
    h1: "Online Wedding Invitations",
    subtitle: "Eco-Friendly, Instant & Unforgettably Beautiful",
    heroBadge: "Eco-Friendly & Instant",
    description: "Replace paper waste with elegant online wedding invitations. Deliver interactive, animated invitations instantly to family and friends anywhere in the world.",
    features: [
      { title: "Eco-Friendly & Sustainable", desc: "Zero paper printing or courier delays — save environment and budget while offering luxury." },
      { title: "Global Reach in Seconds", desc: "Invite guests across the globe instantly via WhatsApp, SMS, or Email." },
      { title: "Interactive Event Timeline", desc: "Organize multi-day wedding festivities into clear, easy-to-read interactive cards." },
      { title: "Always Accessible", desc: "Guests can check event times and venue locations on their phone anytime." }
    ],
    faqs: [
      { q: "Why choose online wedding invitations over paper cards?", a: "Online invitations deliver instant delivery worldwide, interactive Google Maps directions, background music, and zero paper waste at a fraction of paper printing costs." }
    ],
    keywords: ["online wedding invitations", "e-invites for wedding", "paperless wedding card", "virtual marriage invitation"]
  },
  "hindu-wedding-invitations": {
    slug: "hindu-wedding-invitations",
    title: "Hindu Wedding Invitations",
    metaTitle: "Hindu Wedding Invitations | Traditional & Royal Digital Cards",
    metaDescription: "Explore traditional Hindu digital wedding invitation templates featuring Ganesha motifs, temple architecture, gold foil accents, and traditional music.",
    h1: "Hindu Wedding Invitations",
    subtitle: "Honor Sacred Traditions with Royal Digital Craftsmanship",
    heroBadge: "Sacred & Traditional",
    description: "Celebrate your sacred matrimony with authentic Hindu digital wedding invitations. Incorporating Lord Ganesha blessings, traditional temple motifs, vibrant sandalwood aesthetics, and classical mangala vaadhyam background music.",
    features: [
      { title: "Sacred Motifs & Shlokas", desc: "Designed with auspicious symbols, Ganesha imagery, and traditional wedding mantras." },
      { title: "Temple Architecture Design", desc: "Inspired by Kovil architecture, intricate mandalas, and royal Indian heritage." },
      { title: "Traditional Background Music", desc: "Enrich your invitation with classical Nadaswaram and Shehnai melodies." },
      { title: "Multi-Ceremony Support", desc: "Include Muhurtham, Sangeet, Haldi, Mehendi, and Reception timelines." }
    ],
    faqs: [
      { q: "Can I include Sanskrit shlokas and Ganesha mantras?", a: "Yes! All text fields support custom text including Ganesha mantras, shlokas, and traditional blessing text." }
    ],
    keywords: ["hindu wedding invitations", "traditional marriage card", "ganesha wedding invitation", "south indian hindu wedding card"]
  },
  "tamil-wedding-invitations": {
    slug: "tamil-wedding-invitations",
    title: "Tamil Wedding Invitations",
    metaTitle: "Tamil Digital Wedding Invitations | Kovil & Traditional Cards",
    metaDescription: "Authentic Tamil digital wedding invitation templates with Nadaswaram music, Kovil architecture, and traditional Tamil marriage aesthetics.",
    h1: "Tamil Digital Wedding Invitations",
    subtitle: "Traditional Tamil Wedding Websites & Digital Cards",
    heroBadge: "Tamil Heritage",
    description: "Honor traditional Tamil wedding customs with Kovil Vaibhavam invitation templates. Complete with Nadaswaram background music, traditional Kolam motifs, and Tamil muhurtham timing highlights.",
    features: [
      { title: "Nadaswaram & Mangala Vaadhyam", desc: "Auspicious traditional background music that sets a festive Tamil wedding mood." },
      { title: "Kovil Vaibhavam Architecture", desc: "Intricate temple gopuram illustrations, banana leaf borders, and warm golden tones." },
      { title: "Tamil & English Text Support", desc: "Customize text in English or Tamil characters effortlessly." },
      { title: "Subha Muhurtham Highlights", desc: "Prominently display auspicious dates, stars, and ceremony times." }
    ],
    faqs: [
      { q: "Can I enter Tamil language text in the invitation fields?", a: "Yes! You can type or paste Tamil unicode text into any name, venue, or greeting field." }
    ],
    keywords: ["tamil wedding invitations", "kovil vaibhavam card", "tamil digital marriage invite", "subha muhurtham invitation"]
  },
  "telugu-wedding-invitations": {
    slug: "telugu-wedding-invitations",
    title: "Telugu Wedding Invitations",
    metaTitle: "Telugu Wedding Invitations | Traditional Digital Marriage Cards",
    metaDescription: "Beautiful Telugu digital wedding invitations featuring traditional motifs, Talambralu themes, and instant mobile sharing for guests.",
    h1: "Telugu Digital Wedding Invitations",
    subtitle: "Celebrate Telugu Wedding Traditions with Elegant Digital Cards",
    heroBadge: "Telugu Traditions",
    description: "Create memorable Telugu digital wedding invitations featuring classic aesthetics, Sumangali motifs, background music, and interactive event details for your wedding and reception.",
    features: [
      { title: "Sumangali & Traditional Motifs", desc: "Designed with traditional Telugu cultural elements and warm golden palettes." },
      { title: "Kalyanam & Reception Timelines", desc: "Clearly display Muhurtham times, venue locations, and dinner schedules." },
      { title: "WhatsApp RSVP", desc: "Allow family and friends across AP & Telangana to RSVP with a single tap." }
    ],
    faqs: [
      { q: "Can I include details for both Pellikuthuru and Kalyanam?", a: "Yes, you can add unlimited ceremony cards for Pellikuthuru, Sangeet, Kalyanam, and Reception." }
    ],
    keywords: ["telugu wedding invitations", "telugu marriage card online", "kalyanam digital invitation", "telugu e-invitation"]
  },
  "muslim-wedding-invitations": {
    slug: "muslim-wedding-invitations",
    title: "Muslim Wedding Invitations",
    metaTitle: "Muslim Wedding Invitations | Elegant Nikah & Walima Digital Cards",
    metaDescription: "Luxury Islamic digital wedding invitations for Nikah & Walima ceremonies. Featuring Arabic calligraphy aesthetics, royal emerald tones, and music options.",
    h1: "Muslim & Nikah Digital Invitations",
    subtitle: "Graceful & Royal Digital Invitations for Nikah & Walima",
    heroBadge: "Nikah & Walima",
    description: "Celebrate your Nikah with dignified Islamic digital wedding invitations. Incorporating Bismillah calligraphy motifs, opulent emerald & gold color schemes, and multi-event schedules for Nikah, Baraat, and Walima.",
    features: [
      { title: "Bismillah & Calligraphy Aesthetics", desc: "Adorned with elegant Islamic floral geometry and calligraphy styling." },
      { title: "Nikah & Walima Schedules", desc: "Organize separate ceremony times and venues for groom and bride functions." },
      { title: "Google Maps Navigation", desc: "Help guests reach marriage halls and banquet venues with direct map links." }
    ],
    faqs: [
      { q: "Can I customize separate venue details for Nikah and Walima?", a: "Yes! Our multi-event timeline allows separate dates, times, and venue map links for every function." }
    ],
    keywords: ["muslim wedding invitations", "nikah digital card", "walima e-invite", "islamic marriage invitation"]
  },
  "christian-wedding-invitations": {
    slug: "christian-wedding-invitations",
    title: "Christian Wedding Invitations",
    metaTitle: "Christian Wedding Invitations | Elegant & Modern Digital Cards",
    metaDescription: "Sophisticated Christian digital wedding invitation templates. Featuring Church nuptial details, floral designs, background music, and RSVP.",
    h1: "Christian Digital Wedding Invitations",
    subtitle: "Sophisticated & Romantic Digital Cards for Church Nuptials",
    heroBadge: "Church & Reception",
    description: "Celebrate your Holy Matrimony with serene Christian digital wedding invitations. Minimalist floral designs, delicate typography, church service timelines, and reception banquet maps.",
    features: [
      { title: "Holy Matrimony & Reception Layouts", desc: "Dedicating distinct sections for Church Holy Mass and evening reception galas." },
      { title: "Romantic & Floral Typography", desc: "Clean serif fonts and subtle watercolor floral artwork." },
      { title: "Instant RSVP & Google Maps", desc: "Direct guests seamlessly from Church to the reception venue." }
    ],
    faqs: [
      { q: "Can I include Bible verses in the invitation text?", a: "Yes! You can customize welcome headers with your favorite scripture or wedding verse." }
    ],
    keywords: ["christian wedding invitations", "church wedding card", "holy matrimony invitation", "floral wedding website"]
  },
  "luxury-wedding-invitations": {
    slug: "luxury-wedding-invitations",
    title: "Luxury Wedding Invitations",
    metaTitle: "Luxury Digital Wedding Invitations | Premium Royal Wedding Websites",
    metaDescription: "Experience the pinnacle of luxury digital wedding invitations. High-end animations, gold foil textures, custom music, and bespoke digital websites.",
    h1: "Luxury Digital Wedding Invitations",
    subtitle: "The Ultimate Statement of Elegance for Extraordinary Celebrations",
    heroBadge: "High-End Luxury",
    description: "Crafted for couples seeking perfection. Varnam's luxury digital wedding invitations blend opulent aesthetics, smooth Framer Motion animations, card-stack carousel previews, and high-performance engineering.",
    features: [
      { title: "Gold Foil & Sandalwood Aesthetics", desc: "Rich luxury textures that impress guests at first glance." },
      { title: "Flawless Performance", desc: "Lightning-fast page loading optimized for high-end smartphones." },
      { title: "Curated Music & Animation", desc: "Immersive soundscapes and silky smooth parallax transitions." }
    ],
    faqs: [
      { q: "What makes Varnam invitations feel luxury?", a: "We combine custom typography, motion graphics, parallax artwork, zero ads, and instant high-speed cloud hosting." }
    ],
    keywords: ["luxury wedding invitations", "premium wedding website", "royal digital marriage card", "bespoke wedding invites"]
  }
};
