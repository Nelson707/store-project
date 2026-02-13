package com.store.Store.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SaleRequestDto {
    @NotBlank
    private String paymentMethod;

    @NotNull
    @PositiveOrZero
    private BigDecimal amountPaid;

    @NotEmpty
    private List<SaleItemRequestDto> items;
}
