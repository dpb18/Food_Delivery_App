package com.feasthub.admin.dto;

import com.feasthub.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminOrderUpdateDto {
    @NotNull(message = "Status is required")
    private OrderStatus status;
}
