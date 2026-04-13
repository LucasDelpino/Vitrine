const ADDRESS_API_URL = "https://data.geopf.fr/geocodage/search";

export async function searchAddresses(query) {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
    limit: "5",
    autocomplete: "1",
    index: "address",
  });

  const response = await fetch(`${ADDRESS_API_URL}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Impossible de récupérer les suggestions d'adresse");
  }

  const features = Array.isArray(data.features) ? data.features : [];

  return features.map((feature) => {
    const props = feature.properties || {};

    return {
      label: props.label || "",
      address: props.name || props.label || "",
      postal_code: props.postcode || "",
      city: props.city || props.municipality || "",
      country: "France",
    };
  });
}