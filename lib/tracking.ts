// lib/tracking.ts
export type Detection = {
  label: string;
  confidence?: number;
  side?: "left" | "center" | "right";
  distance?: number;
  bbox?: { x: number; y: number; w: number; h: number };
};

const BASE = process.env.TRACKING_API_URL!;

export async function getDetections(filter?: string): Promise<Detection[]> {
  const r = await fetch(`${BASE}/detections`, { cache: "no-store" });
  if (!r.ok) throw new Error(`detections http ${r.status}`);
  let arr = (await r.json()) as Detection[];
  if (filter) arr = arr.filter(o => (o.label || "").toLowerCase().includes(filter.toLowerCase()));
  return arr;
}

export async function navigateTarget(label: string, choice: "left"|"right"|"closest"|"index" = "closest", index?: number) {
  const r = await fetch(`${BASE}/navigate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, choice, index })
  });
  const body = await r.json().catch(() => ({}));
  return { accepted: r.ok, ...body };
}

export async function drive(direction: "w"|"a"|"s"|"d", speed = 1) {
  const r = await fetch(`${BASE}/drive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction, speed })
  });
  const body = await r.json().catch(() => ({}));
  return { accepted: r.ok, ...body };
}
