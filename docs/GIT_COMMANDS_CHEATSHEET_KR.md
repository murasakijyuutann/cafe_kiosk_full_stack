# Git 명령어 치트시트 - Cafe Kiosk 프로젝트

카페 키오스크 프로젝트에서 자주 사용하는 Git 명령어 모음집입니다.

---

## 📋 목차

- [상태 확인 & 정보](#-상태-확인--정보)
- [브랜치 전환 & 생성](#-브랜치-전환--생성)
- [변경사항 가져오기](#-변경사항-가져오기)
- [스테이징 & 커밋](#-스테이징--커밋)
- [푸시하기](#-푸시하기)
- [병합 & 업데이트](#-병합--업데이트)
- [브랜치 관리](#-브랜치-관리)
- [변경사항 보기](#-변경사항-보기)
- [되돌리기](#-되돌리기)
- [임시 저장](#-임시-저장-stash)
- [원격 저장소 관리](#-원격-저장소-관리)
- [고급 기능](#-고급-기능)
- [일상 작업 조합](#-일상-작업-조합)
- [Git 별칭 설정](#-git-별칭-설정)
- [긴급 명령어](#-긴급-명령어)
- [팀 워크플로우](#-팀-워크플로우)

---

## 📊 상태 확인 & 정보

### 기본 상태 확인
```bash
# 현재 상태 확인
git status

# 현재 브랜치 보기
git branch

# 모든 브랜치 보기 (로컬 + 원격)
git branch -a

# 원격 브랜치만 보기
git branch -r

# 마지막 커밋 정보와 함께 브랜치 보기
git branch -v
git branch -vv                    # 추적 정보 포함
```

### 커밋 히스토리 보기
```bash
# 커밋 히스토리 보기
git log

# 한 줄로 보기
git log --oneline

# 브랜치 트리 보기 (가장 유용!)
git log --oneline --graph --all --decorate

# 최근 10개 커밋만 보기
git log --oneline -n 10

# 특정 파일의 히스토리 보기
git log --follow -- <파일명>
```

---

## 🔄 브랜치 전환 & 생성

### 브랜치 전환
```bash
# 기존 브랜치로 전환
git checkout develop
git checkout feature/database

# 최신 방식으로 브랜치 전환
git switch develop
```

### 새 브랜치 생성
```bash
# 새 브랜치 생성 및 전환
git checkout -b feature/new-feature

# develop에서 새 브랜치 생성
git checkout develop
git checkout -b feature/new-feature

# 최신 방식
git switch -c feature/new-feature  # 생성 및 전환
```

### 예시: 팀원별 브랜치
```bash
# 팀원 1: 데이터베이스
git checkout -b feature/database

# 팀원 2: 서비스
git checkout -b feature/service

# 팀원 3: 컨트롤러
git checkout -b feature/controller

# 팀원 4: 프론트엔드 메뉴
git checkout -b feature/frontend-menu

# 팀원 5: 프론트엔드 장바구니
git checkout -b feature/frontend-cart
```

---

## 📥 변경사항 가져오기

### 기본 Pull
```bash
# develop에서 최신 변경사항 가져오기
git pull origin develop

# 현재 브랜치에서 가져오기
git pull

# 특정 브랜치에서 가져오기
git pull origin feature/database
```

### Fetch (병합 없이 가져오기)
```bash
# 모든 원격 변경사항 가져오기 (병합하지 않음)
git fetch origin

# Fetch 후 변경사항 확인
git fetch origin
git log HEAD..origin/develop      # 새 커밋 보기

# 모든 원격 저장소에서 가져오기
git fetch --all
```

---

## 💾 스테이징 & 커밋

### 파일 스테이징
```bash
# 모든 변경사항 스테이징
git add .

# 특정 파일만 스테이징
git add src/main/java/com/cafekiosk/model/Category.java
git add src/main/java/com/cafekiosk/model/*.java

# 특정 디렉토리 스테이징
git add backend/src/

# 스테이징 취소
git reset HEAD <파일명>
git restore --staged <파일명>       # 최신 방식
```

### 커밋하기
```bash
# 메시지와 함께 커밋
git commit -m "feat: Add Category entity"
git commit -m "fix: Resolve null pointer in OrderService"

# 모든 추적된 파일 커밋 (스테이징 건너뛰기)
git add . && git commit -m "feat: Complete database layer"
```

### 커밋 메시지 규칙 (Conventional Commits)
```bash
git commit -m "feat: 새로운 기능 추가"
git commit -m "fix: 버그 수정"
git commit -m "docs: 문서 변경"
git commit -m "style: 코드 포맷팅"
git commit -m "refactor: 코드 리팩토링"
git commit -m "test: 테스트 추가"
git commit -m "chore: 기타 변경사항"
```

---

## 📤 푸시하기

### 기본 푸시
```bash
# 자신의 브랜치에 푸시
git push origin feature/database

# 처음 푸시할 때 (upstream 설정)
git push -u origin feature/database

# 현재 브랜치에 푸시
git push
```

### 강제 푸시 (주의!)
```bash
# 강제 푸시 (위험! 신중하게 사용)
git push --force

# 더 안전한 강제 푸시
git push --force-with-lease
```

---

## 🔀 병합 & 업데이트

### 브랜치 병합
```bash
# develop을 현재 브랜치로 병합
git checkout feature/database
git merge develop

# 커밋 메시지와 함께 병합
git merge develop -m "chore: Merge latest develop changes"

# 병합 중단 (충돌 발생 시)
git merge --abort
```

### Rebase (병합의 대안)
```bash
# develop 위에 현재 브랜치 재배치
git rebase develop

# 충돌 해결 후 계속
git rebase --continue

# Rebase 중단
git rebase --abort
```

### 예시: develop 최신 내용 병합
```bash
# 1. develop 업데이트
git checkout develop
git pull origin develop

# 2. 내 브랜치로 돌아가기
git checkout feature/database

# 3. develop 병합
git merge develop

# 4. 충돌 해결 후
git add .
git commit -m "chore: Resolve merge conflicts"
git push origin feature/database
```

---

## 🌿 브랜치 관리

### 브랜치 삭제
```bash
# 로컬 브랜치 삭제 (안전)
git branch -d feature/database

# 로컬 브랜치 강제 삭제
git branch -D feature/database

# 원격 브랜치 삭제
git push origin --delete feature/database
```

### 브랜치 이름 변경
```bash
# 현재 브랜치 이름 변경
git branch -m new-branch-name

# 다른 브랜치 이름 변경
git branch -m old-name new-name
```

### 병합된 브랜치 확인
```bash
# 병합된 브랜치 보기
git branch --merged

# 병합되지 않은 브랜치 보기
git branch --no-merged
```

---

## 🔍 변경사항 보기

### Diff로 차이점 확인
```bash
# 스테이징되지 않은 변경사항 보기
git diff

# 스테이징된 변경사항 보기
git diff --staged
git diff --cached

# 브랜치 간 비교
git diff develop..feature/database

# 특정 파일의 변경사항 보기
git diff README.md
git diff HEAD~1 README.md         # 이전 커밋과 비교
```

### 커밋 상세 정보
```bash
# 특정 커밋 상세 정보
git show <커밋-해시>

# 최근 커밋 보기
git show HEAD

# 특정 브랜치의 파일 내용 보기
git show develop:README.md
```

---

## ⏪ 되돌리기

### 변경사항 취소
```bash
# 파일의 스테이징되지 않은 변경사항 취소
git checkout -- <파일명>
git restore <파일명>                # 최신 방식

# 모든 스테이징되지 않은 변경사항 취소
git checkout -- .
git restore .
```

### 커밋 되돌리기
```bash
# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 취소 (변경사항 삭제)
git reset --hard HEAD~1

# 특정 커밋 되돌리기 (새 커밋 생성)
git revert <커밋-해시>
```

### 추적되지 않는 파일 정리
```bash
# 미리보기
git clean -n

# 파일 삭제
git clean -f

# 파일 및 디렉토리 삭제
git clean -fd
```

---

## 🏷️ 임시 저장 (Stash)

### 작업 임시 저장
```bash
# 현재 작업 임시 저장
git stash

# 메시지와 함께 저장
git stash save "WIP: working on menu page"

# Stash 목록 보기
git stash list
```

### Stash 적용
```bash
# 가장 최근 stash 적용
git stash apply

# 적용 후 stash 삭제
git stash pop

# 특정 stash 적용
git stash apply stash@{0}

# Stash 삭제
git stash drop
git stash clear                   # 모든 stash 삭제
```

---

## 🔗 원격 저장소 관리

### 원격 저장소 확인
```bash
# 원격 저장소 보기
git remote -v

# 원격 저장소 상세 정보
git remote show origin
```

### 원격 저장소 추가/변경
```bash
# 원격 저장소 추가
git remote add origin https://github.com/murasakijyuutann/cafe-kiosk.git

# 원격 저장소 URL 변경
git remote set-url origin <새-URL>
```

### 원격 브랜치 정리
```bash
# 삭제된 원격 브랜치 정리
git fetch --prune
git remote prune origin
```

---

## 🍒 고급 기능

### Cherry-pick (특정 커밋 가져오기)
```bash
# 특정 커밋만 현재 브랜치에 적용
git cherry-pick <커밋-해시>

# 여러 커밋 적용
git cherry-pick <커밋1> <커밋2> <커밋3>
```

### Interactive Rebase
```bash
# 최근 3개 커밋 수정
git rebase -i HEAD~3

# 커밋 합치기, 순서 변경, 메시지 수정 등 가능
```

### Blame (코드 작성자 확인)
```bash
# 파일의 각 줄을 누가 작성했는지 확인
git blame <파일명>

# 특정 줄 범위만 확인
git blame -L 10,20 <파일명>
```

---

## 📋 일상 작업 조합

### 아침 작업 시작
```bash
# 1. develop 업데이트
git checkout develop
git pull origin develop

# 2. 내 브랜치로 전환
git checkout feature/database

# 3. develop 최신 내용 병합
git merge develop

# 4. 작업 시작!
```

### 작업 저장하기
```bash
# 1. 변경사항 확인
git status

# 2. 파일 추가
git add .

# 3. 커밋
git commit -m "feat: Add menu item repository"

# 4. 푸시
git push origin feature/database
```

### Pull Request 준비
```bash
# 1. develop 최신 상태 확인
git checkout develop
git pull origin develop

# 2. 내 브랜치로 전환
git checkout feature/database

# 3. develop 병합 (충돌 해결)
git merge develop

# 4. 푸시
git push origin feature/database

# 5. GitHub에서 PR 생성
# https://github.com/murasakijyuutann/cafe-kiosk/pulls
```

### 실수 수정하기
```bash
# 잘못된 브랜치에 커밋한 경우

# 1. 커밋 해시 확인
git log --oneline -n 1

# 2. 올바른 브랜치로 전환
git checkout correct-branch

# 3. 커밋 가져오기
git cherry-pick <커밋-해시>

# 4. 잘못된 브랜치로 돌아가기
git checkout wrong-branch

# 5. 커밋 제거
git reset --hard HEAD~1
```

---

## 🎨 Git 별칭 설정

### 유용한 별칭 생성
```bash
# 별칭 설정 (한 번만 실행)
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.last 'log -1 HEAD'
git config --global alias.tree 'log --oneline --graph --all --decorate'
git config --global alias.unstage 'reset HEAD --'
```

### 별칭 사용
```bash
git st                           # git status 대신
git co develop                   # git checkout develop 대신
git tree                         # 브랜치 트리 보기
git last                         # 마지막 커밋 보기
git unstage <파일명>             # 스테이징 취소
```

---

## 🚨 긴급 명령어

### 완전히 원격 상태로 리셋
```bash
# 로컬을 원격과 완전히 동일하게 만들기
git fetch origin
git reset --hard origin/develop

# ⚠️ 주의: 모든 로컬 변경사항이 사라집니다!
```

### 잘못된 푸시 되돌리기
```bash
# 아무도 pull 하지 않은 경우만 사용
git reset --hard HEAD~1
git push --force-with-lease

# ⚠️ 주의: 팀원과 상의 후 사용하세요!
```

### 삭제된 브랜치 복구
```bash
# 1. 잃어버린 커밋 찾기
git reflog

# 2. 브랜치 복구
git checkout -b recovered-branch <커밋-해시>
```

### 잃어버린 커밋 찾기
```bash
# Reflog로 모든 기록 확인
git reflog

# 손상된 객체 찾기
git fsck --lost-found
```

---

## 👥 팀 워크플로우

### 팀 리더 - PR 관리
```bash
# 모든 팀원의 브랜치 확인
git branch -r

# PR을 로컬에서 테스트
git fetch origin
git checkout -b test-pr origin/feature/database

# PR 병합 (GitHub 승인 후)
git checkout develop
git pull origin develop
git merge --no-ff feature/database
git push origin develop

# 브랜치 삭제 (선택사항)
git push origin --delete feature/database
```

### 팀원 - 일상 작업
```bash
# 아침 루틴
git checkout feature/database
git fetch origin
git merge origin/develop          # develop 최신 내용 가져오기

# 저녁 루틴
git add .
git commit -m "feat: Complete category CRUD"
git push origin feature/database

# develop 업데이트 확인
git fetch origin
git log HEAD..origin/develop      # 새로운 내용 확인
```

---

## 📊 검사 명령어

### 브랜치 분기 확인
```bash
# 브랜치 간 차이 시각화
git log --oneline --graph feature/database develop

# 추적되는 모든 파일 나열
git ls-files

# 커밋 통계
git shortlog -sn                  # 작성자별 커밋 수

# 파일 히스토리 추적
git log --follow -- <파일명>
```

---

## 🎯 빠른 참조표

| 작업 | 명령어 |
|------|--------|
| 현재 브랜치 확인 | `git branch` |
| 브랜치 전환 | `git checkout <브랜치명>` |
| 브랜치 생성 및 전환 | `git checkout -b <새-브랜치>` |
| develop에서 업데이트 | `git pull origin develop` |
| 자신의 브랜치에 푸시 | `git push origin <브랜치명>` |
| 모든 변경사항 보기 | `git status` |
| 커밋 히스토리 보기 | `git log --oneline` |
| 변경사항 취소 | `git checkout -- <파일명>` |
| 원격 브랜치 보기 | `git branch -r` |
| 브랜치 트리 보기 | `git log --oneline --graph --all` |

---

## 💡 모범 사례

### ✅ 해야 할 것

1. **매일 작업 전 develop에서 pull 하기**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **작고 논리적인 단위로 자주 커밋하기**
   ```bash
   git add .
   git commit -m "feat: Add Category entity fields"
   ```

3. **명확한 커밋 메시지 작성하기**
   ```bash
   # 좋은 예
   git commit -m "feat: Add user authentication API"

   # 나쁜 예
   git commit -m "update"
   ```

4. **푸시하기 전에 코드 테스트하기**
   ```bash
   # 백엔드 테스트
   mvn test

   # 프론트엔드 테스트
   npm run test
   ```

5. **팀원의 PR 신속하게 검토하기**

6. **막혔을 때 도움 요청하기**

### ❌ 하지 말아야 할 것

1. **`main` 또는 `develop`에 직접 커밋하지 않기**
   ```bash
   # 절대 하지 마세요!
   git checkout develop
   git add .
   git commit -m "changes"
   ```

2. **깨진 코드를 푸시하지 않기**

3. **`.env` 파일이나 비밀번호를 커밋하지 않기**
   ```bash
   # .gitignore에 추가하세요
   .env
   .env.local
   *.log
   ```

4. **불필요한 강제 푸시 하지 않기**
   ```bash
   # 피하세요!
   git push --force
   ```

5. **자신의 PR을 직접 병합하지 않기** (팀 리더가 담당)

6. **PR 검토를 며칠 동안 방치하지 않기**

---

## 🔧 문제 해결

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
# develop에서 최신 내용 가져오기
git pull origin develop
```

### 문제: 병합 충돌
```bash
# 1. develop 최신 상태로 업데이트
git checkout develop
git pull origin develop

# 2. 자신의 브랜치로 전환
git checkout feature/database

# 3. develop 병합
git merge develop

# 4. 충돌 표시 확인
# <<<<<<< HEAD
# 내 코드
# =======
# 상대방 코드
# >>>>>>> develop

# 5. 충돌 해결 후
git add .
git commit -m "chore: Resolve merge conflicts"
git push
```

### 문제: 실수로 잘못된 브랜치에 커밋
```bash
# 위의 "실수 수정하기" 섹션 참조
# cherry-pick을 사용하여 올바른 브랜치로 이동
```

---

## 📚 추가 자료

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub 가이드](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [프로젝트 브랜치 설정 가이드](./BRANCH_SETUP_GUIDE.md)
- [GitHub 협업 가이드](./CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md)

---

## 🆘 도움이 필요하신가요?

- 팀원에게 문의하세요
- [GitHub Issues](https://github.com/murasakijyuutann/cafe-kiosk/issues)를 통해 질문하세요
- Git 공식 문서를 참고하세요

---

<div align="center">

**이 문서를 프린트하거나 북마크하여 빠르게 참조하세요!**

Made with ❤️ by Cafe Kiosk Team

</div>
