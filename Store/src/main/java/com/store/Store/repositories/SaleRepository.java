package com.store.Store.repositories;

import com.store.Store.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    /**
     * Find sale by invoice number
     */
    Sale findByInvoiceNumber(String invoiceNumber);

    /**
     * Find sales within a date range
     */
    List<Sale> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Find sales by payment method
     */
    List<Sale> findByPaymentMethod(Sale.PaymentMethod paymentMethod);
}
