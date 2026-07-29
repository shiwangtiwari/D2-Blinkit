export const YELLOW = '#F8CB46'
export const BLACK = '#1C1C1C'
export const GREEN = '#0C831F'
export const WHITE = '#FFFFFF'
export const GREY_BG = '#F7F7F7'
export const GREY_MID = '#E8E8E8'
export const GREY_TXT = '#6B6B6B'
export const GREY_BORDER = '#D4D4D4'

export const THEMES = [
  'habit_reorder',
  'price_perception',
  'quality_trust',
  'discovery_friction',
  'app_clutter',
  'delivery_experience',
  'mission_shopping',
  'assortment_gap',
  'service_issue',
  'other',
]

export const THEME_LABELS = {
  habit_reorder: 'Reorder on Autopilot',
  price_perception: 'Price Hesitation',
  quality_trust: 'Quality Concern',
  discovery_friction: 'Discovery Friction',
  app_clutter: 'Ad & Banner Noise',
  delivery_experience: 'Delivery Experience',
  mission_shopping: 'Goal-Driven Shopping',
  assortment_gap: 'Missing Products',
  service_issue: 'Support & Refund Issues',
  other: 'Uncategorised',
}

export const THEME_DESCRIPTIONS = {
  habit_reorder:
    'User buys the same items on autopilot, reorders without thinking, or relies entirely on search history and past orders without exploring new categories.',
  price_perception:
    'User finds new or unfamiliar items overpriced, compares prices with local stores or Amazon, or hesitates before trying something from a new category.',
  quality_trust:
    'User worries about freshness, quality, or authenticity of items in categories they have not tried on the platform. Includes damaged or expired product complaints that erode trust.',
  discovery_friction:
    'User cannot find new products, never sees relevant suggestions, or says the app does not surface things they might actually want.',
  app_clutter:
    'User complains about too many banners, pop-ups, or promotional noise they ignore or find intrusive — covering up content they would otherwise engage with.',
  delivery_experience:
    'User talks about delivery speed, packaging quality, rider behavior, or the physical delivery process.',
  mission_shopping:
    'User shops for a specific occasion, event, or need rather than browsing a category. Includes trips across multiple apps or stores to complete one task.',
  assortment_gap:
    'User wanted a specific product, brand, or category that was simply not available on the platform.',
  service_issue:
    'User reports problems with refunds, customer support responsiveness, wrong items delivered, or account-level issues.',
  other:
    'Feedback that does not fit any of the above themes clearly enough to be useful for product decisions.',
}
