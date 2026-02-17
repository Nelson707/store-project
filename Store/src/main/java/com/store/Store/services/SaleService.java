package com.store.Store.services;

import com.store.Store.dto.SaleItemRequestDto;
import com.store.Store.dto.SaleRequestDto;
import com.store.Store.models.*;

import com.store.Store.repositories.ProductsRepository;
import com.store.Store.repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductsRepository productsRepository;

    /**
     * Process a complete sale transaction
     * - Validates stock availability
     * - Updates product quantities
     * - Creates sale and sale items
     * - Generates invoice number
     */
    @Transactional
    public Sale processSale(SaleRequestDto saleRequest) {
        // Validate payment method
        Sale.PaymentMethod paymentMethod;
        try {
            paymentMethod = Sale.PaymentMethod.valueOf(saleRequest.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment method. Must be CASH, CARD, or MPESA");
        }

        // Create new sale
        Sale sale = new Sale();
        sale.setPaymentMethod(paymentMethod);
        sale.setAmountPaid(saleRequest.getAmountPaid());

        // Generate unique invoice number
        sale.setInvoiceNumber(generateInvoiceNumber());

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Process each item in the sale
        for (SaleItemRequestDto itemDto : saleRequest.getItems()) {
            // Find product
            Product product = productsRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Product not found with ID: " + itemDto.getProductId()));

            // Check stock availability
            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product: " + product.getName() +
                                ". Available: " + product.getStockQuantity() +
                                ", Requested: " + itemDto.getQuantity());
            }

            // Create sale item
            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemDto.getQuantity());
            saleItem.setUnitPrice(product.getPrice());

            BigDecimal itemSubTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            saleItem.setSubTotal(itemSubTotal);

            // Add item to sale
            sale.addItem(saleItem);

            // Update product stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productsRepository.save(product);

            // Add to total
            totalAmount = totalAmount.add(itemSubTotal);
        }

        sale.setTotalAmount(totalAmount);

        // Validate payment amount
        if (sale.getAmountPaid().compareTo(sale.getTotalAmount()) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient payment. Total: " + totalAmount +
                            ", Paid: " + sale.getAmountPaid());
        }

        // Save and return the sale
        return saleRepository.save(sale);
    }

    /**
     * Generate a unique invoice number
     * Format: INV-YYYYMMDD-XXXX
     */
    private String generateInvoiceNumber() {
        LocalDateTime now = LocalDateTime.now();
        String datePart = String.format("%04d%02d%02d",
                now.getYear(), now.getMonth().getValue(), now.getDayOfMonth());
        String uniquePart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "INV-" + datePart + "-" + uniquePart;
    }

    /**
     * Get all sales for today
     */
    public List<Sale> getTodaySales() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        return saleRepository.findByCreatedAtBetween(startOfDay, endOfDay);
    }

    /**
     * Weekly sales
     */
    public List<Sale> getThisWeekSales() {
        LocalDate today = LocalDate.now();

        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endDateTime = endOfWeek.atTime(LocalTime.MAX);

        return saleRepository.findByCreatedAtBetween(startDateTime, endDateTime);
    }

    /**
     * Monthly sales
     */
    public List<Sale> getThisMonthSales() {
        LocalDate today = LocalDate.now();

        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        LocalDateTime startDateTime = startOfMonth.atStartOfDay();
        LocalDateTime endDateTime = endOfMonth.atTime(LocalTime.MAX);

        return saleRepository.findByCreatedAtBetween(startDateTime, endDateTime);
    }

    /**
     * Custom range sales
     */
    public List<Sale> getSalesByDateRange(LocalDate startDate, LocalDate endDate) {

        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        return saleRepository.findByCreatedAtBetween(startDateTime, endDateTime);
    }




    /**
     * Calculate total revenue from a list of sales
     */
    public BigDecimal calculateTotalRevenue(List<Sale> sales) {
        return sales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get all sales
     */
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    /**
     * Get sale by invoice number
     */
    public Sale getSaleByInvoiceNumber(String invoiceNumber) {
        return saleRepository.findByInvoiceNumber(invoiceNumber);
    }
}