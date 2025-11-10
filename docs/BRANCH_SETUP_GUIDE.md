# Branch Setup Guide - Step by Step

## 🎯 Goal

Create a branch structure for 5 team members:

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

## 📋 Step 1: Commit Current Changes (Team Leader)

First, save your current work:

```bash
# Navigate to project directory
cd c:/Users/rwoo1/Documents/VSCodeProjects/cafe-kiosk

# Check what's changed
git status

# Add all files
git add .

# Commit with message
git commit -m "docs: Add project documentation and guides"

# Push to main
git push origin main
```

---

## 📋 Step 2: Create develop Branch (Team Leader)

The `develop` branch is where all team members will merge their work:

```bash
# Make sure you're on main
git checkout main

# Create develop branch from main
git checkout -b develop

# Push develop to remote
git push -u origin develop

# Verify it was created
git branch -a
```

You should see:
```
* develop
  main
  remotes/origin/develop
  remotes/origin/main
```

---

## 📋 Step 3: Create Feature Branches (Team Leader)

Now create a branch for each team member:

```bash
# Make sure you're on develop
git checkout develop

# Create branch for Team Member 1 (Database)
git checkout -b feature/database
git push -u origin feature/database
git checkout develop

# Create branch for Team Member 2 (Service)
git checkout -b feature/service
git push -u origin feature/service
git checkout develop

# Create branch for Team Member 3 (Controller)
git checkout -b feature/controller
git push -u origin feature/controller
git checkout develop

# Create branch for Team Member 4 (Frontend Menu)
git checkout -b feature/frontend-menu
git push -u origin feature/frontend-menu
git checkout develop

# Create branch for Team Member 5 (Frontend Cart)
git checkout -b feature/frontend-cart
git push -u origin feature/frontend-cart
git checkout develop
```

---

## 📋 Step 4: Verify All Branches

Check that all branches were created:

```bash
# List all branches (local and remote)
git branch -a
```

You should see:
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

## 👥 For Each Team Member: Getting Started

Each team member should follow these steps:

### Team Member Setup

```bash
# 1. Clone the repository (first time only)
git clone https://github.com/YOUR-USERNAME/cafe-kiosk.git
cd cafe-kiosk

# 2. Check available branches
git branch -a

# 3. Switch to YOUR assigned branch
# Team Member 1:
git checkout feature/database

# Team Member 2:
git checkout feature/service

# Team Member 3:
git checkout feature/controller

# Team Member 4:
git checkout feature/frontend-menu

# Team Member 5:
git checkout feature/frontend-cart

# 4. Verify you're on the correct branch
git branch
```

---

## 💻 Daily Workflow for Team Members

### Starting Work Each Day

```bash
# 1. Go to your branch
git checkout feature/database  # (use your branch name)

# 2. Get latest changes from develop
git pull origin develop

# 3. Start coding!
```

### Saving Your Work

```bash
# 1. Check what you changed
git status

# 2. Add files
git add .
# or add specific files:
# git add src/main/java/com/cafekiosk/model/Category.java

# 3. Commit with message
git commit -m "feat: Add Category entity"

# 4. Push to your branch
git push origin feature/database  # (use your branch name)
```

---

## 🔀 Creating a Pull Request

When you finish a task:

### 1. Push Your Final Changes
```bash
git add .
git commit -m "feat: Complete database entities"
git push origin feature/database
```

### 2. Go to GitHub
1. Navigate to: `https://github.com/YOUR-USERNAME/cafe-kiosk`
2. You'll see a yellow banner: **"Compare & pull request"**
3. Click it

### 3. Fill Out PR Form
```
Title: [DB] Add Entity Classes and Repositories

Description:
## Changes
- Added Category entity
- Added MenuItem entity
- Added Order entity
- Added OrderItem entity
- Added Repository interfaces

## Checklist
- [x] Code compiles
- [x] Tested locally
- [ ] Tests written (next PR)

## Screenshots (if applicable)
N/A
```

### 4. Set Base and Compare
- **base:** `develop` ← **compare:** `feature/database`

### 5. Request Reviewers
- Select 1-2 team members to review

### 6. Create Pull Request
Click **"Create pull request"**

---

## 🔍 Reviewing a Pull Request

When a teammate asks you to review:

### 1. Go to Pull Requests Tab
`https://github.com/YOUR-USERNAME/cafe-kiosk/pulls`

### 2. Click on the PR

### 3. Review the Code
- Click **"Files changed"** tab
- Read through the code
- Click on line numbers to add comments

