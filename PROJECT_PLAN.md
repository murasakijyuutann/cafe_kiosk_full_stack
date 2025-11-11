# Cafe Kiosk Project Plan - 4 Week Bootcamp

**Project Duration:** 4 Weeks
**Team Size:** 5 Members
**Target:** Beginner Bootcamp Project
**Submission Date:** [Insert Date]

---

## Executive Summary

### Project Overview
A self-service cafe kiosk web application enabling customers to browse menu items, manage a shopping cart, and complete orders. This full-stack project uses Spring Boot for the backend and React for the frontend, providing hands-on experience with modern web development technologies.

### Learning Objectives
- Build a complete full-stack application from scratch
- Practice team collaboration using Git and GitHub
- Implement RESTful API architecture
- Work with relational database design (MySQL)
- Develop responsive frontend interfaces with React
- Apply Agile development methodologies

### Project Scope
**In Scope:**
- Menu browsing by category
- Shopping cart management
- Order creation and confirmation
- Order lookup by order number

**Out of Scope (for 4 weeks):**
- User authentication/login
- Payment processing
- Admin dashboard
- Real-time notifications

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Programming language |
| Spring Boot | 3.5.6 | Web framework |
| Spring Data JPA | 3.5.6 | Database ORM |
| MySQL | 8.0 | Relational database |
| Maven | Latest | Build tool |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI library |
| Vite | Latest | Build tool |
| Axios | Latest | HTTP client |
| React Router | v6 | Client-side routing |
| Bootstrap | 5 | UI framework |

### Development Tools
- **Version Control:** Git & GitHub
- **IDE:** IntelliJ IDEA (backend) / VS Code (frontend)
- **API Testing:** Postman (optional)
- **Database:** MySQL Workbench

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│    category     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ description     │
│ display_order   │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│   menu_item     │
├─────────────────┤
│ id (PK)         │
│ category_id(FK) │
│ name            │
│ description     │
│ price           │
│ image_url       │
│ available       │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ N:M (via order_item)
         │
┌────────▼────────┐       ┌─────────────────┐
│   order_item    │──────▶│     orders      │
├─────────────────┤  N:1  ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ order_id (FK)   │       │ order_number    │
│ menu_item_id(FK)│       │ customer_name   │
│ quantity        │       │ total_amount    │
│ unit_price      │       │ status          │
│ subtotal        │       │ ordered_at      │
└─────────────────┘       └─────────────────┘
```

### Tables Summary
- **categories** - Organizes menu items (Coffee, Desserts, Drinks)
- **menu_items** - Individual products with pricing and details
- **orders** - Customer order records
- **order_items** - Links orders to menu items with quantities

---

## Team Structure

### Team Roles & Responsibilities

| Member | Role | Primary Tasks | Git Branch |
|--------|------|---------------|------------|
| **Member 1** | Database Engineer | Entity classes, JPA repositories, database schema | `feature/database` |
| **Member 2** | Service Developer | Business logic, DTOs, service layer | `feature/service` |
| **Member 3** | API Developer | REST controllers, exception handling | `feature/controller` |
| **Member 4** | Frontend Developer | Menu page, category filtering, UI components | `feature/frontend-menu` |
| **Member 5** | Frontend Developer | Cart page, checkout flow, order confirmation | `feature/frontend-cart` |

### Collaboration Model

**Git Workflow:**
```
main (production)
  └── develop (integration)
        ├── feature/database
        ├── feature/service
        ├── feature/controller
        ├── feature/frontend-menu
        └── feature/frontend-cart
