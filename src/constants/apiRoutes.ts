export const API_ROUTES = {
  AUTH: {
    LOGIN: `/login/`,
    LOGOUT: `/logout/`,
    REFRESH: `/login/refresh/`,
    STATUS: `/auth-status/`,
  },
  ACTIVATION: {
    ACTIVATE: (uidb64: string, token: string) =>
      `/activate/${uidb64}/${token}/`,
    RESEND: `/activate/resend/`,
  },
  PASSWORD: {
    RESET: `/password-reset/`,
    RESET_CONFIRM: `/password-reset/confirm/`,
  },
  SIGNUP: {
    MEMBER: `/signup/member/`,
    STORE: `/signup/store/`,
  },
  MEMBERS: {
    DELETE_ACCOUNT: `/member/account/delete/`,
    PROFILE: `/members/me/profile/`,
    NOTIFICATION_SETTINGS: `/members/me/notification-settings/`,
    PROFILE_PHOTO: `/members/me/profile-photo/`,
    ITEMS: {
      LIST: `/members/me/items/`,
      CREATE: `/members/me/items/`,
      DETAILS: (id: number) => `/members/me/items/${id}/`,
      UPDATE: (id: number) => `/members/me/items/${id}/`,
      DELETE: (id: number) => `/members/me/items/${id}/`,
    },
    LISTINGS: {
      CREATE: `/members/me/listings/`,
      CREATE_WITH_ITEM: `/members/me/listings/with-item/`,
      DETAILS: (id: number) => `/listings/${id}/`,
      CHECK_ROLE: (id: number) => `/listings/${id}/check-role/`,
      CHECK_TAG_AVAILABILITY: (tagId: number) => `/tags/${tagId}/availability/`,
    },
    ITEM_LISTINGS: `/members/me/items-listings/`,
    RECALLED_LISTINGS: {
      GENERATE_COLLECTION_PIN: (id: number) =>
        `/members/me/recalled-listings/${id}/generate-collection-pin/`,
    },
  },
  STORES: {
    BASIC_INFO: (tagId: number) => `/tags/${tagId}/store-info/`,
    DELETE_ACCOUNT: `/store/account/delete/`,
    PROFILE: `/stores/me/profile/`,
    NOTIFICATION_SETTINGS: `/stores/me/notification-settings/`,
    PROFILE_PHOTO: `/stores/me/profile-photo/`,
    UPDATE_PIN: `/stores/me/update-pin/`,
    VALIDATE_PIN: `/stores/me/validate-pin/`,
    CATEGORIES: `/stores/me/categories/`,
    CONDITIONS: `/stores/me/conditions/`,
    PUBLIC_CATEGORIES: (storeId: number) => `/stores/${storeId}/categories/`,
    PUBLIC_CONDITIONS: (storeId: number) => `/stores/${storeId}/conditions/`,
    PURCHASE_TAGS: `/stores/me/purchase-tags/`,
    LIST: `/stores/`,
    LISTINGS: {
      LIST: `/stores/me/listings/`,
      DELIST: (id: number) => `/stores/me/listings/${id}/delist/`,
      RECALL: (id: number) => `/stores/me/listings/${id}/recall/`,
      REPLACE_TAG: (id: number) => `/stores/me/listings/${id}/replace-tag/`,
    },
    RECALLED_LISTINGS: {
      LIST: `/stores/me/recalled-listings/`,
      DETAIL: (id: number) => `/stores/me/recalled-listings/${id}/`,
      COLLECT: (id: number) => `/stores/me/recalled-listings/${id}/collect/`,
    },
    ABANDONED_LISTINGS: {
      LIST: `/stores/me/abandoned-listings/`,
      DETAIL: (id: number) => `/stores/me/abandoned-listings/${id}/`,
      REMOVE_TAG: (id: number) =>
        `/stores/me/abandoned-listings/${id}/remove-tag/`,
    },
    SOLD_LISTINGS: {
      LIST: `/stores/me/sold-listings/`,
      DETAIL: (id: number) => `/stores/me/sold-listings/${id}/`,
      REMOVE_TAG: (id: number) => `/stores/me/sold-listings/${id}/remove-tag/`,
    },
    DELISTED_LISTINGS: {
      LIST: `/stores/me/delisted-listings/`,
    },
    EVENT_LOGS: {
      LIST: `/stores/me/event-logs/`,
    },
    ANALYTICS: {
      SALES: `/stores/me/analytics/sales/`,
      CATEGORY_BREAKDOWN: `/stores/me/analytics/category-breakdown/`,
    },
  },
  CHECKOUT: {
    ITEM: `/checkout/item/`,
    SESSION_STATUS: `/checkout/session-status/`,
    SUPPLIES: `/checkout/supplies/`,
  },
  ITEMS: {
    CATEGORIES: `/items/categories/`,
    CONDITIONS: `/items/conditions/`,
  },
  PAYMENTS: {
    ACCOUNT_STATUS: `/payment-accounts/status/`,
    ONBOARDING: `/payment-accounts/onboarding/`,
    MANAGEMENT: `/payment-accounts/management/`,
    PAYOUTS: `/payment-accounts/payouts/`,
    CHECKOUT_ITEM: `/checkout/item/`,
    CHECKOUT_SUPPLIES: `/checkout/supplies/`,
    ITEM_PURCHASED: `/checkout/purchased-item/`,
    SUPPLY_PURCHASED: `/checkout/purchased-supply/`,
  },
  STRIPE: {
    CONNECT_WEBHOOK: `/stripe/connect-webhook/`,
    PLATFORM_WEBHOOK: `/stripe/platform-webhook/`,
  },
  CONTACT: {
    SUPPORT: "/support/",
  },
};
