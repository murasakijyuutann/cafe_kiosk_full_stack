# 브랜치 설정 가이드 - 단계별 안내

## 🎯 목표

5명의 팀원을 위한 브랜치 구조 생성:

```
main
  └── develop
        ├── feature/database (팀원 1)
        ├── feature/service (팀원 2)
        ├── feature/controller (팀원 3)
        ├── feature/frontend-menu (팀원 4)
        └── feature/frontend-cart (팀원 5)
```

---

## 📋 1단계: 현재 변경사항 커밋하기 (팀 리더)

먼저 현재 작업을 저장하세요:

```bash
# 프로젝트 디렉토리로 이동
cd c:/Users/rwoo1/Documents/VSCodeProjects/cafe-kiosk

# 변경사항 확인
git status

# 모든 파일 추가
git add .

# 메시지와 함께 커밋
git commit -m "docs: Add project documentation and guides"

# main에 푸시
git push origin main
```

---

## 📋 2단계: develop 브랜치 생성하기 (팀 리더)

`develop` 브랜치는 모든 팀원의 작업이 병합되는 곳입니다:

```bash
# main 브랜치에 있는지 확인
git checkout main

# main에서 develop 브랜치 생성
git checkout -b develop

# develop을 원격에 푸시
git push -u origin develop

# 생성되었는지 확인
git branch -a
```

다음과 같이 표시되어야 합니다:
```
* develop
  main
  remotes/origin/develop
  remotes/origin/main
```

---

## 📋 3단계: 기능 브랜치 생성하기 (팀 리더)

이제 각 팀원을 위한 브랜치를 생성합니다:

```bash
# develop 브랜치에 있는지 확인
git checkout develop

# 팀원 1을 위한 브랜치 생성 (데이터베이스)
git checkout -b feature/database
git push -u origin feature/database
git checkout develop

# 팀원 2를 위한 브랜치 생성 (서비스)
git checkout -b feature/service
git push -u origin feature/service
git checkout develop

# 팀원 3을 위한 브랜치 생성 (컨트롤러)
git checkout -b feature/controller
git push -u origin feature/controller
git checkout develop

# 팀원 4를 위한 브랜치 생성 (프론트엔드 메뉴)
git checkout -b feature/frontend-menu
git push -u origin feature/frontend-menu
git checkout develop

# 팀원 5를 위한 브랜치 생성 (프론트엔드 장바구니)
git checkout -b feature/frontend-cart
git push -u origin feature/frontend-cart
git checkout develop
```

---

## 📋 4단계: 모든 브랜치 확인하기

모든 브랜치가 생성되었는지 확인합니다:

```bash
# 모든 브랜치 나열 (로컬 및 원격)
git branch -a
```

다음과 같이 표시되어야 합니다:
```
  develop
  feature/controller
  feature/database
  feature/frontend-cart
  feature/frontend-menu
  feature/service
* main
  remotes/origin/develop
  remotes/origin/feature/controller
  remotes/origin/feature/database
  remotes/origin/feature/frontend-cart
  remotes/origin/feature/frontend-menu
  remotes/origin/feature/service
  remotes/origin/main
```

---

## 👥 각 팀원: 시작하기

각 팀원은 다음 단계를 따라야 합니다:

### 팀원 설정

```bash
# 1. 저장소 클론하기 (처음 한 번만)
git clone https://github.com/murasakijyuutann/cafe-kiosk.git
cd cafe-kiosk

# 2. 사용 가능한 브랜치 확인
git branch -a

# 3. 자신에게 할당된 브랜치로 전환
# 팀원 1:
git checkout feature/database

# 팀원 2:
git checkout feature/service

# 팀원 3:
git checkout feature/controller

# 팀원 4:
git checkout feature/frontend-menu

# 팀원 5:
git checkout feature/frontend-cart

# 4. 올바른 브랜치에 있는지 확인
git branch
```

---

## 💻 팀원을 위한 일일 워크플로우

### 매일 작업 시작하기

