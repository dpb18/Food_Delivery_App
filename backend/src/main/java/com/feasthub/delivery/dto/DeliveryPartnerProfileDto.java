package com.feasthub.delivery.dto;

import com.feasthub.delivery.entity.RiderStatus;
import com.feasthub.delivery.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartnerProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private VehicleType vehicleType;
    private String vehicleNumber;
    private RiderStatus status;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private BigDecimal totalEarnings;
}
