export const normalizeIdentifier = (value) => {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  return normalized.length ? normalized : null;
};

export const normalizeIdentifierArray = (arr) => {
  if (!Array.isArray(arr)) return [];

  return Array.from(
    new Set(
      arr
        .map((v) => normalizeIdentifier(v))
        .filter(Boolean)
    )
  );
};

export const normalizeFreeText = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export const normalizeOptionalString = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};


