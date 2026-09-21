package com.feasthub.delivery;

import com.feasthub.common.exception.BadRequestException;
import com.feasthub.common.exception.ResourceNotFoundException;
import com.feasthub.delivery.dto.DeliveryPartnerProfileDto;
import com.feasthub.delivery.dto.UpdateLocationRequest;
import com.feasthub.delivery.dto.UpdateStatusRequest;
import com.feasthub.delivery.dto.VerifyOtpRequest;
import com.feasthub.delivery.entity.DeliveryPartner;
import com.feasthub.delivery.entity.RiderStatus;
import com.feasthub.delivery.repository.DeliveryPartnerRepository;
import com.feasthub.order.OrderService;
import com.feasthub.order.dto.OrderResponseDto;
import com.feasthub.order.entity.Order;
import com.feasthub.order.entity.OrderStatus;
import com.feasthub.order.entity.PaymentStatus;
import com.feasthub.order.repository.OrderRepository;
import com.feasthub.user.entity.User;
import com.feasthub.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAvailableOrders() {
        return orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.READY_FOR_PICKUP).stream()
                .filter(order -> order.getDeliveryPartner() == null)
                .map(orderService::mapToOrderResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getMyAssignedOrders(String riderEmail) {
        DeliveryPartner rider = getRiderByEmail(riderEmail);
        return orderRepository.findByDeliveryPartnerIdOrderByCreatedAtDesc(rider.getId()).stream()
                .map(orderService::mapToOrderResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDto acceptOrder(String riderEmail, Long orderId) {
        DeliveryPartner rider = getRiderByEmail(riderEmail);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() != OrderStatus.READY_FOR_PICKUP) {
            throw new BadRequestException("Order is not ready for pickup. Current status: " + order.getStatus());
        }

        if (order.getDeliveryPartner() != null) {
            throw new BadRequestException("Order has already been accepted by another delivery partner.");
        }

        order.setDeliveryPartner(rider);
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        rider.setStatus(RiderStatus.BUSY);

        deliveryPartnerRepository.save(rider);
        Order saved = orderRepository.save(order);
        return orderService.mapToOrderResponseDto(saved);
    }

    @Transactional
    public OrderResponseDto verifyOtpAndDeliver(String riderEmail, Long orderId, VerifyOtpRequest request) {
        DeliveryPartner rider = getRiderByEmail(riderEmail);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getDeliveryPartner() == null || !order.getDeliveryPartner().getId().equals(rider.getId())) {
            throw new BadRequestException("You are not assigned to this order.");
        }

        if (order.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new BadRequestException("Order cannot be delivered in status: " + order.getStatus());
        }

        if (!order.getDeliveryOtp().equals(request.getEnteredOtp().trim())) {
            throw new BadRequestException("Invalid delivery OTP. Please verify the 4-digit code with the customer.");
        }

        order.setStatus(OrderStatus.DELIVERED);
        order.setOtpVerified(true);
        order.setPaymentStatus(PaymentStatus.PAID);

        // Credit delivery earnings to rider
        BigDecimal payout = order.getDeliveryFee() != null ? order.getDeliveryFee() : new BigDecimal("35.00");
        rider.setTotalEarnings(rider.getTotalEarnings().add(payout));
        rider.setStatus(RiderStatus.ONLINE);

        deliveryPartnerRepository.save(rider);
        Order saved = orderRepository.save(order);
        return orderService.mapToOrderResponseDto(saved);
    }

    @Transactional
    public DeliveryPartnerProfileDto updateLocation(String riderEmail, UpdateLocationRequest request) {
        DeliveryPartner rider = getRiderByEmail(riderEmail);
        rider.setCurrentLatitude(request.getLatitude());
        rider.setCurrentLongitude(request.getLongitude());
        DeliveryPartner saved = deliveryPartnerRepository.save(rider);
        return mapToProfileDto(saved);
    }

    @Transactional
    public DeliveryPartnerProfileDto updateStatus(String riderEmail, UpdateStatusRequest request) {
        DeliveryPartner rider = getRiderByEmail(riderEmail);
        rider.setStatus(request.getStatus());
        DeliveryPartner saved = deliveryPartnerRepository.save(rider);
        return mapToProfileDto(saved);
    }

    @Transactional(readOnly = true)
    public DeliveryPartnerProfileDto getRiderProfile(String riderEmail) {
        DeliveryPartner rider = getRiderByEmail(riderEmail);
        return mapToProfileDto(rider);
    }

    private DeliveryPartner getRiderByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return deliveryPartnerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner profile not found for user: " + email));
    }

    private DeliveryPartnerProfileDto mapToProfileDto(DeliveryPartner rider) {
        return DeliveryPartnerProfileDto.builder()
                .id(rider.getId())
                .userId(rider.getUser().getId())
                .fullName(rider.getUser().getFullName())
                .email(rider.getUser().getEmail())
                .phone(rider.getUser().getPhone())
                .vehicleType(rider.getVehicleType())
                .vehicleNumber(rider.getVehicleNumber())
                .status(rider.getStatus())
                .currentLatitude(rider.getCurrentLatitude())
                .currentLongitude(rider.getCurrentLongitude())
                .totalEarnings(rider.getTotalEarnings())
                .build();
    }
}
