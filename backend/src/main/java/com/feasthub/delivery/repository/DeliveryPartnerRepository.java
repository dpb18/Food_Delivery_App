package com.feasthub.delivery.repository;

import com.feasthub.delivery.entity.DeliveryPartner;
import com.feasthub.delivery.entity.RiderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    Optional<DeliveryPartner> findByUserId(Long userId);
    List<DeliveryPartner> findByStatus(RiderStatus status);
}
