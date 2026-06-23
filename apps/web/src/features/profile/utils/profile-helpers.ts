export function getInitials(name?: string) {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatGender(gender?: string | null) {
  if (!gender) return null;

  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}