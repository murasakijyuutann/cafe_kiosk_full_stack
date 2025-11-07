# GitHub 협업 가이드 - 카페 키오스크 프로젝트 (5인 팀)

## 📚 목차

1. [Git 기본 개념](#git-기본-개념)
2. [초기 설정](#초기-설정)
3. [브랜치 전략](#브랜치-전략)
4. [작업 흐름](#작업-흐름)
5. [충돌 해결](#충돌-해결)
6. [팀원별 작업 가이드](#팀원별-작업-가이드)
7. [주의사항](#주의사항)
8. [유용한 명령어](#유용한-명령어)

---

## Git 기본 개념

### Git이란?

- **버전 관리 시스템**: 코드의 변경 이력을 추적
- **협업 도구**: 여러 명이 동시에 작업 가능
- **백업**: 코드를 안전하게 저장

### 주요 용어

| 용어 | 설명 |
|------|------|
| **Repository (저장소)** | 프로젝트 파일과 변경 이력이 저장되는 공간 |
| **Commit** | 변경사항을 저장하는 단위 |
| **Branch** | 독립적인 작업 공간 |
| **Merge** | 브랜치를 합치는 작업 |
| **Pull Request (PR)** | 코드 리뷰 요청 |
| **Clone** | 원격 저장소를 로컬로 복사 |
| **Push** | 로컬 변경사항을 원격으로 업로드 |
| **Pull** | 원격 변경사항을 로컬로 다운로드 |

---

## 초기 설정

### 1. Git 설치 확인

```bash
git --version
```

설치되지 않았다면: [https://git-scm.com/](https://git-scm.com/)

---

### 2. Git 사용자 설정

```bash
# 이름 설정
git config --global user.name "Your Name"

# 이메일 설정 (GitHub 이메일과 동일하게)
git config --global user.email "your.email@example.com"

# 설정 확인
git config --list
```

---

### 3. GitHub 저장소 생성 (팀 리더)

1. GitHub 로그인
2. **New Repository** 클릭
3. 설정:
   ```
   Repository name: cafe-kiosk
   Description: 카페 키오스크 프로젝트
   Public/Private: Private (팀 프로젝트)
   Add a README: ✓ 체크
   Add .gitignore: Java
   ```
4. **Create repository** 클릭

---

### 4. 팀원 초대 (팀 리더)

1. 저장소 페이지에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Collaborators** 클릭
3. **Add people** 클릭
4. 팀원 GitHub 사용자명 또는 이메일 입력
5. 팀원은 이메일로 받은 초대 수락

---

### 5. 저장소 Clone (모든 팀원)

```bash
# 작업할 폴더로 이동
cd Documents

# 저장소 복제
git clone https://github.com/username/cafe-kiosk.git

# 프로젝트 폴더로 이동
cd cafe-kiosk
```

---

## 브랜치 전략

### 브랜치 구조

```
main (메인 브랜치 - 배포용)
├── develop (개발 브랜치 - 통합용)
    ├── feature/database (팀원 1)
    ├── feature/service (팀원 2)
    ├── feature/controller (팀원 3)
    ├── feature/frontend-menu (팀원 4)
    └── feature/frontend-cart (팀원 5)
```

---

### 브랜치 이름 규칙

| 브랜치 타입 | 이름 예시 | 용도 |
|-------------|-----------|------|
| `feature/` | `feature/database` | 새 기능 개발 |
| `bugfix/` | `bugfix/cart-error` | 버그 수정 |
| `hotfix/` | `hotfix/critical-bug` | 긴급 수정 |

---

## 작업 흐름

### 전체 프로세스

```
1. develop 브랜치에서 시작
2. 자신의 feature 브랜치 생성
3. 작업 진행
4. Commit
5. Push
6. Pull Request 생성
7. 코드 리뷰
8. Merge
9. 반복
```

---

### Step 1: 저장소 최신 상태 유지

```bash
# develop 브랜치로 이동
git checkout develop

# 최신 변경사항 가져오기
git pull origin develop
```

**중요:** 작업 시작 전 항상 최신 코드를 받아야 합니다!

---

### Step 2: Feature 브랜치 생성

```bash
# develop 브랜치에서 새 브랜치 생성
git checkout -b feature/database

# 브랜치 확인
git branch
```

**브랜치 이름 예시:**
- 팀원 1 (DB): `feature/database`
- 팀원 2 (Service): `feature/service`
- 팀원 3 (Controller): `feature/controller`
- 팀원 4 (Frontend): `feature/frontend-menu`
- 팀원 5 (Frontend): `feature/frontend-cart`

---

### Step 3: 작업 진행

```bash
# 파일 수정 또는 생성
# 예: Category.java 작성

# 현재 상태 확인
git status
```

---

### Step 4: 변경사항 Commit

```bash
# 변경된 파일 스테이징
git add src/main/java/com/cafekiosk/model/Category.java

# 또는 모든 변경사항 스테이징
git add .

# 커밋 메시지와 함께 커밋
git commit -m "feat: Category 엔티티 추가"
```

---

### Commit 메시지 규칙

**형식:**
```
<타입>: <제목>

<본문 (선택사항)>
```

**타입 종류:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 설정 변경

**예시:**
```bash
git commit -m "feat: Category 엔티티 추가"
git commit -m "fix: 장바구니 총액 계산 오류 수정"
git commit -m "docs: README에 설치 방법 추가"
```

---

### Step 5: 원격 저장소로 Push

```bash
# 처음 push할 때 (-u로 upstream 설정)
git push -u origin feature/database

# 이후부터는
git push
```

---

### Step 6: Pull Request (PR) 생성

1. GitHub 저장소 페이지 접속
2. **Pull requests** 탭 클릭
3. **New pull request** 클릭
4. 설정:
   ```
   base: develop ← compare: feature/database
   ```
5. PR 제목과 설명 작성:
   ```
   제목: [DB] Category, MenuItem 엔티티 추가

   설명:
   - Category 엔티티 작성 완료
   - MenuItem 엔티티 작성 완료
   - Repository 인터페이스 추가

   체크리스트:
   - [x] Category.java
   - [x] MenuItem.java
   - [x] CategoryRepository.java
   - [ ] 테스트 작성 (다음 PR)
   ```
6. **Create pull request** 클릭
7. 팀원을 **Reviewers**로 지정

---

### Step 7: 코드 리뷰

**리뷰어 (다른 팀원):**

1. PR 페이지에서 **Files changed** 탭 클릭
2. 코드 검토
3. 피드백이 있으면:
   - 해당 라인에 마우스 오버 → **+** 버튼 클릭
   - 코멘트 작성
   - **Start a review** 클릭
4. 리뷰 완료 후:
   - **Review changes** 클릭
   - 선택:
     - **Approve**: 승인
     - **Request changes**: 수정 요청
     - **Comment**: 의견만 남김

**작성자:**

1. 피드백 확인
2. 수정 필요 시:
   ```bash
   # 코드 수정
   git add .
   git commit -m "fix: 리뷰 피드백 반영"
   git push
   ```
3. PR이 자동으로 업데이트됨

---

### Step 8: Merge

**조건:**
- 최소 1명 이상의 승인
- 충돌 없음
- 테스트 통과 (설정한 경우)

**Merge 방법:**

1. PR 페이지에서 **Merge pull request** 클릭
2. **Confirm merge** 클릭
3. 브랜치 삭제 (선택사항)

---

### Step 9: 로컬 정리

```bash
# develop 브랜치로 이동
git checkout develop

# 최신 변경사항 받기
git pull origin develop

# 작업 완료된 브랜치 삭제 (선택사항)
git branch -d feature/database
```

---

## 충돌 해결

### 충돌이란?

같은 파일의 같은 부분을 여러 사람이 수정했을 때 발생합니다.

---

### 충돌 발생 시나리오

```
팀원 1: application.yml 수정 → Push
팀원 2: application.yml 수정 → Push 시도 → 충돌!
```

---

### 충돌 해결 방법

**1. 최신 코드 받기:**
```bash
git pull origin develop
```

**2. 충돌 파일 확인:**
```bash
git status
```

**3. 충돌 파일 열기:**
```java
<<<<<<< HEAD
// 내 코드
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cafe_kiosk
=======
// 다른 사람 코드
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/my_db
>>>>>>> feature/other-branch
```

**4. 수동으로 수정:**
```java
// 최종 코드 (둘 다 반영)
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cafe_kiosk
```

**5. Commit:**
```bash
git add application.yml
git commit -m "chore: merge conflict 해결"
git push
```

---

### 충돌 예방 방법

1. ✅ 자주 Pull 받기
2. ✅ 작은 단위로 Commit
3. ✅ 같은 파일 동시 수정 피하기
4. ✅ 작업 전 팀원과 소통

---

## 팀원별 작업 가이드

### 팀 리더 (전체 관리)

**역할:**
- 저장소 생성
- 팀원 초대
- PR 리뷰 및 Merge
- 브랜치 관리

**초기 설정:**
```bash
# 저장소 생성 후 초기 브랜치 구조 만들기
git clone https://github.com/username/cafe-kiosk.git
cd cafe-kiosk

# develop 브랜치 생성
git checkout -b develop
git push -u origin develop

# .gitignore 추가
echo "target/
.env
*.log
.idea/
*.iml
.DS_Store
node_modules/
dist/" > .gitignore

git add .gitignore
git commit -m "chore: .gitignore 추가"
git push
```

---

### 팀원 1: 데이터베이스 계층

**브랜치:** `feature/database`

**작업 흐름:**
```bash
# 1. develop에서 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/database

# 2. 작업
# - Category.java 작성
# - MenuItem.java 작성
# - Order.java 작성
# - OrderItem.java 작성
# - Repository 인터페이스 작성

# 3. 커밋
git add src/main/java/com/cafekiosk/model/
git commit -m "feat: Entity 클래스 추가 (Category, MenuItem, Order, OrderItem)"

git add src/main/java/com/cafekiosk/repository/
git commit -m "feat: Repository 인터페이스 추가"

# 4. Push
git push -u origin feature/database

# 5. GitHub에서 PR 생성
# base: develop ← compare: feature/database
```

---

### 팀원 2: 비즈니스 로직

**브랜치:** `feature/service`

**작업 흐름:**
```bash
# 1. 팀원 1의 작업이 develop에 merge된 후 시작
git checkout develop
git pull origin develop
git checkout -b feature/service

# 2. 작업
# - DTO 작성
# - Service 작성

# 3. 커밋
git add src/main/java/com/cafekiosk/dto/
git commit -m "feat: DTO 클래스 추가 (CartItem, OrderRequest, OrderResponse)"

git add src/main/java/com/cafekiosk/service/
git commit -m "feat: Service 클래스 추가 (MenuService, CartService, OrderService)"

# 4. Push & PR
git push -u origin feature/service
```

**주의:** 팀원 1의 Entity 클래스가 필요하므로, develop에 merge된 후 작업 시작!

---

### 팀원 3: 컨트롤러

**브랜치:** `feature/controller`

**작업 흐름:**
```bash
# 1. 팀원 2의 작업이 develop에 merge된 후 시작
git checkout develop
git pull origin develop
git checkout -b feature/controller

# 2. 작업
# - Controller 작성
# - Exception Handler 작성

# 3. 커밋
git add src/main/java/com/cafekiosk/controller/
git commit -m "feat: Controller 추가 (Menu, Cart, Order)"

git add src/main/java/com/cafekiosk/exception/
git commit -m "feat: Exception Handler 추가"

# 4. Push & PR
git push -u origin feature/controller
```

---

### 팀원 4: 프론트엔드 (메뉴)

**브랜치:** `feature/frontend-menu`

**작업 흐름:**
```bash
# 1. React 프로젝트 폴더로 이동
cd frontend
git checkout develop
git pull origin develop
git checkout -b feature/frontend-menu

# 2. 작업
# - MenuPage.jsx
# - MenuItem.jsx
# - CategoryFilter.jsx

# 3. 커밋
git add src/components/menu/
git commit -m "feat: 메뉴 컴포넌트 추가"

git add src/pages/MenuPage.jsx
git commit -m "feat: 메뉴 페이지 추가"

# 4. Push & PR
git push -u origin feature/frontend-menu
```

---

### 팀원 5: 프론트엔드 (장바구니)

**브랜치:** `feature/frontend-cart`

**작업 흐름:**
```bash
cd frontend
git checkout develop
git pull origin develop
git checkout -b feature/frontend-cart

# 작업
# - CartPage.jsx
# - Cart.jsx
# - CartItem.jsx

git add src/components/cart/
git commit -m "feat: 장바구니 컴포넌트 추가"

git add src/pages/CartPage.jsx
git commit -m "feat: 장바구니 페이지 추가"

git push -u origin feature/frontend-cart
```

---

## 주의사항

### ⚠️ 절대 하지 말아야 할 것

1. **main 브랜치에 직접 Push 금지**
   ```bash
   # ❌ 절대 안 됨!
   git checkout main
   git push origin main
   ```

2. **민감한 정보 커밋 금지**
   - `.env` 파일
   - 데이터베이스 비밀번호
   - API 키

3. **node_modules, target 폴더 커밋 금지**
   - `.gitignore`에 추가

4. **큰 바이너리 파일 커밋 피하기**
   - 이미지, 동영상은 최소화

---

### ✅ 권장 사항

1. **자주 Commit**
   - 작은 단위로 자주 커밋

2. **명확한 커밋 메시지**
   ```bash
   # ✅ 좋은 예
   git commit -m "feat: 장바구니 총액 계산 기능 추가"

   # ❌ 나쁜 예
   git commit -m "수정"
   ```

3. **작업 전 Pull**
   ```bash
   git checkout develop
   git pull origin develop
   ```

4. **PR 전 테스트**
   ```bash
   # 백엔드
   mvn test
   mvn spring-boot:run

   # 프론트엔드
   npm run build
   npm run dev
   ```

---

## 유용한 명령어

### 기본 명령어

```bash
# 현재 상태 확인
git status

# 변경 이력 확인
git log

# 간단한 로그
git log --oneline

# 브랜치 목록
git branch

# 브랜치 이동
git checkout <branch-name>

# 브랜치 생성 및 이동
git checkout -b <new-branch>

# 브랜치 삭제
git branch -d <branch-name>
```

---

### 되돌리기

```bash
# 작업 디렉토리 변경사항 취소 (staged 안 된 것)
git checkout -- <file>

# Staging 취소
git reset HEAD <file>

# 마지막 커밋 수정 (메시지만)
git commit --amend

# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 취소 (변경사항 삭제 - 위험!)
git reset --hard HEAD~1
```

---

### 원격 저장소

```bash
# 원격 저장소 확인
git remote -v

# 원격 브랜치 목록
git branch -r

# 원격 브랜치 가져오기 (merge 안 함)
git fetch origin

# 원격 브랜치 가져오기 (merge)
git pull origin develop

# 특정 브랜치 push
git push origin feature/database
```

---

### Stash (임시 저장)

```bash
# 현재 작업 임시 저장
git stash

# 임시 저장 목록
git stash list

# 임시 저장 복원
git stash pop

# 임시 저장 삭제
git stash drop
```

**사용 예시:**
```bash
# 작업 중인데 긴급하게 다른 브랜치로 이동해야 할 때
git stash
git checkout develop
# ... 다른 작업
git checkout feature/database
git stash pop
```

---

## 일일 작업 체크리스트

### 작업 시작 시

- [ ] `git checkout develop`
- [ ] `git pull origin develop`
- [ ] `git checkout -b feature/my-feature` (새 기능) 또는 `git checkout feature/my-feature` (기존)
- [ ] `git pull origin develop` (최신 변경사항 확인)

### 작업 중

- [ ] 자주 저장하고 테스트
- [ ] 작은 단위로 커밋
- [ ] 커밋 메시지 명확하게 작성

### 작업 완료 시

- [ ] 테스트 실행
- [ ] `git add .`
- [ ] `git commit -m "적절한 메시지"`
- [ ] `git push origin feature/my-feature`
- [ ] GitHub에서 PR 생성
- [ ] 팀원에게 리뷰 요청

---

## 팀 회의 규칙

### 주간 회의 (매주 월요일)

- 지난주 작업 리뷰
- 이번주 목표 설정
- develop 브랜치 상태 확인
- 충돌 가능성 체크

### 일일 스탠드업 (매일 10분)

- 어제 한 일
- 오늘 할 일
- 장애물/어려움

### 코드 리뷰 규칙

- PR은 24시간 내 리뷰
- 최소 1명 이상 승인 필요
- 건설적인 피드백
- 칭찬도 함께!

---

## 실전 예제

### 시나리오 1: 첫 작업 시작

```bash
# 1. 저장소 복제
git clone https://github.com/username/cafe-kiosk.git
cd cafe-kiosk

# 2. develop 브랜치 확인
git checkout develop
git pull origin develop

# 3. 작업 브랜치 생성
git checkout -b feature/database

# 4. 파일 작성 (Category.java)

# 5. 커밋
git add src/main/java/com/cafekiosk/model/Category.java
git commit -m "feat: Category 엔티티 추가"

# 6. Push
git push -u origin feature/database

# 7. GitHub에서 PR 생성
```

---

### 시나리오 2: 다른 팀원 코드 가져오기

```bash
# 1. develop 브랜치로 이동
git checkout develop

# 2. 최신 코드 받기
git pull origin develop

# 3. 내 브랜치로 이동
git checkout feature/service

# 4. develop의 변경사항 가져오기
git merge develop

# 또는 rebase (더 깔끔한 히스토리)
git rebase develop

# 5. 충돌 해결 (있다면)
# ... 충돌 수정 ...
git add .
git rebase --continue

# 6. Push
git push
```

---

### 시나리오 3: 실수로 잘못된 파일 커밋

```bash
# 1. 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 2. 잘못된 파일 제거
git reset HEAD .env

# 3. .gitignore에 추가
echo ".env" >> .gitignore

# 4. 올바른 파일만 다시 커밋
git add src/
git commit -m "feat: 기능 추가"

# 5. Push (force 필요 - 조심!)
git push --force
```

---

## 트러블슈팅

### 문제 1: Push가 안 됨

```bash
# 에러: Updates were rejected because the remote contains work
```

**해결:**
```bash
git pull origin feature/database
# 충돌 해결 (있다면)
git push
```

---

### 문제 2: 브랜치를 잘못 만듦

```bash
# main에서 브랜치를 만들어버림!
```

**해결:**
```bash
# develop에서 다시 브랜치 생성
git checkout develop
git checkout -b feature/database

# 변경사항 가져오기
git cherry-pick <commit-hash>
```

---

### 문제 3: 커밋 메시지 오타

```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "올바른 메시지"

# Push (이미 push했다면 force 필요)
git push --force
```

---

## 추가 리소스

### 학습 자료

- **Git 공식 문서**: [https://git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Guides**: [https://guides.github.com/](https://guides.github.com/)
- **Visualizing Git**: [https://git-school.github.io/visualizing-git/](https://git-school.github.io/visualizing-git/)
- **Learn Git Branching**: [https://learngitbranching.js.org/](https://learngitbranching.js.org/)

### 도구

- **GitHub Desktop**: GUI 기반 Git 클라이언트
- **GitKraken**: 시각적인 Git 클라이언트
- **VS Code Git Extension**: VS Code 내장 Git 기능

---

## 마무리

이 가이드를 따라하면 5명의 팀원이 효과적으로 협업할 수 있습니다!

### 핵심 원칙

1. ✅ **자주 Pull** - 항상 최신 코드 유지
2. ✅ **작은 커밋** - 이해하기 쉽고 되돌리기 쉬움
3. ✅ **명확한 메시지** - 나중에 이력 추적 용이
4. ✅ **적극적인 소통** - 문제가 생기면 즉시 공유
5. ✅ **코드 리뷰** - 서로 배우고 품질 향상

### 연습 권장

실제 프로젝트 시작 전에 **연습 저장소**를 만들어서 한 번씩 연습해보세요!

**화이팅! 🚀**
