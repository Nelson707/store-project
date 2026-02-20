package com.store.Store.dto;

import com.store.Store.models.Order;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    // ── Create Order ───────────────────────────────────────────────────────────

    @Data
    public static class CreateOrderRequest {

        @NotNull(message = "Payment method is required")
        private Order.PaymentMethod paymentMethod;

        @NotBlank(message = "Full name is required")
        private String shippingFullName;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^(\\+254|0)[17]\\d{8}$", message = "Enter a valid Kenyan phone number")
        private String shippingPhone;

        @NotBlank(message = "Address is required")
        private String shippingAddress;

        @NotBlank(message = "City is required")
        private String shippingCity;

        @NotBlank(message = "County is required")
        private String shippingCounty;

        private String orderNotes;

        @NotEmpty(message = "Cart cannot be empty")
        @Valid
        private List<OrderItemRequest> items;
    }

    @Data
    public static class OrderItemRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }

    // ── Admin: Update Order Status ─────────────────────────────────────────────

    @Data
    public static class UpdateOrderStatusRequest {
        @NotNull(message = "Status is required")
        private Order.OrderStatus status;
    }

    // ── Admin: Update Payment Status ───────────────────────────────────────────

    @Data
    public static class UpdatePaymentStatusRequest {
        @NotNull(message = "Payment status is required")
        private Order.PaymentStatus paymentStatus;
    }

    // ── Response ───────────────────────────────────────────────────────────────

    @Data
    public static class OrderResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private Order.OrderStatus status;
        private Order.PaymentMethod paymentMethod;
        private Order.PaymentStatus paymentStatus;
        private String shippingFullName;
        private String shippingPhone;
        private String shippingAddress;
        private String shippingCity;
        private String shippingCounty;
        private String orderNotes;
        private BigDecimal totalAmount;
        private boolean cancellable;
        private LocalDateTime createdAt;
        private List<OrderItemResponse> items;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productImageFileName;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal subtotal;
    }
}