export const Routes = {
  HOME: "/",
  HOW_IT_WORKS: "/how-it-works",
  ABOUT: "/about",
  CONTACT: "/contact",

  SIGNUP: {
    MEMBER: "/signup/member",
    STORE: "/signup/store",
    ACTIVATE: "/signup/activate",
    RESEND: "/signup/resend-activation",
  },
  LOGIN: "/login",
  PASSWORD: {
    RESET: "/reset-password",
    CONFIRM: "/reset-password/confirm",
  },

  LISTING: {
    DETAILS: (listingId: string) => `/listing/${listingId}`,
    CHECKOUT_SUCCESS: (listingId: string) =>
      `/listing/${listingId}/success`,
    NEW: "/listing/new",
  },

  MEMBER: {
    ROOT: "/member",
    SETTINGS: "/member/settings",
    PAYMENTS: "/member/payments",
    ITEMS: {
      ROOT: "/member/items",
      NEW: "/member/items/new",
      DETAILS: (itemId: string) => `/member/items/${itemId}`,
    },
  },

  STORE: {
    ROOT: "/store",
    SETTINGS: "/store/settings",
    PAYMENTS: "/store/payments",
    SUPPLIES: "/store/supplies",
    SUPPLIES_CHECKOUT_SUCCESS: "/store/supplies/success",
    LISTINGS: {
      ROOT: "/store/listings",
      DETAILS: (listingId: string) => `/store/listings/${listingId}`,
      RECALLED: (listingId: string) => `/store/listings/recalled/${listingId}`,
      ABANDONED: (listingId: string) => `/store/listings/abandoned/${listingId}`,
      SOLD: (listingId: string) => `/store/listings/sold/${listingId}`,
    },
  },

  STORES: {
    ROOT: "/stores",
  },
};
