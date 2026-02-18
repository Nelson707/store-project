package com.store.Store.services;

import com.store.Store.dto.OrderDto.*;
import com.store.Store.models.Order;
import com.store.Store.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;

    // ── Get All Orders ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get Single Order ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + id));
        return mapToResponse(order);
    }

    // ── Update Order Status ────────────────────────────────────────────────────

    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + id));
        order.setStatus(request.getStatus());
        return mapToResponse(orderRepository.save(order));
    }

    // ── Update Payment Status ──────────────────────────────────────────────────

    @Transactional
    public OrderResponse updatePaymentStatus(Long id, UpdatePaymentStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + id));
        order.setPaymentStatus(request.getPaymentStatus());
        return mapToResponse(orderRepository.save(order));
    }

    // ── Delete Order ───────────────────────────────────────────────────────────

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new NoSuchElementException("Order not found: " + id);
        }
        orderRepository.deleteById(id);
    }

    // ── Mapping ────────────────────────────────────────────────────────────────

    private OrderResponse mapToResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
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

        return res;
    }
}