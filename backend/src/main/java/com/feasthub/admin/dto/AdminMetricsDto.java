package com.feasthub.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetricsDto {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long activeDishes;
    private long totalRestaurants;
    private long activeRiders;
    private Map<String, Long> ordersByStatus;
}
