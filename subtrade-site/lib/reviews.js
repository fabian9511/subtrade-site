// Customer reviews shown in the carousel on the home page.
//
// The SoftwareApplication structured data on the home page is built from this
// same list, so the star rating Google sees can never claim more than what the
// page actually displays. Add a review here and both the carousel and the
// markup pick it up. Only add reviews that were really given, with the rating
// the customer really left — inventing either is a Google policy violation and
// risks a manual action against the whole site.

export const reviews = [
  {
    quote:
      'Since bringing SubTrade on board, our company growth has taken off. Having every drawing, change order, and document in one centralized spot saves us hours of headache each week. The daily log feature is awesome, and we use the Tasks and deficiencies section constantly to keep every site moving. Highly recommend!',
    name: 'TQC Windows & Doors Inc.',
    place: 'Mississauga, Ontario',
    logo: '/tqc-windows-and-doors-logo.webp',
    initials: 'TQC',
    rating: 5,
  },
  {
    quote:
      'I chose SubTrade as it was a much more streamlined way of managing projects from a subcontractor perspective. Our previous software did not work well and was expensive. Initially in the set-up phase we had to iron out some kinks, however the team reacted quickly and handled each issue as it arose. They did an excellent job onboarding us and listening to our needs. 10/10 experience.',
    name: 'Goose Mechanical',
    place: 'Calgary, Alberta',
    logo: '/goose-mechanical-logo.webp',
    initials: 'GM',
    rating: 5,
    source: 'Capterra',
    sourceLogo: '/capterra-logo.webp',
  },
  // Add more reviews here; each becomes a slide and a Review in the markup.
];

// Averaged from the list above rather than hard-coded, so the number in the
// structured data always matches the reviews on the page.
export const aggregateRating = {
  ratingValue: (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1),
  reviewCount: reviews.length,
};
