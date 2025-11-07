# ☕ Cafe Kiosk

카페 셀프 주문 키오스크 시스템

## 📖 프로젝트 소개

고객이 직접 메뉴를 선택하고 주문할 수 있는 카페 키오스크 웹 애플리케이션입니다.

## 🛠 기술 스택

### Backend
- **Spring Boot** 3.5.6
- **Java** 21
- **MySQL** 8.0
- **Spring Data JPA**
- **Maven**

### Frontend
- **React** 18
- **Vite**
- **Axios**
- **React Router** v6
- **Bootstrap** 5

## ✨ 주요 기능

- 📋 카테고리별 메뉴 조회
- 🛒 장바구니 관리
- 💳 주문 생성
- 📝 주문 내역 확인

## 🚀 시작하기

### 필수 요구사항

- JDK 21
- Node.js 18+
- MySQL 8.0
- Maven

### 설치 및 실행

#### 1. 저장소 클론
```bash
git clone https://github.com/your-username/cafe-kiosk.git
cd cafe-kiosk
```

#### 2. 데이터베이스 설정
```sql
CREATE DATABASE cafe_kiosk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. 환경 변수 설정
`.env` 파일 생성:
```properties
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### 4. 백엔드 실행
```bash
mvn spring-boot:run
```
서버 주소: `http://localhost:8080`

#### 5. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```
앱 주소: `http://localhost:5173`

## 📚 문서

자세한 가이드는 [docs](./docs/) 폴더를 참고하세요:

- [📘 백엔드 가이드](./docs/CAFE_KIOSK_SIMPLE_GUIDE_KR_자바_데이타베이스.md) - Spring Boot 개발 가이드
- [📗 프론트엔드 가이드](./docs/CAFE_KIOSK_REACT_GUIDE_KR_프론트엔드.md) - React 개발 가이드
- [📙 GitHub 협업 가이드](./docs/CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md) - Git 워크플로우
- [📊 브랜치 전략 다이어그램](./docs/CAFE_KIOSK_BRANCH_DIAGRAM.md) - 시각적 브랜치 구조

## 👥 팀 구성

| 역할 | 담당 업무 |
|------|----------|
| 팀원 1 | 데이터베이스 계층 (Entity, Repository) |
| 팀원 2 | 비즈니스 로직 (Service, DTO) |
| 팀원 3 | 컨트롤러 (Controller, Exception) |
| 팀원 4 | 프론트엔드 (메뉴 페이지) |
| 팀원 5 | 프론트엔드 (장바구니, 주문) |

## 📂 프로젝트 구조

```
cafe-kiosk/
├── backend/
│   └── src/main/java/com/cafekiosk/
│       ├── model/          # Entity 클래스
│       ├── repository/     # JPA Repository
│       ├── service/        # 비즈니스 로직
│       ├── controller/     # REST API
│       └── dto/            # 데이터 전송 객체
├── frontend/
│   └── src/
│       ├── components/     # React 컴포넌트
│       ├── pages/          # 페이지
│       ├── api/            # API 호출
│       └── context/        # Context API
└── docs/                   # 프로젝트 문서
```

## 🌐 API 엔드포인트

### 메뉴
- `GET /api/menu/categories` - 카테고리 목록
- `GET /api/menu/items` - 전체 메뉴
- `GET /api/menu/items/category/{id}` - 카테고리별 메뉴

### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders/{orderNumber}` - 주문 조회

## 🤝 기여하기

1. 이 저장소를 Fork 하세요
2. Feature 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 Push 하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📝 라이선스

이 프로젝트는 학습 목적으로 만들어졌습니다.

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 Issues를 통해 연락주세요.

---

⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!
