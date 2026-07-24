// Statutory holdback by jurisdiction.
// pct  = statutory holdback percentage on the value of work done
// days = period the holdback is normally retained after substantial
//        performance / completion before it can be released
// tax  = default GST/HST rate applied to construction services
export const PROVINCES = [
  { code: 'AB', name: 'Alberta', pct: 10, days: 60, tax: 5, act: 'Prompt Payment and Construction Lien Act' },
  { code: 'BC', name: 'British Columbia', pct: 10, days: 45, tax: 5, act: 'Builders Lien Act' },
  { code: 'SK', name: 'Saskatchewan', pct: 10, days: 40, tax: 5, act: "Builders' Lien Act" },
  { code: 'MB', name: 'Manitoba', pct: 7.5, days: 40, tax: 5, act: "Builders' Liens Act" },
  { code: 'ON', name: 'Ontario', pct: 10, days: 60, tax: 13, act: 'Construction Act' },
  { code: 'XX', name: 'Other / set my own', pct: 10, days: 45, tax: 5, act: null },
];
