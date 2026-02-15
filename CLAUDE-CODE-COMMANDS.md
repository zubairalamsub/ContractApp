# ContractorPro - Claude Code Commands
# =====================================
# Run these commands step by step

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 1: Run the setup script
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
chmod +x setup-contractorpro.sh
./setup-contractorpro.sh

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 2: Setup NeonDB connection
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Go to https://console.neon.tech → Create Project → Copy connection string
# Then update: ContractorPro/src/ContractorPro.API/appsettings.json

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 3: Run EF Migrations
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd ContractorPro
dotnet ef migrations add InitialCreate --project src/ContractorPro.Infrastructure --startup-project src/ContractorPro.API
dotnet ef database update --project src/ContractorPro.Infrastructure --startup-project src/ContractorPro.API

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 4: Docker - Run Everything
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Dev (local PostgreSQL):
docker-compose up --build

# Production (NeonDB):
cp .env.example .env
# Edit .env with your NeonDB string
docker-compose -f docker-compose.prod.yml up --build

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 5: Claude Code Prompts (copy-paste into claude terminal)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ── PROMPT 1: Build Full Angular Frontend ──
claude "Read the entire project structure of ContractorPro (.NET backend) and contractor-frontend (Angular). 
The backend has these API endpoints:
- GET/POST /api/contracts, GET/PUT/DELETE /api/contracts/{id}
- GET/POST /api/contracts/{id}/items, PUT/DELETE /api/contracts/{cid}/items/{iid}  
- GET/POST /api/categories, GET /api/categories/group/{group}, PUT/DELETE /api/categories/{id}
- GET/POST /api/suppliers, GET/PUT/DELETE /api/suppliers/{id}
- GET /api/dashboard

Build the complete Angular 18 frontend with:
1. Sidebar navigation (Dashboard, Contracts, Suppliers, Categories)
2. Dashboard page with stats cards and contract overview
3. Contracts list → click to open contract detail showing all items per contract
4. Add/Edit/Delete contracts with forms
5. Add/Edit/Delete items within a contract (each item has category, supplier, qty, price, delivery status)
6. Categories page: show ICT and Electrical groups, allow adding custom categories with name, group, color
7. Suppliers page with CRUD
8. Use Angular Material for UI components
9. All API calls should go through the ApiService to http://localhost:5000/api
10. BDT currency formatting. Professional dark sidebar, clean white content area."

# ── PROMPT 2: Add Category Management Feature ──
claude "In the Angular frontend, implement the Categories feature:
- Show categories grouped by ICT and Electrical with color-coded badges
- Add Category dialog: name, group (ICT/Electrical dropdown), color picker
- Edit/Delete non-default categories (default categories are protected)
- When adding items to a contract, the category dropdown should show all categories grouped by ICT/Electrical
- Categories API: GET /api/categories, POST /api/categories, PUT/DELETE /api/categories/{id}"

# ── PROMPT 3: Polish Contract Detail Page ──
claude "Enhance the Contract Detail page in Angular:
- Show contract header with status badge, client, dates, progress bar
- Stats row: Total Budget, Spent, Items count, Suppliers count, Timeline
- Items table with columns: Item Name, Category (color badge), Supplier, Qty/Used (with mini progress), Unit Price, Total, Delivery Status, Actions
- Filter items by delivery status and search by name
- Below items table, show 'Suppliers on this Contract' section as cards
- Add Item dialog with: name, category dropdown (grouped), supplier dropdown, qty, unit, price, used qty, delivery status
- Budget vs spent comparison bar"

# ── PROMPT 4: Docker Build and Test ──
claude "Review the Docker setup:
- Fix any issues in Dockerfile.api and contractor-frontend/Dockerfile  
- Ensure docker-compose.yml works with local PostgreSQL
- Ensure docker-compose.prod.yml works with NeonDB connection string from .env
- Add health checks to all services
- Test the build: docker-compose up --build"