```bash
# 1. 자신의 브랜치로 이동
git checkout feature/database  # (자신의 브랜치 이름 사용)

# 2. develop에서 최신 변경사항 가져오기
git pull origin develop

# 3. 코딩 시작!
```

### 작업 저장하기

```bash
# 1. 변경사항 확인
git status

# 2. 파일 추가
git add .
# 또는 특정 파일 추가:
# git add src/main/java/com/cafekiosk/model/Category.java

# 3. 메시지와 함께 커밋
git commit -m "feat: Add Category entity"

# 4. 자신의 브랜치에 푸시
git push origin feature/database  # (자신의 브랜치 이름 사용)
```

---

## 🔀 Pull Request 생성하기

작업을 완료했을 때:

### 1. 최종 변경사항 푸시
```bash
git add .
git commit -m "feat: Complete database entities"
git push origin feature/database
```

### 2. GitHub로 이동
1. 다음으로 이동: `https://github.com/YOUR-USERNAME/cafe-kiosk`
2. 노란색 배너가 표시됩니다: **"Compare & pull request"**
3. 클릭하기

### 3. PR 양식 작성
```
제목: [DB] Add Entity Classes and Repositories

설명:
## 변경사항
- Category 엔티티 추가
- MenuItem 엔티티 추가
- Order 엔티티 추가
- OrderItem 엔티티 추가
- Repository 인터페이스 추가

## 체크리스트
- [x] 코드 컴파일됨
- [x] 로컬 테스트 완료
- [ ] 테스트 작성 (다음 PR)

## 스크린샷 (해당하는 경우)
N/A
```

### 4. Base와 Compare 설정
- **base:** `develop` ← **compare:** `feature/database`

### 5. 리뷰어 요청
- 검토할 팀원 1-2명 선택

### 6. Pull Request 생성
**"Create pull request"** 클릭

---

## 🔍 Pull Request 검토하기

팀원이 검토를 요청했을 때:

### 1. Pull Requests 탭으로 이동
`https://github.com/YOUR-USERNAME/cafe-kiosk/pulls`

### 2. PR 클릭

### 3. 코드 검토
- **"Files changed"** 탭 클릭
- 코드 읽기
- 줄 번호를 클릭하여 코멘트 추가

### 4. 검토 제출
- **"Review changes"** 버튼 클릭
- 선택:
  - ✅ **Approve** - 좋아 보입니다!
  - 💬 **Comment** - 피드백만 남기기
  - 🔄 **Request changes** - 수정 필요

---

## ✅ Pull Request 병합하기 (팀 리더)

PR이 승인된 후:

### 1. 요구사항 확인
- [ ] 최소 1개의 승인
- [ ] 병합 충돌 없음
- [ ] 모든 논의 해결됨

### 2. 병합
1. **"Merge pull request"** 클릭
2. **"Confirm merge"** 클릭
3. 선택사항: **"Delete branch"** 클릭 (원격만, 로컬은 유지)

### 3. 로컬 develop 업데이트
```bash
git checkout develop
git pull origin develop
```

---

## 🚨 문제 해결

### 문제: "Branch already exists"

```bash
# 로컬 브랜치 삭제
git branch -d feature/database

# 원격 브랜치 삭제
git push origin --delete feature/database

# 재생성
git checkout develop
git checkout -b feature/database
git push -u origin feature/database
```

### 문제: "Your branch is behind"

```bash
git pull origin develop
```

### 문제: 병합 충돌

```bash
# 1. 최신 develop 가져오기
git checkout develop
git pull origin develop

# 2. 자신의 브랜치로 이동
git checkout feature/database

# 3. develop을 자신의 브랜치로 병합
git merge develop

# 4. 충돌이 있으면 파일을 열고 수정
# 다음을 찾아보세요:
# <<<<<<< HEAD
# 내 코드
# =======
# 상대방 코드
# >>>>>>> develop

# 5. 수정 후
git add .
git commit -m "chore: Resolve merge conflicts"
git push
```

