export const projects = [
  {
    "id": "mustaqeem",
    "name": "Mustaqeem",
    "kind": "Voice assistant · Linux",
    "status": "tests in repo",
    "description": "A terminal voice assistant for Arch Linux. The wake word, speech-to-text and spoken replies all run locally; only the reasoning step can use a configured OpenAI-compatible provider, with an offline rule-based fallback when nothing is configured.",
    "tags": [
      "Python",
      "openWakeWord",
      "faster-whisper",
      "piper-tts"
    ],
    "notes": [
      "Mic → openWakeWord (custom embedding from recorded wake phrases) → faster-whisper STT → AI → piper-tts reply → back to listening.",
      "Actions go through a fixed registry of structured tools — open apps, system info, media and volume control, web search. No raw shell access is ever exposed.",
      "Shutdown, reboot and delete require explicit confirmation; file access is confined to the home directory (own security module).",
      "Provider-agnostic brain: any OpenAI-compatible endpoint via base URL + key + model, plus an offline rule-based fallback and optional SQLite history.",
      "Five test suites in the repository cover AI, config, memory, security and tools."
    ],
    "href": "https://github.com/GlitchedPhoenix38/terminal-ai-assistant"
  },
  {
    "id": "foziscribe",
    "name": "FoziScribe",
    "kind": "Offline transcription",
    "status": "documented",
    "description": "An offline transcription app for audio and video files. faster-whisper runs locally inside a Gradio interface: a fast and an accurate model mode, segment and optional word-level timestamps, .txt and .srt exports, session history, and an automatic CUDA-to-CPU fallback chain.",
    "tags": [
      "Python",
      "faster-whisper",
      "Gradio",
      "CUDA"
    ],
    "notes": [
      "Two modes: fast (small model, ~0.5 GB VRAM) and accurate (large-v3-turbo, near large-v3 accuracy, ~8× faster).",
      "Graceful device fallback: CUDA + float16 → CUDA + int8 → CPU + int8, so transcription keeps going without a GPU.",
      "Voice-activity detection skips silence; long files (1–2+ hours) are processed in chunks.",
      "Exports copy-to-clipboard, .txt and .srt; the last ten sessions stay reloadable in the UI.",
      "Written and tuned for a 6 GB RTX 4050 laptop; the README documents the full Arch Linux + CUDA setup path."
    ],
    "href": "https://github.com/GlitchedPhoenix38/Audio-to-Text"
  },
  {
    "id": "tta",
    "name": "Text-to-Audio Studio",
    "kind": "Local text-to-speech",
    "status": "108 tests in repo",
    "description": "A local narration studio: pick a voice and a preset, adjust the speed, synthesise WAV on your own GPU. Long scripts up to 200,000 characters are split at paragraph, sentence and clause boundaries, then stitched back into a single file — served by FastAPI with a plain HTML/CSS/JS frontend.",
    "tags": [
      "Python",
      "FastAPI",
      "Kokoro",
      "JavaScript"
    ],
    "notes": [
      "Deterministic chunker: paragraph → sentence → clause boundaries, so every chunk fits the engine and output order is preserved.",
      "Streaming 24 kHz mono PCM concatenation — long jobs never hold the full waveform in memory.",
      "Job manager serialises GPU work; synthesis requests queue instead of colliding.",
      "86 backend tests (API + chunker) and 22 jsdom frontend tests, plus a smoke test script and an architecture decision document.",
      "Verified on hardware: Python 3.12, kokoro 0.9.4, torch CUDA build (recorded in the repo’s architecture notes)."
    ],
    "href": "https://github.com/GlitchedPhoenix38/Text-to-Audio"
  },
  {
    "id": "localmind",
    "name": "LocalMind",
    "kind": "AI image editing · hybrid",
    "status": "documented",
    "description": "An image editor that works offline or online. Offline mode talks to a local Stable Diffusion instance — no accounts, no requests beyond localhost. Online mode sends the same workflow to cloud providers through an API key stored in the browser. React and Vite in front, FastAPI behind.",
    "tags": [
      "React",
      "Vite",
      "FastAPI",
      "Stable Diffusion"
    ],
    "notes": [
      "One workflow, two runtimes: the same prompt/settings route to a local A1111 Stable Diffusion instance (port 7860) or to cloud providers — OpenAI, Replicate, Leonardo.",
      "FastAPI routers separate the two paths (sd_api for local, cloud_api for providers) behind a shared image-processing service.",
      "React component suite (upload zone, prompt input, settings panel, preview) on Vite + Tailwind; API keys stay in the browser, never on a server of mine.",
      "Honest trade-off table in the README: local is free and private, cloud is faster and higher quality."
    ],
    "href": "https://github.com/GlitchedPhoenix38/FREE-AI"
  },
  {
    "id": "peronalai",
    "name": "peronal_ai",
    "kind": "AI workspace · multi-provider",
    "status": "in development",
    "description": "A personal AI chat workspace that talks to any provider you configure. A typed adapter layer normalises providers, a routing service picks the backend per request, and keys live in a local store. Next.js App Router on the front, rate limiting and input validation on every API route.",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "SQLite"
    ],
    "notes": [
      "App Router API routes for chat, provider health, usage and uploads — the UI never talks to providers directly.",
      "Provider catalogue + adapters normalise request/response shapes, so adding a provider is one adapter file.",
      "Security layer with rate limiting and validation on every route; keys stored locally, not in the database schema.",
      "SQLite schema, usage tracking, markdown rendering, and a mobile tab layout alongside the desktop three-pane workspace.",
      "Still evolving — the repository carries handoff and workflow notes rather than release docs."
    ],
    "href": "https://github.com/GlitchedPhoenix38/peronal_ai"
  },
  {
    "id": "dualspace",
    "name": "dual-space",
    "kind": "Android · app virtualisation",
    "status": "in development",
    "description": "An Android dual-space app: run a second instance of an app alongside the original. Built in Kotlin with Material 3, following clean architecture — data, domain and UI layers — with an APK cloner, a virtual-app manager and Shizuku-based privileged operations.",
    "tags": [
      "Kotlin",
      "Material 3",
      "Room",
      "Hilt"
    ],
    "notes": [
      "Clean architecture: repository interfaces in a domain layer, Room + cloner implementations in data, Compose screens on top.",
      "Hilt dependency injection with an application container; Room database with committed schema versions.",
      "ShizukuManager wraps privileged operations so elevated actions stay behind one audited boundary.",
      "Feature-spec document in the repository; the app is under active development, not yet released."
    ],
    "href": "https://github.com/GlitchedPhoenix38/dual-space"
  }
];

