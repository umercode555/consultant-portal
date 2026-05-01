#!/bin/bash
# Run this from the repo root: bash fix-structure.sh
# Moves all flat files into proper src/ folder structure

set -e

echo "Creating folder structure..."
mkdir -p src/pages src/components/shared src/context src/utils src/data src/types

echo "Moving pages..."
for f in ClientsPage LeadsPage MeetingsPage TasksPage DocumentsPage MessagesPage \
          ForumPage InvoicesPage EmailPage StudentsPage AnalyticsPage AutomationPage \
          AdminUsersPage ProfilePage DashboardHome LoginPage RegisterPage; do
  [ -f "${f}.tsx" ] && mv "${f}.tsx" "src/pages/${f}.tsx" && echo "  ✓ ${f}"
done

echo "Moving layout..."
[ -f "DashboardLayout.tsx" ] && mv DashboardLayout.tsx src/components/shared/DashboardLayout.tsx

echo "Moving core files..."
[ -f "authStore.ts" ]  && mv authStore.ts  src/context/authStore.ts
[ -f "api.ts" ]        && mv api.ts        src/utils/api.ts
[ -f "mockData.ts" ]   && mv mockData.ts   src/data/mockData.ts
[ -f "index.ts" ]      && mv index.ts      src/types/index.ts
[ -f "App.tsx" ]       && mv App.tsx       src/App.tsx
[ -f "main.tsx" ]      && mv main.tsx      src/main.tsx
[ -f "index.css" ]     && mv index.css     src/index.css

echo ""
echo "Done! Now run: npm install && npm run dev"
