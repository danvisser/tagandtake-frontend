export const Routes = {
  // Home routes (Public)
  HOME: "/",
  HOW_IT_WORKS: "/how-it-works",
  ABOUT: "/about",
  CONTACT: "/contact",

  // Auth routes (Public)
  SIGNUP: {
    MEMBER: "/signup/member",
    STORE: "/signup/store",
  },
  LOGIN: "/login",
  PASSWORD: {
    RESET: "/reset-password",
    CONFIRM: "/reset-password/confirm",
  },

  // Member routes (Private)
  MEMBER: {
    PROFILE: "/member/profile",
    SETTINGS: "/member/settings",
    PAYMENTS: "/member/payments",
    ITEMS: {
      ROOT: "/member/items",
      NEW: "/member/items/new",
      DETAILS: (itemId: string) => `/member/items/${itemId}`,
      EDIT: (itemId: string) => `/member/items/${itemId}/edit`,
    },
  },

  // Store routes (Private)
  STORE: {
    DASHBOARD: "/store/dashboard",
    SETTINGS: "/store/settings",
    PAYMENTS: "/store/payments",
    SUPPLIES: "/store/supplies",
    SUPPLIES_CHECKOUT: "/store/supplies/checkout",
    LISTINGS: {
      ROOT: "/store/listings",
      DETAILS: (listingId: string) => `/store/listings/${listingId}`,
      MANAGE: (listingId: string) => `/store/listings/${listingId}/manage`,
    },
  },

  // Listing routes (Public)
  LISTING: {
    DETAILS: (listingId: string) => `/listing/${listingId}`,
    CHECKOUT: {
      ROOT: (listingId: string) => `/listing/${listingId}/checkout`,
      SUCCESS: (listingId: string) => `/listing/${listingId}/checkout/success`,
    },
  },

  // Store routes (Public)
  STORES: {
    ROOT: "/stores",
    PROFILE: (storeId: string) => `/stores/${storeId}`, 
  },

  // Member routes (Public)
  MEMBERS: {
    ROOT: "/members",
    PROFILE: (memberId: string) => `/members/${memberId}`,
  },
};
