# 🔐 Auth System Integration Guide

## ✅ **What's Been Created:**

1. ✅ `src/components/Auth.jsx` - Beautiful login/signup page
2. ✅ `src/App.jsx` - Auth wrapper with role management
3. ✅ `src/utils/permissions.js` - Permission system

---

## 🎯 **Features:**

### **3 User Roles:**

👑 **Admin**

- Full access to everything
- Create/edit/delete schedules
- Manage employees & departments
- Export & share
- View all stats

👔 **Manager**

- View & edit schedules
- Export reports
- View stats
- Cannot manage users

👤 **Employee**

- View-only access
- See own schedule
- No editing

---

## 🚀 **How to Integrate:**

### **Step 1: Update main.jsx**

**File:** `src/main.jsx`

**Current:**

```jsx
import ROTAScheduler from "./ROTAScheduler";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ROTAScheduler />
  </React.StrictMode>
);
```

**Replace with:**

```jsx
import App from "./App"; // Changed!

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> // Changed!
  </React.StrictMode>
);
```

---

### **Step 2: Add Permissions to ROTAScheduler**

**File:** `src/ROTAScheduler.jsx`

**At the top, add import:**

```javascript
import { usePermissions, PERMISSIONS } from "./utils/permissions";
```

**In component, add this after existing props:**

```javascript
const ROTAScheduler = ({ userRole = 'admin', user = null }) => {  // Add props
    // Get permissions
    const permissions = usePermissions(userRole);

    // ... rest of existing code
```

---

### **Step 3: Protect UI Elements**

**Example - Hide "Add Employee" for employees:**

**Find:**

```jsx
<button onClick={() => setShowAddEmployee(true)}>
  <Plus size={18} />
  Add Employee
</button>
```

**Wrap with permission check:**

```jsx
{
  permissions.canAddEmployee && (
    <button onClick={() => setShowAddEmployee(true)}>
      <Plus size={18} />
      Add Employee
    </button>
  );
}
```

---

### **Step 4: Protect Actions**

**Example - Protect schedule generation:**

**Find:**

```javascript
const assignRotaAutomatically = () => {
  // ... generation logic
};
```

**Add permission check:**

```javascript
const assignRotaAutomatically = () => {
  if (!permissions.canCreate) {
    showNotification(
      "You don't have permission to generate schedules",
      "error"
    );
    return;
  }
  // ... generation logic
};
```

---

## 🎨 **Quick Protection Examples:**

### **Protect Buttons:**

```jsx
{
  /* Generate Schedule - Managers & Admins only */
}
{
  permissions.canCreate && (
    <button onClick={assignRotaAutomatically}>Generate ROTA</button>
  );
}

{
  /* Delete Employee - Admins only */
}
{
  permissions.isAdmin && (
    <button onClick={() => removeEmployee(emp.id)}>Delete</button>
  );
}

{
  /* Export - Managers & Admins */
}
{
  permissions.canExport && (
    <button onClick={exportToExcel}>Export to Excel</button>
  );
}
```

### **Protect Drag & Drop:**

```javascript
const handleDrop = (e, week, day, shift) => {
  if (!permissions.canEdit) {
    showNotification("View-only mode", "error");
    return;
  }
  // ... existing drop logic
};
```

### **Protect Modal Opening:**

```javascript
const openStatsModal = () => {
  if (!permissions.canViewStats) {
    showNotification("No permission to view stats", "error");
    return;
  }
  setShowStatsModal(true);
};
```

---

## 🧪 **Testing:**

### **Test Each Role:**

**1. Test Admin:**

```javascript
// In ROTAScheduler.jsx temporarily:
const ROTAScheduler = ({ userRole = 'admin', user = null }) => {
```

- Should see ALL buttons
- Can create, edit, delete
- Can export

**2. Test Manager:**

```javascript
const ROTAScheduler = ({ userRole = 'manager', user = null }) => {
```

