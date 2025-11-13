package MKSS.backend.Controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import MKSS.backend.model.Category;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuController {
	
	@GetMapping
	public String viewMenu(
			@RequestParam(required =false)Long categoryId,
			Model model) {
		
		List<Category> category = menuService.getAllCategories();
		List<MenuItem> menuItems;
		
		if(categoryId != null) {
			menuItems= menuService.getMenuItemsByCategory(categoryId);
		}else {
			menuItems = menuService.getAllAvailableMenuItems();
		}
	model.addAllAttributes("categories",categories);
	model.addAllAttributes("menuItems",menuItems);
	model.addAllAttributes("selectedCategoryId", categoryId);	
	
	return "menu";
	}
}
