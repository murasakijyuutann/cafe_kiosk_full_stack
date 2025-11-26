<div align="center">

# ☕ Cafe Kiosk

### 카페 셀프 주문 키오스크 시스템

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Educational-yellow.svg)](LICENSE)

[주요기능](#-주요-기능) • [시작하기](#-시작하기) • [문서](#-문서) • [팀구성](#-팀-구성) • [기여하기](#-기여하기)

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
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) **8.0** (AWS RDS)
- ![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=flat&logo=spring&logoColor=white)
- ![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat&logo=apache-maven&logoColor=white)
- ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat&logo=spring-security&logoColor=white)

</td>
<td width="50%" valign="top">

### Frontend
- ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) **18**
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
- ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat&logo=react-router&logoColor=white) **v6**
- ![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=flat&logo=styled-components&logoColor=white)

</td>
</tr>
<tr>
<td colspan="2" valign="top">

### Infrastructure & Deployment
- ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=flat&logo=amazon-aws&logoColor=white) - Application Server
- ![AWS RDS](https://img.shields.io/badge/AWS%20RDS-527FFF?style=flat&logo=amazon-rds&logoColor=white) - MySQL Database
- ![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=flat&logo=amazon-s3&logoColor=white) - Image Storage
- ![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white) - Web Server & Reverse Proxy

</td>
</tr>
</table>

---

## ✨ 주요 기능

| 기능 | 설명 |
|:---:|------|
| 📋 | **카테고리별 메뉴 조회** - 음료, 디저트 등 카테고리로 분류된 메뉴 탐색 |
| 🖼️ | **S3 이미지 관리** - AWS S3를 통한 메뉴 이미지 호스팅 및 배포 |
| 🛒 | **장바구니 관리** - 실시간 장바구니 추가/삭제 및 수량 조절 |
| 💳 | **주문 생성** - 간편한 주문 프로세스와 주문 번호 발급 |
| 📝 | **주문 내역 확인** - 주문 번호로 주문 상세 정보 조회 |
| 🔒 | **세션 기반 장바구니** - 쿠키와 세션을 활용한 장바구니 상태 유지 |

---

## 🚀 시작하기

### 📋 필수 요구사항

#### Local Development
- ![Java](https://img.shields.io/badge/JDK-21+-orange) Java Development Kit 21 이상
- ![Node.js](https://img.shields.io/badge/Node.js-18+-green) Node.js 18 이상
- ![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue) MySQL 8.0 이상
- ![Maven](https://img.shields.io/badge/Maven-Latest-red) Apache Maven

#### Production (AWS)
- AWS EC2 instance (Ubuntu 20.04+)
- AWS RDS (MySQL 8.0)
- AWS S3 bucket (for images)
- Nginx web server

---

### 📥 로컬 개발 환경 설정

#### 1️⃣ 저장소 클론

```bash
git clone https://github.com/murasakijyuutann/cafe_kiosk_full_stack.git
cd cafe_kiosk_full_stack
```

#### 2️⃣ 데이터베이스 설정

MySQL에 접속하여 데이터베이스를 생성합니다:

```sql
CREATE DATABASE cafedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3️⃣ 환경 변수 설정

Backend에 환경 변수를 설정합니다:

```bash
export DB_URL=jdbc:mysql://localhost:3306/cafedb?useSSL=false&characterEncoding=UTF-8&serverTimezone=UTC
export DB_USERNAME=root
export DB_PASSWORD=your_password
```

#### 4️⃣ 백엔드 실행

```bash
cd backend
./mvnw spring-boot:run
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

### 🌐 프로덕션 배포

프로덕션 환경에 배포하려면 [EC2 Initial Setup Guide](./docs/EC2_INITIAL_SETUP_GUIDE.md)를 참고하세요.

#### 빠른 업데이트 절차 (EC2)

```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

cd ~/cafe_kiosk_full_stack

# Pull latest changes
git pull origin main

# Update frontend
cd frontend
npm run build
sudo cp -r dist/* /var/www/html/

# Update backend (if changed)
cd ../backend
./mvnw clean package -DskipTests
sudo systemctl restart cafe-kiosk-backend
```

---

## 📚 문서

프로젝트 개발에 필요한 자세한 가이드는 [`docs`](./docs/) 폴더를 참고하세요:

### Development Guides
| 문서 | 설명 |
|------|------|
| 📘 [Backend Guide](./docs/CAFE_KIOSK_SIMPLE_GUIDE_KR_자바_데이타베이스.md) | Spring Boot, JPA, Entity 개발 가이드 |
| 📗 [Frontend Guide](./docs/CAFE_KIOSK_REACT_GUIDE_KR_프론트엔드.md) | React, Components, Routing 개발 가이드 |
| 📙 [GitHub Collaboration Guide](./docs/CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md) | Git 워크플로우 및 협업 가이드 |
| 📊 [Branch Strategy Diagram](./docs/CAFE_KIOSK_BRANCH_DIAGRAM.md) | 시각적 브랜치 구조 및 전략 |
| 🔧 [Branch Setup Guide](./docs/BRANCH_SETUP_GUIDE.md) | 브랜치 생성 및 팀원 작업 시작 가이드 |

### Deployment Guides
| 문서 | 설명 |
|------|------|
| ☁️ [**EC2 Initial Setup Guide**](./docs/EC2_INITIAL_SETUP_GUIDE.md) | **AWS EC2 인스턴스 초기 설정 및 배포 가이드** |
| 🖼️ [S3 and RDS Image Setup](./docs/S3_AND_RDS_IMAGE_SETUP_GUIDE.md) | S3 이미지 저장소 및 RDS 연동 가이드 |
| 📋 [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) | 배포 전 체크리스트 |

> 💡 **배포를 처음 시작하는 경우**: [EC2 Initial Setup Guide](./docs/EC2_INITIAL_SETUP_GUIDE.md)를 먼저 확인하세요!

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
<td align="center">👤 <b>이재혁</b></td>
<td>데이터베이스 계층 (Entity, Repository)</td>
<td><code>feature/database</code></td>
</tr>
<tr>
<td align="center">👤 <b>강태성</b></td>
<td>비즈니스 로직 (Service, DTO)</td>
<td><code>feature/service</code></td>
</tr>
<tr>
<td align="center">👤 <b>우선명</b></td>
<td>컨트롤러 (Controller, Exception)</td>
<td><code>feature/controller</code></td>
</tr>
<tr>
<td align="center">👤 <b>문수영</b></td>
<td>프론트엔드 - 메뉴 페이지</td>
<td><code>feature/frontend-menu</code></td>
</tr>
<tr>
<td align="center">👤 <b>김성진</b></td>
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
cafe_kiosk_full_stack/
├── 📁 backend/
│   └── src/main/java/MKSS/backend/
│       ├── 📦 model/          # Entity 클래스 (Category, MenuItem, Order, etc.)
│       ├── 📦 repository/     # JPA Repository
│       ├── 📦 service/        # 비즈니스 로직
│       ├── 📦 controller/     # REST API Controllers
│       ├── 📦 dto/            # 데이터 전송 객체
│       ├── 📦 config/         # 설정 (Security, CORS, Swagger)
│       └── 📦 exception/      # 예외 처리
│
├── 📁 frontend/
│   └── src/
│       ├── 📦 components/     # React 컴포넌트 (Header, Footer, etc.)
│       ├── 📦 pages/          # 페이지 (Home, Menu, Cart, OrderComplete)
│       ├── 📦 api/            # API 호출 (cafekioskApi.ts)
│       ├── 📦 service/        # 서비스 레이어
│       └── 📦 context/        # Context API (CartContext)
│
└── 📁 docs/                   # 프로젝트 문서
    ├── 📄 EC2_INITIAL_SETUP_GUIDE.md
    ├── 📄 S3_AND_RDS_IMAGE_SETUP_GUIDE.md
    ├── 📄 DEPLOYMENT_CHECKLIST.md
    ├── 📄 BRANCH_SETUP_GUIDE.md
    └── 📄 ...
```

---

## 🌐 API 엔드포인트

### 📋 메뉴 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/menu/categories` | 카테고리 목록 조회 |
| `GET` | `/menu/items` | 전체 메뉴 아이템 조회 |
| `GET` | `/menu/items/category/{categoryId}` | 카테고리별 메뉴 조회 |

### 🛒 장바구니 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cart` | 장바구니 조회 |
| `POST` | `/cart/add` | 장바구니에 아이템 추가 |
| `PUT` | `/cart/update/{itemId}` | 장바구니 아이템 수량 변경 |
| `DELETE` | `/cart/remove/{itemId}` | 장바구니 아이템 삭제 |
| `DELETE` | `/cart/clear` | 장바구니 전체 삭제 |

### 📦 주문 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/order/place` | 새 주문 생성 |
| `GET` | `/order/{orderNumber}` | 주문 번호로 주문 상세 조회 |

> 📝 **Note**: Nginx를 통한 배포 시 모든 API는 `/api` prefix를 통해 프록시됩니다.
> 예: `GET /api/menu/categories`

---

## 🏗️ 시스템 아키텍처

### 프로덕션 아키텍처 (AWS)

```
┌─────────────────────────────────────────────────────────────┐
│                         인터넷                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   AWS EC2   │
                    │  (Ubuntu)   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼──────┐  ┌─────▼──────┐
    │   Nginx   │   │  AWS RDS   │  │  AWS S3    │
    │  (Port 80)│   │  (MySQL)   │  │  (이미지)  │
    └─────┬─────┘   └────────────┘  └────────────┘
          │
    ┌─────▼──────────────┐
    │  정적 파일          │
    │  (React 빌드)      │
    └────────────────────┘
          │
    ┌─────▼──────────────┐
    │  Spring Boot       │
    │  (Port 8080)       │
    │  - REST API        │
    │  - 세션 관리       │
    └────────────────────┘
```

### 요청 흐름

1. **프론트엔드 요청**: 사용자가 `http://EC2-IP` 접속 → Nginx가 React 정적 파일 제공
2. **API 요청**: 프론트엔드가 `/api/*` 호출 → Nginx가 Spring Boot(8080 포트)로 프록시
3. **데이터베이스**: Spring Boot가 AWS RDS MySQL 쿼리 실행
4. **이미지**: 메뉴 이미지를 AWS S3에서 로드

### 주요 구성 요소

- **Nginx**: React 빌드 파일을 제공하는 웹 서버 + API 역방향 프록시
- **Spring Boot**: 세션 기반 장바구니 관리를 포함한 백엔드 API
- **AWS RDS**: 메뉴 아이템, 주문, 카테고리 데이터를 저장하는 MySQL 데이터베이스
- **AWS S3**: 메뉴 이미지를 저장하는 객체 스토리지

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
