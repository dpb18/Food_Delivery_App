package com.feasthub.auth;

import com.feasthub.auth.dto.AuthResponse;
import com.feasthub.auth.dto.LoginRequest;
import com.feasthub.auth.dto.RegisterRequest;
import com.feasthub.common.exception.BadRequestException;
import com.feasthub.delivery.entity.DeliveryPartner;
import com.feasthub.delivery.entity.RiderStatus;
import com.feasthub.delivery.entity.VehicleType;
import com.feasthub.delivery.repository.DeliveryPartnerRepository;
import com.feasthub.security.JwtTokenProvider;
import com.feasthub.user.dto.UserSummaryDto;
import com.feasthub.user.entity.RoleName;
import com.feasthub.user.entity.User;
import com.feasthub.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return AuthResponse.builder()
                .token(jwt)
                .user(mapToSummaryDto(user))
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        RoleName role = request.getRole() != null ? request.getRole() : RoleName.ROLE_CUSTOMER;

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        // If registered as delivery partner, automatically initialize delivery profile
        if (role == RoleName.ROLE_DELIVERY_PARTNER) {
            DeliveryPartner partner = DeliveryPartner.builder()
                    .user(savedUser)
                    .vehicleType(VehicleType.BIKE)
                    .vehicleNumber("DL-" + (int)(1000 + Math.random() * 9000))
                    .status(RiderStatus.OFFLINE)
                    .currentLatitude(new BigDecimal("12.9716"))
                    .currentLongitude(new BigDecimal("77.5946"))
                    .totalEarnings(BigDecimal.ZERO)
                    .build();
            deliveryPartnerRepository.save(partner);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .user(mapToSummaryDto(savedUser))
                .build();
    }

    private UserSummaryDto mapToSummaryDto(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
