const API_VERSION = "/v1";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_VERSION}/login/`,
    LOGOUT: `${API_VERSION}/logout/`,
    REFRESH: `${API_VERSION}/login/refresh/`,
    STATUS: `${API_VERSION}/auth-status/`,
  },
  ACTIVATION: {
    ACTIVATE: (uidb64: string, token: string) =>
      `${API_VERSION}/activate/${uidb64}/${token}/`,
    RESEND: `${API_VERSION}/activate/resend/`,
  },
  PASSWORD: {
    RESET: `${API_VERSION}/password-reset/`,
    RESET_CONFIRM: `${API_VERSION}/password-reset/confirm/`,
  },
  SIGNUP: {
    MEMBER: `${API_VERSION}/signup/member/`,
    STORE: `${API_VERSION}/signup/store/`,
  },
  MEMBERS: {
    DELETE_ACCOUNT: `${API_VERSION}/member/account/delete/`,
    PROFILE: `${API_VERSION}/members/me/profile/`,
    NOTIFICATION_SETTINGS: `${API_VERSION}/members/me/notification-settings/`,
    PROFILE_PHOTO: `${API_VERSION}/members/me/profile-photo/`,
    ITEMS: {
      LIST: `${API_VERSION}/members/me/items/`,
      CREATE: `${API_VERSION}/members/me/items/`,
      DETAILS: (id: number) =>
        `${API_VERSION}/members/me/items/${id}/`,
      UPDATE: (id: number) =>
        `${API_VERSION}/members/me/items/${id}/`,
      DELETE: (id: number) =>
        `${API_VERSION}/members/me/items/${id}/`,
    },
    LISTINGS: {
      CREATE: `${API_VERSION}/members/me/listings/`,
      DETAILS: (id: number) => `${API_VERSION}/listings/${id}/`,
      CHECK_ROLE: (id: number) =>
        `${API_VERSION}/listings/${id}/check-role/`,
    },
    ITEM_LISTINGS: `${API_VERSION}/members/me/items-listings/`,
    RECALLED_LISTINGS: {
      GENERATE_COLLECTION_PIN: (id: number) =>
        `${API_VERSION}/members/me/recalled-listings/${id}/generate-collection-pin/`,
    },
  },
  STORES: {
    DELETE_ACCOUNT: `${API_VERSION}/store/account/delete/`,
    PROFILE: `${API_VERSION}/stores/me/profile/`,
    NOTIFICATION_SETTINGS: `${API_VERSION}/stores/me/notification-settings/`,
    PROFILE_PHOTO: `${API_VERSION}/stores/me/profile-photo/`,
    PIN: `${API_VERSION}/stores/me/pin/`,
    CATEGORIES: `${API_VERSION}/stores/me/categories/`,
    CONDITIONS: `${API_VERSION}/stores/me/conditions/`,
    LISTINGS: {
      LIST: `${API_VERSION}/stores/me/listings/`,
      DELIST: (id: number) =>
        `${API_VERSION}/stores/me/listings/${id}/delist/`,
      RECALL: (id: number) =>
        `${API_VERSION}/stores/me/listings/${id}/recall/`,
      REPLACE_TAG: (id: number) =>
        `${API_VERSION}/stores/me/listings/${id}/replace-tag/`,
    },
    RECALLED_LISTINGS: {
      LIST: `${API_VERSION}/stores/me/recalled-listings/`,
      COLLECT: (id: number) =>
        `${API_VERSION}/stores/me/recalled-listings/${id}/collect/`,
    },
  },
  CHECKOUT: {
    ITEM: `${API_VERSION}/checkout/item/`,
    SESSION_STATUS: `${API_VERSION}/checkout/session-status/`,
    SUPPLIES: `${API_VERSION}/checkout/supplies/`,
  },
  ITEMS: {
    CATEGORIES: `${API_VERSION}/items/categories/`,
    CONDITIONS: `${API_VERSION}/items/conditions/`,
  },
  PAYMENT: {
    ACCOUNTS: {
      MANAGEMENT: `${API_VERSION}/payment-accounts/management/`,
      NOTIFICATIONS: `${API_VERSION}/payment-accounts/notifications/`,
      ONBOARDING: `${API_VERSION}/payment-accounts/onboarding/`,
      PAYMENTS: `${API_VERSION}/payment-accounts/payments/`,
      PAYOUTS: `${API_VERSION}/payment-accounts/payouts/`,
      STATUS: `${API_VERSION}/payment-accounts/status/`,
    },
  },
  STRIPE: {
    CONNECT_WEBHOOK: `${API_VERSION}/stripe/connect-webhook/`,
    PLATFORM_WEBHOOK: `${API_VERSION}/stripe/platform-webhook/`,
  },
};
