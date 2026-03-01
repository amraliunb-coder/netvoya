# Sahara eSIM API Integration Guide

Welcome to the Netvoya API Documentation for Partners. This guide provides instructions on how to authenticate and perform basic eSIM management tasks through our REST API.

## Base URL
All API requests should be made relative to:
`https://netvoya-backend.vercel.app`

## Authentication

Contact your account manager to receive a **Client ID** and a **Client Secret**. Depending on the integration, you can also use your current partner portal credentials.

### 1. Requesting a Token

If using basic email/password, make a request to:
**`POST /api/login`**

**Request Body**
```json
{
  "email": "partner@sahara.com",
  "password": "your-password"
}
```

**Response**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": { ... }
}
```

*Note: For server-to-server integration with permanent API keys, please use the `Authorization: Bearer <API_KEY>` header with the Client Secret provided in your dashboard.*

---

## eSIM Inventory Management

Before issuing an eSIM, you must have an active inventory bucket for the desired plan.

### 1. View Available Inventory
**`GET /api/inventory`**

Retrieves a list of all eSIM buckets you have purchased and their availability status.

**Parameters**
- `partner_id` (string): Your assigned partner ID.

**Headers**
- `Authorization`: `Bearer <YOUR_TOKEN>`

**Response**
```json
{
  "success": true,
  "buckets": [
    {
      "_id": "bucket_12345",
      "package_name": "Global Data Plan",
      "region": "Global",
      "data_limit_gb": 10,
      "duration_days": 30,
      "total_purchased": 100,
      "assigned_count": 50,
      "available_count": 50
    }
  ]
}
```

---

## Provisioning & Assigning eSIMs

Once you know which bucket has available inventory, you can issue an eSIM to a customer.

### 1. Assign an eSIM Profile
**`POST /api/inventory/:bucketId/assign`**

Assigns one eSIM from the specified bucket to an end-user.

**Path Parameters**
- `bucketId` (string): The ID of the bucket to assign from (e.g., `bucket_12345`).

**Headers**
- `Authorization`: `Bearer <YOUR_TOKEN>`
- `Content-Type`: `application/json`

**Request Body**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com"
}
```

**Response**
```json
{
  "success": true,
  "message": "Assigned successfully.",
  "assignment": { ... }
}
```
*Note: This will automatically deduct `1` from the `available_count` of the bucket and send an email with the QR code to the customer.*

---

## Retrieving Active eSIMs

### 1. Get Partner Activations
**`GET /api/partner/activations`**

Retrieves a list of all assigned eSIMs and their current status (e.g., Active, Assigned, Expired).

**Parameters**
- `partner_id` (string): Your assigned partner ID.

**Headers**
- `Authorization`: `Bearer <YOUR_TOKEN>`

**Response**
```json
{
  "success": true,
  "activations": [
    {
      "_id": "act_9876",
      "iccid": "8910300000000000000",
      "status": "Active",
      "assigned_to_name": "Customer Name",
      "assigned_to_email": "customer@example.com",
      "bucket_id": { "package_name": "Global Data Plan" },
      "updatedAt": "2026-03-01T12:00:00.000Z"
    }
  ]
}
```

---

## Integration Checklist for Sahara

1. **Verify Credentials**: Log in to to the Partner Portal and navigate to **API & Integrations**. Securely copy your API credentials.
2. **Fetch Packages**: Call `GET /api/inventory` to map your back-office available products to our Netvoya `bucketId` values.
3. **Automate Assignment**: During your checkout or order process, call `POST /api/inventory/:bucketId/assign` to instantly provision an eSIM to the user.
4. **Sync Statutes**: Periodically call `GET /api/partner/activations` to update the eSIM statuses in your back-office systems.

If you require any further assistance, please contact the Netvoya technical support desk.