export const about = [
  "Most of what I build keeps data on the machine it started on: transcribing audio, synthesising narration, listening for a wake word. Local-first is a practical choice first and a security habit second — it simply means fewer places for anything sensitive to end up.",
  "That habit shows up in the details. Destructive commands ask before they run, file access is confined to the home directory, and no action gets a raw shell. Security is my specialisation, and I treat it as a design constraint rather than something bolted on at the end.",
  "Alongside my studies I take on freelance work and keep learning through independent projects — speech and audio tooling, Android, and web applications. I care about thoughtful engineering, clear interfaces, and software that respects the people using it."
];

export const principles = [
  {
    "title": "Local by default",
    "description": "Process audio, speech and private data on-device. The network is an option, not a requirement."
  },
  {
    "title": "Confirm before destruction",
    "description": "Shutdown, reboot and delete ask first. Safety lives in the tool layer, not in documentation."
  },
  {
    "title": "Constrain access",
    "description": "Structured tools instead of raw shell. Home-directory confinement. One audited boundary for privileged actions."
  },
  {
    "title": "Test where it matters",
    "description": "The narration service carries 86 backend tests; the assistant carries five suites. Core logic earns tests."
  }
];

export const stack = [
  {
    "name": "Languages",
    "items": [
      "Python",
      "TypeScript",
      "JavaScript",
      "Kotlin",
      "Dart",
      "HTML & CSS"
    ]
  },
  {
    "name": "AI and speech",
    "items": [
      "faster-whisper",
      "Kokoro",
      "piper-tts",
      "openWakeWord",
      "Stable Diffusion"
    ]
  },
  {
    "name": "Web and APIs",
    "items": [
      "FastAPI",
      "Next.js",
      "React",
      "Vite",
      "Express",
      "Gradio",
      "SQLite"
    ]
  },
  {
    "name": "Platform",
    "items": [
      "Arch Linux",
      "CUDA",
      "Android",
      "Git",
      "GitHub Actions",
      "Node.js"
    ]
  }
];

export const labs = [
  {
    "name": "Auralis",
    "href": "https://github.com/GlitchedPhoenix38/Auralis",
    "description": "Kotlin music player for Android — Room database, scanner and repository layer.",
    "status": "in development"
  },
  {
    "name": "CampusVault",
    "href": "https://github.com/GlitchedPhoenix38/campusvault",
    "description": "Flutter study-resource app — admin dashboards, upload flows, hierarchical browsing.",
    "status": "in development"
  },
  {
    "name": "VIDEDIT",
    "href": "https://github.com/GlitchedPhoenix38/VIDEDIT",
    "description": "Browser video-editor interface in TypeScript, with its own documented design system.",
    "status": "in development"
  },
  {
    "name": "Live-Users",
    "href": "https://github.com/GlitchedPhoenix38/Live-Users",
    "description": "Realtime presence counter — Express + Socket.IO backend, React frontend.",
    "status": "complete · small"
  },
  {
    "name": "Gemini",
    "href": "https://github.com/GlitchedPhoenix38/gemini",
    "description": "Static chat web app on the Gemini API — plain HTML, CSS and JavaScript.",
    "status": "experiment"
  },
  {
    "name": "RGB Controller",
    "href": "https://github.com/GlitchedPhoenix38/rgbcontroler",
    "description": "RGB LED controller in Python — lighting effects with a UI.",
    "status": "experiment"
  }
];
