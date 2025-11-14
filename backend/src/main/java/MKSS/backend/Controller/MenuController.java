package MKSS.backend.Controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import MKSS.backend.Service.MenuService;
import MKSS.backend.model.Category;
import MKSS.backend.model.MenuItem;
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
	model.addAllAttribute("categories",categories);
	model.addAllAttribute("menuItems",menuItems);
	model.addAllAttribute("selectedCategoryId", categoryId);	
	
	return "menu";
	}
}
