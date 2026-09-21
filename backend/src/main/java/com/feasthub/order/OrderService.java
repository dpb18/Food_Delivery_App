package com.feasthub.order;

import com.feasthub.common.exception.BadRequestException;
import com.feasthub.common.exception.ResourceNotFoundException;
import com.feasthub.order.dto.*;
import com.feasthub.order.entity.*;
import com.feasthub.order.repository.OrderItemRepository;
import com.feasthub.order.repository.OrderRepository;
import com.feasthub.restaurant.entity.MenuItem;
import com.feasthub.restaurant.entity.Restaurant;
import com.feasthub.restaurant.repository.MenuItemRepository;
import com.feasthub.restaurant.repository.RestaurantRepository;
import com.feasthub.user.entity.Address;
import com.feasthub.user.entity.User;
import com.feasthub.user.repository.AddressRepository;
import com.feasthub.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final AddressRepository addressRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public OrderResponseDto createOrder(String customerEmail, CreateOrderRequest request) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(customer.getId())) {
            throw new BadRequestException("Address does not belong to the authenticated user");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CreateOrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemReq.getMenuItemId()));

            if (!menuItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new BadRequestException("Item " + menuItem.getName() + " does not belong to restaurant " + restaurant.getName());
            }

            BigDecimal itemSubtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .subtotal(itemSubtotal)
                    .build();

            orderItems.add(orderItem);
        }

        BigDecimal deliveryFee = restaurant.getDeliveryFee() != null ? restaurant.getDeliveryFee() : new BigDecimal("35.00");
        BigDecimal discount = BigDecimal.ZERO;

        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            CouponValidationResponse couponRes = validateCoupon(request.getCouponCode().trim(), subtotal);
            if (couponRes.isValid()) {
                if (couponRes.isFreeDelivery()) {
                    deliveryFee = BigDecimal.ZERO;
                }
                discount = couponRes.getDiscountAmount();
            }
        }

        BigDecimal taxAmount = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.subtract(discount).add(deliveryFee).add(taxAmount).max(BigDecimal.ZERO);

        // Generate secure 4-digit numeric OTP
        String otp = String.format("%04d", ThreadLocalRandom.current().nextInt(1000, 10000));

        Order order = Order.builder()
                .customer(customer)
                .restaurant(restaurant)
                .address(address)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .status(OrderStatus.PLACED)
                .deliveryOtp(otp)
                .otpVerified(false)
                .paymentStatus(request.getPaymentMethod() == PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PAID)
                .paymentMethod(request.getPaymentMethod())
                .build();

        for (OrderItem item : orderItems) {
            order.addItem(item);
        }

        Order savedOrder = orderRepository.save(order);
        return mapToOrderResponseDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getCustomerOrders(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(this::mapToOrderResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToOrderResponseDto(order);
    }

    public CouponValidationResponse validateCoupon(String code, BigDecimal subtotal) {
        String upperCode = code.toUpperCase().trim();
        switch (upperCode) {
            case "FEAST50":
                if (subtotal.compareTo(new BigDecimal("200")) < 0) {
                    return CouponValidationResponse.builder()
                            .valid(false)
                            .code(upperCode)
                            .message("Minimum order of ₹200 required for FEAST50")
                            .build();
                }
                BigDecimal disc50 = subtotal.multiply(new BigDecimal("0.50")).min(new BigDecimal("150.00")).setScale(2, RoundingMode.HALF_UP);
                return CouponValidationResponse.builder()
                        .valid(true)
                        .code(upperCode)
                        .description("50% OFF up to ₹150")
                        .discountAmount(disc50)
                        .freeDelivery(false)
                        .message("FEAST50 coupon applied successfully!")
                        .build();

            case "FREEDEL":
                if (subtotal.compareTo(new BigDecimal("150")) < 0) {
                    return CouponValidationResponse.builder()
                            .valid(false)
                            .code(upperCode)
                            .message("Minimum order of ₹150 required for FREEDEL")
                            .build();
                }
                return CouponValidationResponse.builder()
                        .valid(true)
                        .code(upperCode)
                        .description("Zero Delivery Fee")
                        .discountAmount(BigDecimal.ZERO)
                        .freeDelivery(true)
                        .message("Free delivery applied!")
                        .build();

            case "GOURMET20":
                if (subtotal.compareTo(new BigDecimal("350")) < 0) {
                    return CouponValidationResponse.builder()
                            .valid(false)
                            .code(upperCode)
                            .message("Minimum order of ₹350 required for GOURMET20")
                            .build();
                }
                BigDecimal disc20 = subtotal.multiply(new BigDecimal("0.20")).min(new BigDecimal("200.00")).setScale(2, RoundingMode.HALF_UP);
                return CouponValidationResponse.builder()
                        .valid(true)
                        .code(upperCode)
                        .description("Flat 20% OFF up to ₹200")
                        .discountAmount(disc20)
                        .freeDelivery(false)
                        .message("GOURMET20 applied successfully!")
                        .build();

            default:
                return CouponValidationResponse.builder()
                        .valid(false)
                        .code(upperCode)
                        .message("Invalid or expired coupon code")
                        .build();
        }
    }

    public OrderResponseDto mapToOrderResponseDto(Order order) {
        List<OrderItemResponseDto> itemDtos = order.getItems().stream()
                .map(item -> OrderItemResponseDto.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItem().getId())
                        .name(item.getMenuItem().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .imageUrl(item.getMenuItem().getImageUrl())
                        .build())
                .collect(Collectors.toList());

        String addressStr = order.getAddress().getStreetAddress() + ", " +
                order.getAddress().getCity() + ", " +
                order.getAddress().getState() + " - " +
                order.getAddress().getPostalCode();

        String riderName = null;
        String riderPhone = null;
        BigDecimal riderLat = null;
        BigDecimal riderLng = null;

        if (order.getDeliveryPartner() != null) {
            riderName = order.getDeliveryPartner().getUser().getFullName();
            riderPhone = order.getDeliveryPartner().getUser().getPhone();
            riderLat = order.getDeliveryPartner().getCurrentLatitude();
            riderLng = order.getDeliveryPartner().getCurrentLongitude();
        }

        return OrderResponseDto.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getFullName())
                .customerPhone(order.getCustomer().getPhone())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .restaurantAddress(order.getRestaurant().getAddress())
                .addressId(order.getAddress().getId())
                .deliveryAddress(addressStr)
                .deliveryLatitude(order.getAddress().getLatitude())
                .deliveryLongitude(order.getAddress().getLongitude())
                .deliveryPartnerId(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getId() : null)
                .deliveryPartnerName(riderName)
                .deliveryPartnerPhone(riderPhone)
                .riderLatitude(riderLat)
                .riderLongitude(riderLng)
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryOtp(order.getDeliveryOtp())
                .otpVerified(order.getOtpVerified())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .items(itemDtos)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
