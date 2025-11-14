package MKSS.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import MKSS.backend.model.Category;
import MKSS.backend.model.MenuItem;
import MKSS.backend.repository.CategoryRepository;
import MKSS.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {
	
	private final CategoryRepository categoryRepository;
	private final MenuItemRepository menuItemRepository;
	
	//카테고리 조회
	public List<Category>getAllCategories(){
		return categoryRepository.findAllByOrderByDisplayOrderAsc();
	}
	
	//사용 가능한 메뉴 조회
	public List<MenuItem> getAllAvaliableMenuItems(){
		return MenuItemRepository.findByAvailableTrue();
	}
	//카테고리 메뉴 조회
	public List<MenuItem>getMenuItemsByCategory(Long categoryId){
		return menuItemRepository.findByCategoryIdAndAvaliableTrue(categoryId);
	}
	
	//메뉴 id로 조회
	public MenuItem getMenuItemById(Long id) {
		return menuItemRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " +id));
	}
}
