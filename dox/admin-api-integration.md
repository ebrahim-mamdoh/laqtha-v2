You are integrating backend APIs into the existing **Laqtha Admin Dashboard**.

This project already has a stable UI implementation. Your job is ONLY to connect APIs to the existing UI without breaking architecture or modifying the design.

---

## CRITICAL RULES

1. DO NOT change any UI structure.
2. DO NOT modify CSS.
3. DO NOT change layout files.
4. DO NOT rebuild components.
5. Only implement the data layer and connect it to existing components.

The UI must remain pixel-identical.

---

## PROJECT DATA ARCHITECTURE

All data access follows this structure:

UI Component
↓
React Query Hook
↓
Page API file
↓
apiClient
↓
Backend Endpoint

Example:

OrdersTable.client.jsx
↓
useOrders.js
↓
orders.api.js
↓
apiClient.get("/admin/orders")

---

## FILE LOCATION RULE

API logic must be colocated inside the page folder.

Example:

src/app/admin/dashboard/orders/

orders.api.js
useOrders.js

Never place admin API logic in global folders.

---

## API FILE RESPONSIBILITY

The API file handles:

* calling apiClient
* transforming backend responses
* returning UI-ready data

Example:

export async function fetchOrders(params) {
const { data } = await apiClient.get("/admin/orders", { params })

return data.data.map(order => ({
id: order.id,
customerName: order.customer.name,
phone: order.customer.phone,
service: order.service_type,
amount: order.total_price,
status: order.status,
createdAt: order.created_at
}))
}

---

## RESPONSE MAPPING RULE

Never expose raw backend responses to UI components.

Always map the response to a simplified UI model.

Incorrect:

data.data.map(...)

Correct:

return mappedOrders

The UI should receive only the fields it actually needs.

---

## REACT QUERY USAGE

All data fetching must use React Query.

Example:

export function useOrders(filters) {
return useQuery({
queryKey: [queryKeys.admin.orders, filters],
queryFn: () => fetchOrders(filters)
})
}

Never call APIs directly inside UI components.

---

## QUERY KEY RULE

Always use the centralized queryKeys.

Example:

queryKeys.admin.orders
queryKeys.admin.users
queryKeys.admin.tickets
queryKeys.admin.notifications

Never create random query keys.

---

## MOCK DATA STRATEGY

If the backend endpoint is not ready yet:

Return mock data inside the API function.

Example:

return Promise.resolve(mockOrders)

This allows easy switching to real endpoints later.

---

## PAGINATION RULE

If the backend returns pagination metadata:

{
data: [...],
meta: {
page: 1,
per_page: 10,
total: 1200
}
}

Transform it into:

return {
items: mappedItems,
pagination: data.meta
}

UI components should consume pagination separately.

---

## FILTER HANDLING

Filters must come from UI state.

Example:

const filters = {
page,
status,
search,
startDate,
endDate
}

These filters must be passed to the API through params.

---

## PERFORMANCE RULES

Avoid unnecessary re-renders.

Use React Query caching properly.

Do not create new objects inside queryKey unnecessarily.

Prefer server components where possible.

---

## ERROR HANDLING

API errors must be handled inside React Query.

Do not crash UI components.

Use toast notifications through the existing notify.js utility.

---

## SECURITY RULE

All requests must use the existing apiClient from:

src/lib/api.js

This ensures authentication tokens are included automatically.

Never create a new axios instance.

---

## OUTPUT REQUIREMENTS

When integrating an API you must return:

1. The new API file
2. The React Query hook
3. The fields mapped for the UI
4. The endpoint used
5. Any assumptions about the backend response

Do not modify unrelated files.