```

**Pull Request Process:**
1. Create feature branch from `develop`
2. Complete work with commits
3. Create PR to `develop`
4. At least 1 team member reviews
5. Resolve feedback
6. Merge to `develop`

**Reference Documentation:**
- [Branch Setup Guide](docs/BRANCH_SETUP_GUIDE.md)
- [GitHub Collaboration Guide](docs/CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md)
- [Git Commands Cheatsheet](docs/GIT_COMMANDS_CHEATSHEET_KR.md)

---

## 4-Week Timeline

### Week 1: Setup & Database Layer

#### Goals
- Set up development environment
- Create database schema
- Implement entity classes and repositories

#### Day 1-2: Environment Setup (All Team Members)
**Tasks:**
- [ ] Install Java 21, Node.js, MySQL
- [ ] Clone GitHub repository
- [ ] Set up IDE (IntelliJ/VS Code)
- [ ] Create local MySQL database
- [ ] Configure `.env` file
- [ ] Run initial Spring Boot app
- [ ] Verify React app starts

**Reference:** README.md setup instructions

**Deliverables:**
- All team members can run backend on port 8080
- All team members can run frontend on port 5173
- Database `cafe_kiosk` created

---

#### Day 3-5: Database Layer (Member 1)
**Tasks:**
- [ ] Create `OrderStatus.java` enum
- [ ] Create `Category.java` entity
- [ ] Create `MenuItem.java` entity
- [ ] Create `Order.java` entity
- [ ] Create `OrderItem.java` entity
- [ ] Create `CategoryRepository.java`
- [ ] Create `MenuItemRepository.java`
- [ ] Create `OrderRepository.java`
- [ ] Test entities (run app, check tables created)

**Reference:** [Backend Guide - Section 2](docs/CAFE_KIOSK_SIMPLE_GUIDE_KR_자바_데이타베이스.md)

**Deliverables:**
- 5 entity classes
- 3 repository interfaces
- Database tables auto-created by JPA
- Sample data loaded (via `data.sql`)

**Success Criteria:**
- Spring Boot starts without errors
- MySQL tables exist with correct columns
- Can query data using repositories

---

### Week 2: Backend Business Logic

#### Day 6-7: DTO Layer (Member 2)
**Tasks:**
- [ ] Create `CartItem.java` DTO
- [ ] Create `OrderRequest.java` DTO
- [ ] Create `OrderResponse.java` DTO
- [ ] Add data validation annotations

**Deliverables:**
- 3 DTO classes with proper structure

---

#### Day 8-10: Service Layer (Member 2)
**Tasks:**
- [ ] Create `MenuService.java`
  - [ ] `getAllCategories()`
  - [ ] `getAllAvailableMenuItems()`
  - [ ] `getMenuItemsByCategory()`
  - [ ] `getMenuItemById()`
- [ ] Create `CartService.java`
  - [ ] `getCart()` (session-based)
  - [ ] `addToCart()`
  - [ ] `removeFromCart()`
  - [ ] `clearCart()`
  - [ ] `getCartTotal()`
- [ ] Create `OrderService.java`
  - [ ] `createOrder()`
  - [ ] `getOrderByNumber()`
  - [ ] `generateOrderNumber()`

**Reference:** [Backend Guide - Section 3](docs/CAFE_KIOSK_SIMPLE_GUIDE_KR_자바_데이타베이스.md)

**Deliverables:**
- 3 service classes with business logic
- Order number generation working
- Cart management in session

**Success Criteria:**
- Services can be autowired in controllers
- Business logic executes without errors
- Database transactions work correctly

---

### Week 3: REST API & Frontend Foundation

#### Day 11-12: REST API Layer (Member 3)
**Tasks:**
- [ ] Create `WebConfig.java` (CORS configuration)
- [ ] Create `MenuApiController.java`
  - [ ] `GET /api/menu/categories`
  - [ ] `GET /api/menu/items`
  - [ ] `GET /api/menu/items/category/{id}`
- [ ] Create `OrderApiController.java`
  - [ ] `POST /api/orders`
  - [ ] `GET /api/orders/{orderNumber}`
- [ ] Create `GlobalExceptionHandler.java`
- [ ] Create `ResourceNotFoundException.java`
- [ ] Test API endpoints (Postman or browser)

**Reference:** [React Guide - Backend Changes](docs/CAFE_KIOSK_REACT_GUIDE_KR_프론트엔드.md)

**Deliverables:**
- 2 REST controllers with 5 endpoints
- CORS enabled for React app
- Exception handling implemented

**Success Criteria:**
- Can fetch categories via `http://localhost:8080/api/menu/categories`
- Can fetch menu items via API
- Can create order via POST request
- Proper error responses (404, 500)

---

#### Day 13-15: React Setup & Menu Page (Member 4)
**Tasks:**
- [ ] Initialize React project structure
- [ ] Install dependencies (axios, react-router-dom, bootstrap)
- [ ] Configure Vite proxy
- [ ] Create `src/api/cafekioskApi.js`
  - [ ] API functions for menu endpoints
  - [ ] API functions for order endpoints
