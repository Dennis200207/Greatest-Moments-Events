import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://dennis200207.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function sha1(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function cloudinarySignature(params: Record<string, string>, apiSecret: string): Promise<string> {
  const canonical = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
  return sha1(canonical + apiSecret);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const origin = req.headers.get("origin");
  if (origin && origin !== "https://dennis200207.github.io") return json({ error: "Origin not allowed" }, 403);

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) return json({ error: "Sign-in required" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY")!;
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET")!;
    if (![supabaseUrl, anonKey, serviceKey, cloudName, apiKey, apiSecret].every(Boolean)) {
      return json({ error: "Server configuration is incomplete" }, 500);
    }

    const token = authorization.slice("Bearer ".length);
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Invalid session" }, 401);

    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: admin, error: adminError } = await adminClient
      .from("admin_users").select("user_id").eq("user_id", userData.user.id).maybeSingle();
    if (adminError || !admin) return json({ error: "Administrator access required" }, 403);

    const body = await req.json();
    const action = body?.action;

    if (action === "sign-upload") {
      const publicId = String(body?.publicId || "");
      if (!/^greatest-moments\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/.test(publicId)) {
        return json({ error: "Invalid image identifier" }, 400);
      }
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const params = { overwrite: "true", public_id: publicId, timestamp };
      const signature = await cloudinarySignature(params, apiSecret);
      return json({ cloudName, apiKey, timestamp, publicId, signature });
    }

    if (action === "delete-assets") {
      const publicIds = Array.isArray(body?.publicIds) ? body.publicIds.map(String) : [];
      if (publicIds.length > 100) return json({ error: "Maximum 100 images per request" }, 400);
      if (publicIds.some((id) => !/^greatest-moments\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/.test(id))) {
        return json({ error: "Invalid image identifier" }, 400);
      }
      const results: Array<{ publicId: string; result: string }> = [];
      for (const publicId of publicIds) {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = await cloudinarySignature({ public_id: publicId, timestamp }, apiSecret);
        const form = new FormData();
        form.set("public_id", publicId);
        form.set("timestamp", timestamp);
        form.set("api_key", apiKey);
        form.set("signature", signature);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
          method: "POST",
          body: form,
        });
        const result = await response.json();
        if (!response.ok || (result.result !== "ok" && result.result !== "not found")) {
          return json({ error: "Cloudinary could not delete an image", publicId, details: result, completed: results }, 502);
        }
        results.push({ publicId, result: result.result });
      }
      return json({ deleted: results });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected server error" }, 500);
  }
});
