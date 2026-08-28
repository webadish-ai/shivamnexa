export type Award = { title: string; org: string; year: string };

// Shared by /awards and the homepage trust strip. Keep in sync with what's
// actually been won — this is real business data, not marketing filler.
export const AWARDS: Award[] = [
  { title: "Most Effective Marketing Campaign", org: "NEXA", year: "2024" },
  { title: "Most Effective Marketing Campaign", org: "NEXA", year: "2022" },
  { title: "NEXA Alpha Dealer", org: "NEXA", year: "2023" },
  { title: "NEXA Alpha Dealer", org: "NEXA", year: "2022" },
  { title: "NEXA Challenger Trophy", org: "NEXA", year: "2023" },
  { title: "Highest NEXA to MSIL Sales Contribution", org: "NEXA", year: "2019-20" },
];
