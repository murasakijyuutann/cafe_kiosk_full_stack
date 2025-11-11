-- Sample data for Cafe Kiosk
-- This file will be automatically loaded by Spring Boot on startup

-- Insert categories
INSERT INTO categories (name, description, display_order, created_at) VALUES
('커피', '신선한 원두로 만든 커피', 1, NOW()),
('디저트', '달콤한 디저트', 2, NOW()),
('음료', '시원한 음료', 3, NOW());

-- Insert menu items
-- Coffee items (category_id = 1)
INSERT INTO menu_items (name, description, price, image_url, available, category_id, created_at, updated_at) VALUES
('아메리카노', '깔끔한 에스프레소와 물', 3000.00, 'https://via.placeholder.com/300?text=Americano', TRUE, 1, NOW(), NOW()),
('카페라떼', '부드러운 우유와 에스프레소', 3500.00, 'https://via.placeholder.com/300?text=Latte', TRUE, 1, NOW(), NOW()),
('카푸치노', '풍성한 거품과 에스프레소', 3500.00, 'https://via.placeholder.com/300?text=Cappuccino', TRUE, 1, NOW(), NOW()),
('바닐라 라떼', '달콤한 바닐라 시럽과 우유', 4000.00, 'https://via.placeholder.com/300?text=Vanilla+Latte', TRUE, 1, NOW(), NOW()),

-- Dessert items (category_id = 2)
('초콜릿 케이크', '진한 초콜릿 케이크', 5000.00, 'https://via.placeholder.com/300?text=Choco+Cake', TRUE, 2, NOW(), NOW()),
('치즈케이크', '부드러운 뉴욕 스타일', 5500.00, 'https://via.placeholder.com/300?text=Cheesecake', TRUE, 2, NOW(), NOW()),
('크루아상', '바삭한 버터 크루아상', 3000.00, 'https://via.placeholder.com/300?text=Croissant', TRUE, 2, NOW(), NOW()),
('마카롱', '달콤한 프랑스 마카롱', 2000.00, 'https://via.placeholder.com/300?text=Macaron', TRUE, 2, NOW(), NOW()),

-- Drink items (category_id = 3)
('오렌지 주스', '신선한 오렌지 주스', 4000.00, 'https://via.placeholder.com/300?text=Orange+Juice', TRUE, 3, NOW(), NOW()),
('딸기 스무디', '달콤한 딸기 스무디', 4500.00, 'https://via.placeholder.com/300?text=Strawberry+Smoothie', TRUE, 3, NOW(), NOW()),
('녹차 라떼', '고소한 녹차 라떼', 4000.00, 'https://via.placeholder.com/300?text=Green+Tea+Latte', TRUE, 3, NOW(), NOW());
