import { revalidatePath } from "next/cache";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
} from "@/lib/api";
import {
  revalidateAllContent,
  revalidateSettingsAffected,
} from "@/lib/revalidate";
import { revalidateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, revalidateSchema);
  if ("response" in parsed) return parsed.response;

  const { type, path, paths } = parsed.data;

  if (type === "all") {
    revalidateAllContent();
    return jsonOk({ ok: true, revalidated: "all" });
  }

  if (type === "settings") {
    revalidateSettingsAffected();
    return jsonOk({ ok: true, revalidated: "settings" });
  }

  const targets = [
    ...(path ? [path] : []),
    ...(paths ?? []),
  ];

  if (targets.length === 0) {
    return jsonError("Provide path or paths to revalidate", 400);
  }

  for (const target of targets) {
    if (!target.startsWith("/")) {
      return jsonError(`Invalid path: ${target}`, 400);
    }
    revalidatePath(target);
  }

  return jsonOk({ ok: true, revalidated: targets });
}
