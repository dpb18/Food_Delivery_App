package com.feasthub.delivery.dto;

import com.feasthub.delivery.entity.RiderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    @NotNull(message = "Rider status is required")
    private RiderStatus status;
}
