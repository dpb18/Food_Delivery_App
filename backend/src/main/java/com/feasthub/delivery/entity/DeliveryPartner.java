package com.feasthub.delivery.entity;

import com.feasthub.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "delivery_partners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 30)
    private VehicleType vehicleType;

    @Column(name = "vehicle_number", nullable = false, length = 50)
    private String vehicleNumber;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RiderStatus status = RiderStatus.OFFLINE;

    @Builder.Default
    @Column(name = "current_latitude", precision = 10, scale = 7)
    private BigDecimal currentLatitude = new BigDecimal("12.9716");

    @Builder.Default
    @Column(name = "current_longitude", precision = 10, scale = 7)
    private BigDecimal currentLongitude = new BigDecimal("77.5946");

    @Builder.Default
    @Column(name = "total_earnings", precision = 10, scale = 2)
    private BigDecimal totalEarnings = BigDecimal.ZERO;
}
