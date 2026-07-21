/**
 * OrderService.ts
 *
 * Client-side Supabase CRUD operations for the orders table.
 * This service reads/writes the database — it does NOT call Razorpay directly.
 * Razorpay communication happens exclusively inside the API routes.
 *
 * Architecture:
 *   Component → useCheckout() → POST /api/orders/* → Razorpay + Supabase
 *                             → OrderService (DB reads for UI)
 *
 * Usage:
 *   import { OrderService } from "@/services";
 */

import { createClient } from "@/lib/supabase/browser";
import type { Order } from "@/types";

function getClient() {
  return createClient();
}

export class OrderService {
  /**
   * Retrieves a single order by its internal UUID.
   * Returns null if not found or RLS blocks access.
   */
  static async getOrder(orderId: string): Promise<Order | null> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as Order;
  }

  /**
   * Retrieves all orders for the authenticated user, newest first.
   */
  static async getOrders(userId: string): Promise<Order[]> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Order[];
  }

  /**
   * Retrieves the most recent paid order for a given project.
   * Used by the success page to display order confirmation details.
   */
  static async getPaidOrderForProject(projectId: string): Promise<Order | null> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("project_id", projectId)
      .eq("status", "paid")
      .order("paid_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as Order | null;
  }
}
