package com.store.Store.repositories;

import com.store.Store.models.AppUser;
import com.store.Store.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // User-scoped queries
    List<Order> findByUserOrderByCreatedAtDesc(AppUser user);
    Optional<Order> findByIdAndUser(Long id, AppUser user);

    // Admin: all orders newest first
    List<Order> findAllByOrderByCreatedAtDesc();
}