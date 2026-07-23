/**
 * src/types/index.ts
 *
 * Central barrel export for all domain types.
 *
 * Import from "@/types" anywhere in the application instead of importing
 * from individual type files. This gives us the freedom to reorganize
 * internal file structure without updating every consumer.
 *
 * Usage:
 *   import type { Template, InviteData, UserProfile } from "@/types";
 */

export type {
  // Template domain
  EventItem,
  InviteData,
  Template,
  TemplateCategory,
  TemplateVisibility,
  SeoMetadata,
  TemplateManifest,
  RegisteredTemplateInfo,
  TemplateValidationResult,
} from "./template.types";

export type {
  // Invitation domain
  BillingDetails,
  Invitation,
  InvitationStatus,
} from "./invitation.types";

export type {
  // Order domain
  Order,
  OrderStatus,
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  RazorpayOptions,
  RazorpaySuccessResponse,
} from "./order.types";

export type {
  // User / Auth domain
  AuthUser,
  UserProfile,
} from "./user.types";

export type {
  // Project domain
  Project,
  ProjectStatus,
  SaveStatus,
  ConnectionStatus,
  CreateProjectPayload,
  UpdateProjectPayload,
  UseProjectState,
} from "./project.types";

export type {
  // Publish domain
  PublishedInvitation,
  PublicInvitationPayload,
} from "./publish.types";