- [ ] Create `CartContext.jsx` (cart state management)
- [ ] Create `Header.jsx` component
- [ ] Create `Footer.jsx` component
- [ ] Create `CategoryFilter.jsx` component
- [ ] Create `MenuItem.jsx` component
- [ ] Create `MenuList.jsx` component
- [ ] Create `MenuPage.jsx`
- [ ] Test menu display with real API data

**Reference:** [React Guide - Sections 4-6](docs/CAFE_KIOSK_REACT_GUIDE_KR_프론트엔드.md)

**Deliverables:**
- React project structure complete
- API integration working
- Menu page displays categories and items
- Can filter by category
- Add to cart functionality works

**Success Criteria:**
- Menu page loads from backend API
- Category filtering works
- Items display with images and prices
- Cart badge shows item count

---

### Week 4: Cart, Orders & Testing

#### Day 16-17: Cart & Checkout (Member 5)
**Tasks:**
- [ ] Create `Cart.jsx` component
- [ ] Create `CartItem.jsx` component
- [ ] Create `CartPage.jsx`
  - [ ] Display cart items
  - [ ] Update quantities
  - [ ] Remove items
  - [ ] Show total price
  - [ ] Customer name input (optional)
  - [ ] Checkout button
- [ ] Create `OrderComplete.jsx` component
- [ ] Create `OrderCompletePage.jsx`
- [ ] Test cart-to-order flow

**Reference:** [React Guide - Cart Components](docs/CAFE_KIOSK_REACT_GUIDE_KR_프론트엔드.md)

**Deliverables:**
- Working shopping cart
- Order submission works
- Order confirmation page displays correctly

**Success Criteria:**
- Can add/remove items from cart
- Cart persists in localStorage
- Order creates successfully
- Order number displays on confirmation

---

#### Day 18-19: Integration & Bug Fixes (All Members)
**Tasks:**
- [ ] End-to-end testing
  - [ ] Browse menu → Add to cart → Checkout → Confirm
  - [ ] Test with different categories
  - [ ] Test quantity changes
  - [ ] Test empty cart scenarios
- [ ] Cross-browser testing (Chrome, Firefox)
- [ ] Responsive design testing (desktop, tablet)
- [ ] Fix bugs found during testing
- [ ] Code cleanup
- [ ] Add error handling
- [ ] Improve UI/UX

**Testing Checklist:**
- [ ] Menu page loads correctly
- [ ] All categories display
- [ ] Filtering works
- [ ] Add to cart updates badge
- [ ] Cart shows correct items
- [ ] Quantities update correctly
- [ ] Total calculates correctly
- [ ] Order submission works
- [ ] Order confirmation displays all details
- [ ] No console errors

**Deliverables:**
- Bug-free application
- All features working together
- Responsive design verified

---

#### Day 20: Documentation & Presentation (All Members)
**Tasks:**
- [ ] Update README.md with:
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Team member contributions
  - [ ] Screenshots
- [ ] Create presentation slides
  - [ ] Project overview
  - [ ] Architecture diagram
  - [ ] Database design
  - [ ] Features demo
  - [ ] Challenges & solutions
  - [ ] Future improvements
- [ ] Prepare demo script
- [ ] Record demo video (optional)
- [ ] Practice presentation
- [ ] Final code review
- [ ] Create submission package

**Deliverables:**
- Complete README documentation
- Presentation slides (10-15 slides)
- Demo video or live demo script
- Clean, well-commented code
- Final submission ready

---

## Core Features & Requirements

### Functional Requirements

**FR-1: Menu Browsing**
- Users can view all menu categories
- Users can filter menu items by category
- Menu items display name, description, price, image
- Only available items are shown

**FR-2: Shopping Cart**
- Users can add items to cart with quantity
- Users can view cart contents
- Users can update item quantities
- Users can remove items from cart
- Cart displays subtotal and total price
- Cart persists in browser (localStorage)

**FR-3: Order Processing**
- Users can submit cart as order
- System generates unique order number
- System calculates total amount
- Users receive order confirmation
- Optional customer name field

**FR-4: Order Lookup**
- Users can view order details using order number
- Order details include all items, quantities, prices

### Non-Functional Requirements

**Performance:**
- Page load time < 3 seconds
- API response time < 500ms

**Usability:**
- Responsive design (works on tablet and desktop)
- Clear navigation
- Intuitive user interface
- Helpful error messages

**Code Quality:**
- Consistent code formatting
- Meaningful variable/function names
- Basic error handling
- Comments for complex logic

---

## API Endpoints

