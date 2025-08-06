/* Check rule in storage, if it exist or expired */

export function getValidRule(): number | null {
  const stored = localStorage.getItem("rule");
  if (!stored) return null;

  try {
    const { rule, expiresAt } = JSON.parse(stored);
    const now = Date.now();

    if (now > expiresAt) {
      localStorage.removeItem("rule");
      return null;
    }

    // Extend expiry by 2 hours on access. On second thought, this is bothersome, let's not do it lol
    // const newExpiresAt = now + 2 * 60 * 60 * 1000;
    // localStorage.setItem("rule", JSON.stringify({ rule, expiresAt: newExpiresAt })); 

    return rule;
  } catch {
    localStorage.removeItem("rule");
    return null;
  }
}