- Can edit schedules
- Can export
- CANNOT delete employees

**3. Test Employee:**

```javascript
const ROTAScheduler = ({ userRole = 'employee', user = null }) => {
```

- View-only mode
- No editing allowed
- No buttons visible

---

## 🎯 **Protection Checklist:**

### **Core Features:**

- [ ] Add Employee button (Admin only)
- [ ] Delete Employee button (Admin only)
- [ ] Generate Schedule button (Admin + Manager)
- [ ] Drag & Drop (Admin + Manager)
- [ ] Edit cells (Admin + Manager)
- [ ] Export buttons (Admin + Manager)
- [ ] Department management (Admin only)

### **Optional:**

- [ ] Undo/Redo (Admin + Manager)
- [ ] Leave marking (Admin + Manager)
- [ ] Holiday marking (Admin + Manager)

---

## 🚀 **Quick Start (5 Minutes):**

**Minimal Integration:**

1. Update `main.jsx` (30 seconds)
2. Add permissions import to ROTAScheduler (10 seconds)
3. Add props to ROTAScheduler function (10 seconds)
4. Protect 3 main buttons:
   - Add Employee
   - Generate Schedule
   - Export

**Done! Auth is working!** ✅

---

## 📱 **Testing Flow:**

### **1. First Time:**

```
1. Open app
2. See auth page
3. Click "Sign Up"
4. Fill form
5. Select role (try Manager)
6. Create account
7. Logged in!
```

### **2. Role Testing:**

```
1. Logout (top-right button)
2. Create new account with different role
3. Test permissions
4. Repeat for all 3 roles
```

### **3. Session Persistence:**

```
1. Login
2. Refresh page
3. Should stay logged in
4. Close tab
5. Re-open
6. Still logged in!
```

---

## 🎨 **UI Enhancements:**

### **Show Role Badge:**

Already done in App.jsx! Shows in top-right:

```
Logged in as: John Doe [Admin]
```

### **Disable vs Hide:**

**Option A: Hide completely**

```jsx
{
  permissions.canEdit && <button>Edit</button>;
}
```

**Option B: Show disabled (better UX)**

```jsx
<button disabled={!permissions.canEdit}>
  Edit {!permissions.canEdit && "🔒"}
</button>
```

---

## 🐛 **Troubleshooting:**

### **Issue 1: Not showing auth page**

```javascript
// Check src/main.jsx
// Should import App, not ROTAScheduler
import App from "./App"; // ✅ Correct
```

### **Issue 2: Role not persisting**

```javascript
// Check Appwrite prefs
const prefs = await account.getPrefs();
console.log("Role:", prefs.role);
```

### **Issue 3: All buttons visible for employees**

```javascript
// Check if permissions is defined
console.log("Permissions:", permissions);
// Make sure you added usePermissions hook
```

---

## 💡 **Best Practices:**

1. **Always check permission before action**
2. **Show disabled buttons** (better than hiding)
3. **Add tooltips** explaining why disabled
4. **Test all 3 roles** before shipping

---

## 🎉 **Expected Result:**

### **Admin Login:**

- Full UI
- All buttons work
- Can do everything

### **Manager Login:**

- Most UI visible
- Can edit schedules
- Cannot delete users

### **Employee Login:**

- Minimal UI
- View-only
- Clear indicators

---

## 📝 **Quick Reference:**

```javascript
// Import
import { usePermissions } from "./utils/permissions";

// Use
const permissions = usePermissions(userRole);

// Check
if (permissions.canEdit) {
  /* ... */
}
if (permissions.isAdmin) {
  /* ... */
}
if (permissions.canExport) {
  /* ... */
}

// Protect JSX
{
  permissions.canCreate && <button>Create</button>;
}

// Protect Functions
if (!permissions.canDelete) return;
```

---

**Auth system ready to integrate!** 🔐

**Start with main.jsx update, then protect 2-3 key features, test!** ✅

**Need help? Just ask!** 💪