### 문제: 잘못된 브랜치에 실수로 커밋

```bash
# 1. 커밋 해시 확인
git log --oneline

# 2. 올바른 브랜치로 이동
git checkout feature/database

# 3. 커밋 체리픽
git cherry-pick <commit-hash>

# 4. 잘못된 브랜치로 돌아가기
git checkout develop

# 5. 커밋 제거
git reset --hard HEAD~1
```

---

## 📊 브랜치 상태 확인하기

### 모든 브랜치 보기
```bash
git branch -a
```

### 현재 브랜치 보기
```bash
git branch
```

### 브랜치 히스토리 보기
```bash
git log --oneline --graph --all
```

### 누가 무엇을 작업하는지 보기
```bash
git branch -r
```

---

## 🎓 빠른 참조 명령어

| 작업 | 명령어 |
|------|--------|
| 현재 브랜치 확인 | `git branch` |
| 브랜치 전환 | `git checkout <branch-name>` |
| 브랜치 생성 및 전환 | `git checkout -b <new-branch>` |
| develop에서 업데이트 | `git pull origin develop` |
| 자신의 브랜치에 푸시 | `git push origin <branch-name>` |
| 모든 변경사항 보기 | `git status` |
| 커밋 히스토리 보기 | `git log --oneline` |
| 스테이징되지 않은 변경사항 취소 | `git checkout -- <file>` |
| 원격 브랜치 보기 | `git branch -r` |

---

## ✨ 모범 사례

### ✅ 해야 할 것:
- 매일 작업 시작 전 develop에서 pull하기
- 작고 논리적인 변경사항을 자주 커밋하기
- 명확한 커밋 메시지 작성하기
- 푸시하기 전에 코드 테스트하기
- 팀원의 PR을 신속하게 검토하기
- 막혔을 때 도움 요청하기

### ❌ 하지 말아야 할 것:
- `main` 또는 `develop`에 직접 커밋하지 않기
- 깨진 코드를 푸시하지 않기
- `.env` 파일이나 비밀번호를 커밋하지 않기
- 절대적으로 필요하지 않은 경우 강제 푸시(`git push --force`) 하지 않기
- 자신의 PR을 병합하지 않기 (팀 리더가 하도록 하기)
- PR 검토를 며칠 동안 보류하지 않기

---

## 📅 팀 워크플로우 타임라인

### 1주차: 데이터베이스 (팀원 1)
```bash
feature/database → PR → develop
```

### 2주차: 서비스 (팀원 2)
```bash
# 먼저, 팀원 1의 작업 가져오기
git checkout develop
git pull origin develop

# 그런 다음 자신의 브랜치에서 작업
git checkout feature/service
git merge develop  # 데이터베이스 엔티티 가져오기
# ... 작업 수행 ...
feature/service → PR → develop
```

### 3주차: 컨트롤러 (팀원 3)
```bash
# 팀원 1과 2의 작업 가져오기
git checkout develop
git pull origin develop

git checkout feature/controller
git merge develop  # 엔티티와 서비스 가져오기
# ... 작업 수행 ...
feature/controller → PR → develop
```

### 4-5주차: 프론트엔드 (팀원 4 & 5) - 병렬
```bash
# 둘 다 동시에 작업 가능!
# 팀원 4:
git checkout feature/frontend-menu

# 팀원 5:
git checkout feature/frontend-cart
```

---

## 🎯 요약

1. **팀 리더**가 모든 브랜치를 한 번에 생성
2. **각 팀원**은 자신에게 할당된 브랜치에서 작업
3. **매일**: develop에서 pull, 작업, 커밋, 푸시
4. **완료 시**: develop으로 Pull Request 생성
5. **팀이 검토**하고 승인
6. **팀 리더**가 develop으로 병합
7. **반복!**

---

## 🆘 도움 받기

- GitHub 문서 확인: https://docs.github.com
- 팀원에게 문의
- [GitHub 협업 가이드](./CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md) 확인

**행운을 빕니다! 🚀**
