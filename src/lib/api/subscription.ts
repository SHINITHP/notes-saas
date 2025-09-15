export async function upgradeSubscription() {
  const res = await fetch("/api/tenants/:slug/upgrade", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}