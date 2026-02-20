package com.store.Store.services;

import com.store.Store.dto.OrderDto.*;
import com.store.Store.models.AppUser;
import com.store.Store.models.Order;
import com.store.Store.models.OrderItem;
import com.store.Store.models.Product;
import com.store.Store.repositories.AppUserRepository;
import com.store.Store.repositories.OrderRepository;
import com.store.Store.repositories.ProductsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductsRepository productRepository;
    private final AppUserRepository userRepository;

    // ── Create Order ───────────────────────────────────────────────────────────

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String userEmail) {
        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + userEmail));

        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingFullName(request.getShippingFullName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingCounty(request.getShippingCounty());
        order.setOrderNotes(request.getOrderNotes());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new NoSuchElementException(
                            "Product not found: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new IllegalStateException(
                        "Insufficient stock for product: " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setProductImageFileName(product.getImageFileName());
            item.setUnitPrice(product.getPrice());
            item.setQuantity(itemReq.getQuantity());
            item.setSubtotal(product.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity())));

            order.getItems().add(item);
            total = total.add(item.getSubtotal());

            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(total);
        return mapToResponse(orderRepository.save(order));
    }

    // ── Get Orders for a User ──────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + userEmail));

        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get Single Order ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id, String userEmail) {
        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + userEmail));

        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        return mapToResponse(order);
    }

    // ── Mapping ────────────────────────────────────────────────────────────────

    private OrderResponse mapToResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());

        // Expose key user details in the response
        res.setUserId(order.getUser().getId());
        res.setUserName(order.getUser().getName());
        res.setUserEmail(order.getUser().getEmail());

        res.setStatus(order.getStatus());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setPaymentStatus(order.getPaymentStatus());
        res.setShippingFullName(order.getShippingFullName());
        res.setShippingPhone(order.getShippingPhone());
        res.setShippingAddress(order.getShippingAddress());
        res.setShippingCity(order.getShippingCity());
        res.setShippingCounty(order.getShippingCounty());
        res.setOrderNotes(order.getOrderNotes());
        res.setTotalAmount(order.getTotalAmount());
        res.setCreatedAt(order.getCreatedAt());

        res.setItems(order.getItems().stream().map(item -> {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProductId());
            ir.setProductName(item.getProductName());
            ir.setProductImageFileName(item.getProductImageFileName());
            ir.setUnitPrice(item.getUnitPrice());
            ir.setQuantity(item.getQuantity());
            ir.setSubtotal(item.getSubtotal());
            return ir;
        }).collect(Collectors.toList()));

        boolean withinWindow = LocalDateTime.now().isBefore(order.getCreatedAt().plusHours(24));
        boolean cancellableStatus = order.getStatus() != Order.OrderStatus.CANCELLED
                && order.getStatus() != Order.OrderStatus.SHIPPED
                && order.getStatus() != Order.OrderStatus.DELIVERED;
        res.setCancellable(withinWindow && cancellableStatus);

        return res;
    }

    // ── Cancel Order ───────────────────────────────────────────────────────────

    @Transactional
    public OrderResponse cancelOrder(Long id, String userEmail) {
        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + userEmail));

        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order is already cancelled");
        }

        if (order.getStatus() == Order.OrderStatus.SHIPPED ||
                order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new IllegalStateException(
                    "Cannot cancel an order that has already been " +
                            order.getStatus().toString().toLowerCase());
        }

        if (order.getStatus() == Order.OrderStatus.SHIPPED ||
                order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new IllegalStateException(
                    "Cannot cancel an order that has already been " +
                            order.getStatus().toString().toLowerCase());
        }

        LocalDateTime cutoff = order.getCreatedAt().plusHours(24);
        if (LocalDateTime.now().isAfter(cutoff)) {
            throw new IllegalStateException(
                    "Cancellation window has expired. Orders can only be cancelled within 24 hours of placement");
        }

        // Restore stock for each item
        for (OrderItem item : order.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            });
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        return mapToResponse(orderRepository.save(order));
    }
}