### Menu API
| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/menu/categories` | Get all categories | List of categories |
| GET | `/api/menu/items` | Get all menu items | List of menu items |
| GET | `/api/menu/items/category/{id}` | Get items by category | Filtered menu items |

### Order API
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/orders` | Create new order | OrderRequest | OrderResponse with order number |
| GET | `/api/orders/{orderNumber}` | Get order by number | - | Order details |

**Request/Response Examples:**

**Create Order Request:**
```json
{
  "customerName": "John Doe",
  "items": [
    {
      "menuItemId": 1,
      "menuItemName": "Americano",
      "price": 3000,
      "quantity": 2,
      "subtotal": 6000
    }
  ]
}
```

**Create Order Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-20250111-001",
  "customerName": "John Doe",
  "totalAmount": 6000,
  "status": "PENDING",
  "orderedAt": "2025-01-11T14:30:00",
  "items": [...]
}
```

---

## Development Guidelines

### Code Style

**Java (Backend):**
- Use camelCase for variables and methods
- Use PascalCase for class names
- One class per file
- Use `@Data`, `@Builder` from Lombok
- Add JavaDoc for public methods

**JavaScript/React (Frontend):**
- Use camelCase for variables and functions
- Use PascalCase for components
- One component per file
- Use functional components with hooks
- Use meaningful component names

### Commit Message Convention

Follow this format:
```
<type>: <short description>

[optional body]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/config changes

**Examples:**
```
feat: Add Category entity and repository
fix: Correct cart total calculation
docs: Update README setup instructions
```

### Git Workflow

**Daily Routine:**
```bash
# 1. Start of day
git checkout develop
git pull origin develop
git checkout feature/your-branch
git merge develop

# 2. During work
git add .
git commit -m "feat: add menu service"
git push origin feature/your-branch

# 3. End of day
# Create PR if feature complete
```

**Reference:** [GitHub Collaboration Guide](docs/CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md)

---

## Testing Strategy

### Backend Testing
- **Manual Testing:**
  - Test each service method
  - Verify database changes
  - Test API endpoints with Postman

- **What to Test:**
  - Menu items load correctly
  - Categories filter properly
  - Order creation saves to database
  - Order number generates uniquely

### Frontend Testing
- **Manual Testing:**
  - Click through all user flows
  - Test on different screen sizes
  - Test on different browsers

- **Test Scenarios:**
  - Browse menu → add items → view cart → checkout
  - Filter by each category
  - Update cart quantities
  - Remove items from cart
  - Submit order with/without customer name
  - Empty cart behavior

### Integration Testing
- Test full flow: Frontend → API → Database → Response
- Verify data consistency
- Check error handling

---

## Risk Management

### Identified Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Team member absence | Medium | High | Cross-train, document work, pair programming |
| Technical difficulties | High | Medium | Daily check-ins, help each other, ask instructor |
| Merge conflicts | Medium | High | Frequent pulls, small commits, communicate before editing shared files |
| Running out of time | Medium | High | Prioritize core features, cut nice-to-haves if needed |
| API integration issues | Medium | Medium | Test API endpoints early, mock data if needed |
| Database issues | Low | High | Back up database, use migrations, test locally first |

### Contingency Plans

**If Week 4 runs short:**
- Skip optional features (customer name field)
- Use placeholder images instead of custom ones
- Simplify UI styling
- Focus on core functionality working

**If a team member falls behind:**
- Pair programming with another member
- Redistribute tasks
- Focus on MVP features only

---

## Success Criteria

### Minimum Viable Product (MVP)
- [ ] Menu displays with categories
- [ ] Can add items to cart
- [ ] Cart shows items and total
- [ ] Can create order
- [ ] Order confirmation shows order number
- [ ] Backend API works correctly
- [ ] Frontend communicates with backend

### Stretch Goals (If Time Permits)
- [ ] Order lookup page (by order number)
- [ ] Improved UI with animations
- [ ] Image uploads for menu items
- [ ] Order status display
- [ ] Print order receipt

### Quality Metrics
- [ ] No critical bugs
- [ ] Code is readable and organized
- [ ] Git history is clean
- [ ] Documentation is complete
- [ ] Presentation is prepared

---

## Weekly Deliverables

### Week 1 Deliverables
- Development environment setup (all members)
- Database schema created
- Entity classes and repositories working
- Sample data loaded

### Week 2 Deliverables
- All DTO classes complete
- All service classes complete
- Business logic working
- Unit tested (basic)