### 4. Submit Review
- Click **"Review changes"** button
- Choose:
  - ✅ **Approve** - Looks good!
  - 💬 **Comment** - Just leaving feedback
  - 🔄 **Request changes** - Needs fixes

---

## ✅ Merging a Pull Request (Team Leader)

After PR is approved:

### 1. Check Requirements
- [ ] At least 1 approval
- [ ] No merge conflicts
- [ ] All discussions resolved

### 2. Merge
1. Click **"Merge pull request"**
2. Click **"Confirm merge"**
3. Optionally: Click **"Delete branch"** (remote only, keeps local)

### 3. Update Local develop
```bash
git checkout develop
git pull origin develop
```

---

## 🚨 Troubleshooting

### Problem: "Branch already exists"

```bash
# Delete local branch
git branch -d feature/database

# Delete remote branch
git push origin --delete feature/database

# Recreate it
git checkout develop
git checkout -b feature/database
git push -u origin feature/database
```

### Problem: "Your branch is behind"

```bash
git pull origin develop
```

### Problem: Merge Conflicts

```bash
# 1. Pull latest develop
git checkout develop
git pull origin develop

# 2. Go to your branch
git checkout feature/database

# 3. Merge develop into your branch
git merge develop

# 4. If conflicts, open the files and fix them
# Look for:
# <<<<<<< HEAD
# your code
# =======
# their code
# >>>>>>> develop

# 5. After fixing
git add .
git commit -m "chore: Resolve merge conflicts"
git push
```

### Problem: Accidentally Committed to Wrong Branch

```bash
# 1. Note the commit hash
git log --oneline

# 2. Go to correct branch
git checkout feature/database

# 3. Cherry-pick the commit
git cherry-pick <commit-hash>

# 4. Go back to wrong branch
git checkout develop

# 5. Remove the commit
git reset --hard HEAD~1
```

---

## 📊 Checking Branch Status

### See All Branches
```bash
git branch -a
```

### See Current Branch
```bash
git branch
```

### See Branch History
```bash
git log --oneline --graph --all
```

### See Who's Working on What
```bash
git branch -r
```

---

## 🎓 Quick Reference Commands

| Action | Command |
|--------|---------|
| Check current branch | `git branch` |
| Switch branch | `git checkout <branch-name>` |
| Create & switch branch | `git checkout -b <new-branch>` |
| Update from develop | `git pull origin develop` |
| Push to your branch | `git push origin <branch-name>` |
| See all changes | `git status` |
| See commit history | `git log --oneline` |
| Undo unstaged changes | `git checkout -- <file>` |
| See remote branches | `git branch -r` |

---

## ✨ Best Practices

### ✅ DO:
- Pull from develop before starting work each day
- Commit small, logical changes frequently
- Write clear commit messages
- Test your code before pushing
- Review teammate's PRs promptly
- Ask for help when stuck

### ❌ DON'T:
- Don't commit directly to `main` or `develop`
- Don't push broken code
- Don't commit `.env` files or passwords
- Don't force push (`git push --force`) unless absolutely necessary
- Don't merge your own PR (let team leader do it)
- Don't leave PR reviews pending for days

---

## 📅 Team Workflow Timeline

### Week 1: Database (Team Member 1)
```bash
feature/database → PR → develop
```

### Week 2: Service (Team Member 2)
```bash
# First, get Team Member 1's work
git checkout develop
git pull origin develop

# Then work on your branch
git checkout feature/service
git merge develop  # Get database entities
# ... do your work ...
feature/service → PR → develop
```

### Week 3: Controller (Team Member 3)
```bash
# Get Team Members 1 & 2's work
git checkout develop
git pull origin develop

git checkout feature/controller
git merge develop  # Get entities and services
# ... do your work ...
feature/controller → PR → develop
```

### Week 4-5: Frontend (Team Members 4 & 5) - Parallel
```bash
# Both can work simultaneously!
# Team Member 4:
git checkout feature/frontend-menu

# Team Member 5:
git checkout feature/frontend-cart
```

---

## 🎯 Summary

1. **Team Leader** creates all branches once
2. **Each team member** works on their assigned branch
3. **Daily**: Pull from develop, work, commit, push
4. **When done**: Create Pull Request to develop
5. **Team reviews** and approves
6. **Team Leader** merges to develop
7. **Repeat!**

---

## 🆘 Getting Help

- Check GitHub documentation: https://docs.github.com
- Ask team members
- Check the [GitHub Collaboration Guide](./CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md)

**Good luck! 🚀**
