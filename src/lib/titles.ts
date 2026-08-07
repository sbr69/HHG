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

const DOMAIN: Array<[RegExp, string[]]> = [
  [/\b(ai|ml|llm|agent|gpt|data|ds)\b|machine|model/i, ["Prompt", "Latent", "Vector", "Agentic"]],
  [/react|front|ui|ux|design|css|next/i, ["Pixel", "Interface", "Kinetic", "Motion"]],
  [
    /back|node|go|rust|api|server|infra|devops|cloud|k8s/i,
    ["Systems", "Throughput", "Edge", "Uptime"],
  ],
  [/solid|web3|chain|crypto|contract|zk/i, ["Onchain", "Trustless", "Ledger", "Consensus"]],
  [/mobile|ios|android|flutter|swift|kotlin/i, ["Pocket", "Handheld", "Tapworthy", "Offline"]],
  [/found|ceo|pm|product|growth|market/i, ["Zero-to-One", "Roadmap", "Momentum", "Launch"]],
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
  const domain = DOMAIN.find(([re]) => re.test(stack));
  const first = domain ? domain[1][seed % domain[1].length] : PREFIX[seed % PREFIX.length];
  const second = NOUN[(seed >> 5) % NOUN.length];
  return `${first} ${second}`;
}

export function builderId(name: string) {
  const seed = hash(name.trim().toLowerCase() || "builder");
  return `HHG-${String(seed % 100000).padStart(5, "0")}`;
}