### Week 3 Deliverables
- REST API endpoints working
- CORS configured
- React project setup
- Menu page functional

### Week 4 Deliverables
- Complete cart functionality
- Order submission working
- Full application integrated
- Documentation complete
- Presentation ready

---

## Learning Resources

### Documentation to Reference
- [Backend Development Guide](docs/CAFE_KIOSK_SIMPLE_GUIDE_KR_자바_데이타베이스.md)
- [React Frontend Guide](docs/CAFE_KIOSK_REACT_GUIDE_KR_프론트엔드.md)
- [GitHub Collaboration Guide](docs/CAFE_KIOSK_GITHUB_COLLABORATION_GUIDE.md)
- [Branch Setup Guide](docs/BRANCH_SETUP_GUIDE.md)
- [Git Commands Cheatsheet](docs/GIT_COMMANDS_CHEATSHEET_KR.md)

### External Resources
- Spring Boot Docs: https://spring.io/projects/spring-boot
- React Docs: https://react.dev/
- Bootstrap Docs: https://getbootstrap.com/
- Git Tutorial: https://learngitbranching.js.org/

---

## Communication Plan

### Daily Stand-up (15 minutes)
**Time:** Every morning at [Insert Time]

**Format:**
- What I did yesterday
- What I'm doing today
- Any blockers?

### Weekly Team Meeting (1 hour)
**Time:** Every Monday at [Insert Time]

**Agenda:**
- Review last week's progress
- Demo completed features
- Plan this week's tasks
- Discuss any issues
- Code review session

### Communication Channels
- **GitHub Issues:** Track bugs and tasks
- **Pull Requests:** Code review and discussion
- **[Chat Platform]:** Quick questions and updates
- **Email:** Formal communication with instructor

---

## Final Presentation Outline

### Presentation Structure (10-15 minutes)

**1. Introduction (2 minutes)**
- Team members
- Project overview
- Technology stack

**2. Architecture (2 minutes)**
- System architecture diagram
- Database design
- Frontend-backend communication

**3. Features Demo (5 minutes)**
- Live demonstration:
  - Browse menu
  - Add to cart
  - Complete order
  - View order confirmation
- Show responsive design

**4. Development Process (3 minutes)**
- Team collaboration via Git
- Challenges faced and solutions
- What we learned

**5. Future Enhancements (2 minutes)**
- Possible improvements
- Lessons learned
- Q&A

---

## Submission Checklist

### Code Submission
- [ ] All code committed to `develop` branch
- [ ] Final merge to `main` branch
- [ ] Repository is clean (no temp files)
- [ ] `.gitignore` properly configured
- [ ] All secrets removed from code

### Documentation
- [ ] README.md updated with setup instructions
- [ ] API endpoints documented
- [ ] Database schema documented
- [ ] Team contributions noted

### Demo Materials
- [ ] Presentation slides (PDF)
- [ ] Demo video (optional)
- [ ] Screenshots of working application

### Deliverables Package
```
cafe-kiosk/
├── README.md (updated)
├── backend/ (Spring Boot code)
├── frontend/ (React code)
├── docs/ (all documentation)
├── PRESENTATION.pdf
└── PROJECT_PLAN.md (this document)
```

---

## Conclusion

This 4-week plan provides a structured approach for beginner bootcamp students to build a full-stack cafe kiosk application. The timeline is realistic, with built-in flexibility for learning and problem-solving.

### Key Success Factors
1. **Consistent Communication** - Daily check-ins and weekly meetings
2. **Follow the Git Workflow** - Proper branching and pull requests
3. **Reference the Guides** - Use the provided documentation
4. **Ask for Help Early** - Don't wait until you're stuck
5. **Focus on MVP First** - Core features before nice-to-haves
6. **Test Frequently** - Don't wait until the end
7. **Document as You Go** - Update docs while working

### Expected Outcomes
By the end of 4 weeks, students will have:
- Built a complete full-stack web application
- Gained hands-on experience with Spring Boot and React
- Practiced team collaboration with Git/GitHub
- Developed problem-solving skills
- Created a portfolio project
- Learned modern development practices

**Remember:** The goal is learning through doing. Don't be afraid to make mistakes - that's how you learn!

---

**Project Plan Version:** 1.0
**Last Updated:** January 11, 2025
**Status:** Ready for Execution

**Good luck and happy coding! 🚀**
