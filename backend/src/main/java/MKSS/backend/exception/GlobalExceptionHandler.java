package MKSS.backend.exception;

import MKSS.backend.repository.CategoryRepository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final CategoryRepository categoryRepository;

    GlobalExceptionHandler(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

	@ExceptionHandler(ResourceNotFoundException.class)
	public String handleNotFound(ResourceNotFoundException ex, Model model) {
		model.addAttributes("error",ex.getMessage());
		return "error/404";
	}
	@ExceptionHandler(Exception.class)
	public String handleException(Exception ex, Model model) {
		model.addAttribute("error","오류가 발생했습니다: " + ex.getMessage());
		return "error/500";
	}
}
