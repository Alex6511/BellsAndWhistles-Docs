const futurePlans = { label: 'Future plans', items: [
  { label: 'Overview', slug: 'future-plans' },
  { label: 'Valve gear (planned for 0.4.0)', slug: 'future-plans/valve-gear' },
  { label: 'Steam plants and simpling (planned for 0.4.0)', slug: 'future-plans/steam-plants' },
] };

const sidebar = [
  { label: 'Bells and Whistles', items: [
    { label: 'Welcome', slug: '' },
    { label: 'Installing', slug: 'installing' },
    { label: "What's new", slug: 'whats-new' },
    { label: 'Migrating to 0.3.0', slug: 'migration' },
  ] },
  { label: 'Authoring guides', items: [
    { label: 'For content authors', slug: 'authors' },
    { label: 'Tender Bells', slug: 'tender-bells' },
    { label: 'Flexible Connectors', slug: 'flexible-connectors' },
    { label: 'Driven Animation', slug: 'driven-animation' },
    { label: 'Horn and Whistle', slug: 'horn-and-whistle' },
    { label: 'Auxiliary Tenders', items: [
      { label: 'Overview', slug: 'aux-tender' },
      { label: 'Virginian AE example', slug: 'aux-tender/example' },
    ] },
    { label: 'Geared Steam', slug: 'geared-steam' },
    { label: 'Oil and wood firing', slug: 'alternative-firing' },
    { label: 'Fuel storage and outlets', slug: 'fuel-services' },
    { label: 'Relay APIs', slug: 'relay-api' },
    { label: 'Your own component kinds', slug: 'component-kinds' },
    { label: 'In-game editor', slug: 'editor-authoring' },
  ] },
  futurePlans,
  { label: 'Maintaining the docs', items: [
    { label: 'Contributing', slug: 'development' },
    { label: 'Versions and audits', slug: 'versions' },
  ] },
];

// Proposals remain in development navigation, outside frozen release guides.
export const releaseSidebar = sidebar.filter((group) => group !== futurePlans);
export default sidebar;
