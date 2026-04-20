export interface Client {
  name: string;
  domain: string;
  /**
   * Optional override when the auto-fetched favicon is poor quality or
   * clashes with the site palette. Three modes:
   *  - { kind: "wordmark" }       → render the name in Cormorant Garamond
   *  - { kind: "image", src }     → render a curated asset (tinted to cream)
   */
  override?:
    | { kind: "wordmark" }
    | { kind: "image"; src: string };
}

export const clients: Client[] = [
  { name: "Rimes", domain: "rimes.com" },
  { name: "Multiverse", domain: "multiverse.io", override: { kind: "wordmark" } },
  { name: "Houzz", domain: "houzz.com" },
  { name: "Motorway", domain: "motorway.co.uk" },
  { name: "Bloom & Wild", domain: "bloomandwild.com" },
  { name: "Veed", domain: "veed.io" },
  { name: "Accurx", domain: "accurx.com" },
  { name: "Finom", domain: "finom.co", override: { kind: "wordmark" } },
  { name: "Upvest", domain: "upvest.co" },
  { name: "TestGorilla", domain: "testgorilla.com" },
  { name: "Flock", domain: "flockcover.com" },
  { name: "Vestiaire Collective", domain: "vestiairecollective.com" },
  { name: "Pret a Manger", domain: "pret.com" },
  { name: "Fundapps", domain: "fundapps.co" },
];
