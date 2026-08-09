// Deterministic "builder title" generator — same inputs always give the same title.

const PREFIX = [
  "Midnight",
  "Sunset",
  "Monsoon",
  "Tidal",
  "Feral",
  "Coastal",
  "Neon",
  "Barefoot",
  "Lo-fi",
  "Highwire",
  "Saltwater",
  "Sundown",
];

const NOUN = [
  "Shipper",
  "Architect",
  "Alchemist",
  "Cartographer",
  "Operator",
  "Wrangler",
  "Whisperer",
  "Renegade",
  "Tinkerer",
  "Conductor",
  "Lighthouse",
  "Prototyper",
];

const DOMAIN: Array<{ re: RegExp; list: string[] }> = [
  {
    re: /\b(ai|ml|llm|agent|gpt|data|ds)\b|machine|model/i,
    list: ["Prompt", "Latent", "Vector", "Agentic"],
  },
  { re: /react|front|ui|ux|design|css|next/i, list: ["Pixel", "Interface", "Kinetic", "Motion"] },
  {
    re: /back|node|go|rust|api|server|infra|devops|cloud|k8s/i,
    list: ["Systems", "Throughput", "Edge", "Uptime"],
  },
  {
    re: /solid|web3|chain|crypto|contract|zk/i,
    list: ["Onchain", "Trustless", "Ledger", "Consensus"],
  },
  {
    re: /mobile|ios|android|flutter|swift|kotlin/i,
    list: ["Pocket", "Handheld", "Tapworthy", "Offline"],
  },
  {
    re: /found|ceo|pm|product|growth|market/i,
    list: ["Zero-to-One", "Roadmap", "Momentum", "Launch"],
  },
];

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function builderTitle(name: string, stack: string) {
  const seed = hash(`${name.trim().toLowerCase()}::${stack.trim().toLowerCase()}`);
  const match = DOMAIN.find(({ re }) => re.test(stack));
  const options = match ? match.list : PREFIX;
  const firstIndex = seed % options.length;
  const secondIndex = Math.floor(seed / 32) % NOUN.length;
  const first = options.at(firstIndex) ?? options.at(0) ?? "";
  const second = NOUN.at(secondIndex) ?? NOUN.at(0) ?? "";
  return `${first} ${second}`;
}

export function builderId(name: string) {
  const seed = hash(name.trim().toLowerCase() || "builder");
  return `HHG-${String(seed % 100000).padStart(5, "0")}`;
}
