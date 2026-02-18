package com.store.Store.controllers.api;

import com.store.Store.dto.OrderDto.*;
import com.store.Store.services.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    /**
     * GET /api/admin/orders
     * Get all orders across all users.
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }

    /**
     * GET /api/admin/orders/{id}
     * Get any order by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }

    /**
     * PATCH /api/admin/orders/{id}/status
     * Update the order status (e.g. CONFIRMED, SHIPPED, DELIVERED).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(adminOrderService.updateOrderStatus(id, request));
    }

    /**
     * PATCH /api/admin/orders/{id}/payment-status
     * Update the payment status (e.g. PAID, REFUNDED).
     */
    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody UpdatePaymentStatusRequest request
    ) {
        return ResponseEntity.ok(adminOrderService.updatePaymentStatus(id, request));
    }

    /**
     * DELETE /api/admin/orders/{id}
     * Delete an order (use with caution — prefer CANCELLED status instead).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        adminOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}