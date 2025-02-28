export const Routes = {
  // Public routes
  HOME: "/",
  HOW_IT_WORKS: "/how-it-works",
  ABOUT: "/about",
  LOGIN: "/login",
  CONTACT: "#",

  // Member routes
  MEMBER: {
    ROOT: "/member",
    WARDROBE: "/member/wardrobe",
    PROFILE: "/member/profile",
    SIGNUP: "/member/signup",
  },

  // Store routes
  STORE: {
    ROOT: "/store",
    DASHBOARD: "/store/dashboard",
    LISTINGS: "/store/listings",
    SUPPLIES: "/store/supplies",
  },

  // Item routes
  ITEM: {
    ROOT: "/item",
    NEW: "/item/new",
    DETAILS: (itemId: string) => `/item/${itemId}`,
    EDIT: (itemId: string) => `/item/${itemId}/edit`,
  },

  // Listing routes
  LISTING: {
    ROOT: "/listing",
    DETAILS: (listingId: string) => `/listing/${listingId}`,
  },


};
