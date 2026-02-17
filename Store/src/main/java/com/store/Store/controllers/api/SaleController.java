package com.store.Store.controllers.api;

import com.store.Store.dto.SaleRequestDto;
import com.store.Store.models.*;

import com.store.Store.repositories.ProductsRepository;
import com.store.Store.repositories.SaleRepository;
import com.store.Store.services.SaleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
//@CrossOrigin(origins = "*")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductsRepository productsRepository;

    /**
     * Checkout endpoint - Process a sale transaction
     * POST /api/sales/checkout
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody SaleRequestDto saleRequest) {
        try {
            Sale sale = saleService.processSale(saleRequest);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sale completed successfully");
            response.put("sale", sale);
            response.put("invoiceNumber", sale.getInvoiceNumber());
            response.put("totalAmount", sale.getTotalAmount());
            response.put("amountPaid", sale.getAmountPaid());
            response.put("change", sale.getAmountPaid().subtract(sale.getTotalAmount()));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            // Handle validation errors (e.g., invalid payment method, insufficient stock)
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "An error occurred while processing the sale: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get all sales
     * GET /api/sales
     */
    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        List<Sale> sales = saleRepository.findAll();
        return ResponseEntity.ok(sales);
    }

    /**
     * Get sale by ID
     * GET /api/sales/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSaleById(@PathVariable Long id) {
        return saleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get sale by invoice number
     * GET /api/sales/invoice/{invoiceNumber}
     */
    @GetMapping("/invoice/{invoiceNumber}")
    public ResponseEntity<?> getSaleByInvoiceNumber(@PathVariable String invoiceNumber) {
        Sale sale = saleRepository.findByInvoiceNumber(invoiceNumber);
        if (sale != null) {
            return ResponseEntity.ok(sale);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get today's sales
     * GET /api/sales/today
     */
    @GetMapping("/today")
    public ResponseEntity<?> getTodaySales() {
        List<Sale> todaySales = saleService.getTodaySales();

        Map<String, Object> response = new HashMap<>();
        response.put("sales", todaySales);
        response.put("count", todaySales.size());
        response.put("totalRevenue", saleService.calculateTotalRevenue(todaySales));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/week")
    public ResponseEntity<?> getThisWeekSales() {
        List<Sale> weekSales = saleService.getThisWeekSales();

        Map<String, Object> response = new HashMap<>();
        response.put("sales", weekSales);
        response.put("count", weekSales.size());
        response.put("totalRevenue", saleService.calculateTotalRevenue(weekSales));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/month")
    public ResponseEntity<?> getThisMonthSales() {
        List<Sale> monthSales = saleService.getThisMonthSales();

        Map<String, Object> response = new HashMap<>();
        response.put("sales", monthSales);
        response.put("count", monthSales.size());
        response.put("totalRevenue", saleService.calculateTotalRevenue(monthSales));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/range")
    public ResponseEntity<?> getSalesByRange(
            @RequestParam("start")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,

            @RequestParam("end")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        try {

            List<Sale> sales = saleService.getSalesByDateRange(start, end);

            Map<String, Object> response = new HashMap<>();
            response.put("sales", sales);
            response.put("count", sales.size());
            response.put("totalRevenue", saleService.calculateTotalRevenue(sales));
            response.put("startDate", start);
            response.put("endDate", end);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }



}