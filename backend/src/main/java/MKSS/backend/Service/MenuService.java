package MKSS.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import MKSS.backend.model.Category;
import MKSS.backend.model.MenuItem;
import MKSS.backend.repository.CategoryRepository;
import MKSS.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {

	private final CategoryRepository categoryRepository;
	private final MenuItemRepository menuItemRepository;

	public List<Category> getAllCategories() {
		return categoryRepository.findAllByOrderByDisplayOrderAsc();
	}

	public List<MenuItem> getMenuItemsByCategory(Long categoryId) {
		return menuItemRepository.findByCategoryIdAndAvailableTrue(categoryId);
	}

	public List<MenuItem> getAllAvailableMenuItems() {
		return menuItemRepository.findByAvailableTrue();
	}
}
