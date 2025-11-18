package MKSS.backend.exception;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;
}
