<div align="center">

# ☕ Cafe Kiosk

### 카페 셀프 주문 키오스크 시스템

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Educational-yellow.svg)](LICENSE)

[Features](#-주요-기능) • [Getting Started](#-시작하기) • [Documentation](#-문서) • [Team](#-팀-구성) • [Contributing](#-기여하기)

</div>

---

## 📖 프로젝트 소개

고객이 직접 메뉴를 선택하고 주문할 수 있는 **풀스택 카페 키오스크 웹 애플리케이션**입니다.
Spring Boot 백엔드와 React 프론트엔드를 활용한 현대적인 아키텍처로 구축되었습니다.

<div align="center">

### 🎯 프로젝트 목표

</div>

```
✅ 직관적인 사용자 인터페이스 제공
✅ RESTful API 기반 백엔드 구축
✅ 실시간 주문 처리 시스템
✅ 팀 협업을 통한 Git 워크플로우 학습
```

---

## 🛠 기술 스택

<table>
<tr>
<td width="50%" valign="top">

### Backend
- ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white) **3.5.6**
- ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) **21**
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) **8.0**
- ![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=flat&logo=spring&logoColor=white)
- ![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat&logo=apache-maven&logoColor=white)

</td>
<td width="50%" valign="top">

### Frontend
- ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) **18**
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
- ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat&logo=react-router&logoColor=white) **v6**
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white) **5**

</td>
</tr>
</table>

---

## ✨ 주요 기능

| 기능 | 설명 |
|:---:|------|
| 📋 | **카테고리별 메뉴 조회** - 음료, 디저트 등 카테고리로 분류된 메뉴 탐색 |
| 🛒 | **장바구니 관리** - 실시간 장바구니 추가/삭제 및 수량 조절 |
| 💳 | **주문 생성** - 간편한 주문 프로세스와 주문 번호 발급 |
| 📝 | **주문 내역 확인** - 주문 번호로 주문 상세 정보 조회 |

---

## 🚀 시작하기

### 📋 필수 요구사항

시작하기 전에 다음 프로그램이 설치되어 있는지 확인하세요:

- ![Java](https://img.shields.io/badge/JDK-21+-orange) Java Development Kit 21 이상
- ![Node.js](https://img.shields.io/badge/Node.js-18+-green) Node.js 18 이상
- ![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue) MySQL 8.0 이상
- ![Maven](https://img.shields.io/badge/Maven-Latest-red) Apache Maven

---

### 📥 설치 및 실행

#### 1️⃣ 저장소 클론

```bash
git clone https://github.com/murasakijyuutann/cafe-kiosk.git
cd cafe-kiosk
```

#### 2️⃣ 데이터베이스 설정

MySQL에 접속하여 데이터베이스를 생성합니다:

```sql
CREATE DATABASE cafe_kiosk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3️⃣ 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력합니다:

```properties
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### 4️⃣ 백엔드 실행

```bash
mvn spring-boot:run
```

✅ 서버가 시작되면 다음 주소로 접속할 수 있습니다: **`http://localhost:8080`**

#### 5️⃣ 프론트엔드 실행

새 터미널을 열고:

```bash
cd frontend
npm install
npm run dev
```

✅ 앱이 시작되면 다음 주소로 접속할 수 있습니다: **`http://localhost:5173`**

---

## 📚 문서

프로젝트 개발에 필요한 자세한 가이드는 [`docs`](./docs/) 폴더를 참고하세요:

| 문서 | 설명 |
|------|------|
| 📘 [Backend Guide](./docs/CAFE_KIOSK_SIMPLE_GUIDE_KR_자바_데이타베이스.md) | Spring Boot, JPA, Entity 개발 가이드 |
| 📗 [Frontend Guide](./docs/CAFE_KIOSK_REACT_GUIDE_KR_프론트엔드.md) | React, Components, Routing 개발 가이드 |
| 📙 [GitHub Collaboration Guide](./docs/CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md) | Git 워크플로우 및 협업 가이드 |
| 📊 [Branch Strategy Diagram](./docs/CAFE_KIOSK_BRANCH_DIAGRAM.md) | 시각적 브랜치 구조 및 전략 |
| 🔧 [**Branch Setup Guide**](./docs/BRANCH_SETUP_GUIDE.md) | **브랜치 생성 및 팀원 작업 시작 가이드** |

> 💡 **팀원이 처음 시작하는 경우**: [Branch Setup Guide](./docs/BRANCH_SETUP_GUIDE.md)를 먼저 확인하세요!

---

## 👥 팀 구성

우리 팀은 5명의 개발자로 구성되어 있으며, 각자의 전문 분야를 담당합니다:

<table>
<tr>
<th>팀원</th>
<th>담당 업무</th>
<th>브랜치</th>
</tr>
<tr>
<td align="center">👤 <b>팀원 1</b></td>
<td>데이터베이스 계층 (Entity, Repository)</td>
<td><code>feature/database</code></td>
</tr>
<tr>
<td align="center">👤 <b>팀원 2</b></td>
<td>비즈니스 로직 (Service, DTO)</td>
<td><code>feature/service</code></td>
</tr>
<tr>
<td align="center">👤 <b>팀원 3</b></td>
<td>컨트롤러 (Controller, Exception)</td>
<td><code>feature/controller</code></td>
</tr>
<tr>
<td align="center">👤 <b>팀원 4</b></td>
<td>프론트엔드 - 메뉴 페이지</td>
<td><code>feature/frontend-menu</code></td>
</tr>
<tr>
<td align="center">👤 <b>팀원 5</b></td>
<td>프론트엔드 - 장바구니 & 주문</td>
<td><code>feature/frontend-cart</code></td>
</tr>
</table>

### 🌿 브랜치 전략

```
main
  └── develop
        ├── feature/database
        ├── feature/service
        ├── feature/controller
        ├── feature/frontend-menu
        └── feature/frontend-cart
```

> 자세한 브랜치 설정 방법은 [Branch Setup Guide](./docs/BRANCH_SETUP_GUIDE.md)를 참고하세요.

---

## 📂 프로젝트 구조

```
cafe-kiosk/
├── 📁 backend/
│   └── src/main/java/com/cafekiosk/
│       ├── 📦 model/          # Entity 클래스
│       ├── 📦 repository/     # JPA Repository
│       ├── 📦 service/        # 비즈니스 로직
│       ├── 📦 controller/     # REST API
│       └── 📦 dto/            # 데이터 전송 객체
│
├── 📁 frontend/
│   └── src/
│       ├── 📦 components/     # React 컴포넌트
│       ├── 📦 pages/          # 페이지
│       ├── 📦 api/            # API 호출
│       └── 📦 context/        # Context API
│
└── 📁 docs/                   # 프로젝트 문서
    ├── 📄 BRANCH_SETUP_GUIDE.md
    ├── 📄 CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md
    └── 📄 ...
```

---

## 🌐 API 엔드포인트

### 📋 메뉴 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/menu/categories` | 카테고리 목록 조회 |
| `GET` | `/api/menu/items` | 전체 메뉴 아이템 조회 |
| `GET` | `/api/menu/items/category/{id}` | 카테고리별 메뉴 조회 |

### 🛒 주문 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | 새 주문 생성 |
| `GET` | `/api/orders/{orderNumber}` | 주문 번호로 주문 조회 |

---

## 🤝 기여하기

프로젝트에 기여하고 싶으신가요? 다음 단계를 따라주세요:

### 기여 워크플로우

1. **Fork** - 이 저장소를 Fork 합니다
2. **Branch** - Feature 브랜치를 생성합니다
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** - 변경사항을 커밋합니다
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
4. **Push** - 브랜치에 Push 합니다
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Pull Request** - Pull Request를 생성합니다

### 커밋 메시지 규칙

우리는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다:

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 변경
- `style:` 코드 포맷팅
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가
- `chore:` 기타 변경사항

---

## 📝 라이선스

이 프로젝트는 **학습 목적**으로 만들어졌습니다.
Educational use only.

---

## 📧 문의 및 지원

<div align="center">

프로젝트에 대한 질문이나 제안사항이 있으시면:

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/murasakijyuutann/cafe-kiosk/issues)

</div>

---

<div align="center">

### ⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!

Made with ❤️ by Cafe Kiosk Team

</div>
