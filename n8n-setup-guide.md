# n8n GitHub Integration Setup Guide

## 🎯 Overview

After Node 4 formats your brief, we add 3 nodes to automatically update your website:

```
Node 4 (Format Brief)
    ↓
    ├──→ Send Email Node
    │
    └──→ Node 5: GET briefs.json
            ↓
         Node 6: Parse & Append ←─────┐
            ↓                          │
         Node 7: PUT to GitHub    (Also gets Node 4 output)
```

---

## 📋 Node 5: HTTP Request - GET briefs.json

**Node Type:** `HTTP Request`

### Settings:
- **Method:** `GET`
- **URL:** `https://api.github.com/repos/aaruvan/aaruvan.github.io/contents/public/briefs.json`
- **Authentication:** Generic Credential Type
  - **Credential Type:** Header Auth
  - **Name:** `Authorization`
  - **Value:** `token ghp_YOUR_GITHUB_TOKEN_HERE`
- **Response Format:** JSON

### What it does:
Fetches the current `briefs.json` file from GitHub. Returns:
```json
{
  "content": "base64-encoded-json-content",
  "sha": "abc123...",
  "size": 12345
}
```

---

## 📋 Node 6: Code - Merge & Prepare Update

**Node Type:** `Code`
**Language:** JavaScript

### IMPORTANT: This node needs TWO inputs!

1. **Input 1:** Node 5 (GitHub GET response)
2. **Input 2:** Node 4 (New brief data)

### How to connect multiple inputs in n8n:
1. Create the Code node
2. Connect Node 5 → Node 6 (normal connection)
3. **Hold Shift** and drag from Node 4 → Node 6 (creates second input)

### Code:
```javascript
// Get the GitHub API response (Input 1)
const githubResponse = items[0].json;

// Get the new brief from Node 4 (Input 2)
const newBrief = items[1].json;

// Decode base64 content from GitHub
const base64Content = githubResponse.content;
const decodedContent = Buffer.from(base64Content, 'base64').toString('utf-8');

// Parse existing briefs
let briefsArray = [];
try {
  briefsArray = JSON.parse(decodedContent);
  if (!Array.isArray(briefsArray)) {
    briefsArray = [];
  }
} catch (e) {
  briefsArray = [];
}

// Check if this date already exists (prevent duplicates)
const existingIndex = briefsArray.findIndex(b => b.id === newBrief.id);
if (existingIndex >= 0) {
  // Update existing entry
  briefsArray[existingIndex] = newBrief;
} else {
  // Add new entry at the beginning (newest first)
  briefsArray.unshift(newBrief);
}

// Keep last 30 briefs only
if (briefsArray.length > 30) {
  briefsArray = briefsArray.slice(0, 30);
}

// Convert to JSON and encode to base64
const updatedJsonString = JSON.stringify(briefsArray, null, 2);
const updatedBase64 = Buffer.from(updatedJsonString, 'utf-8').toString('base64');

// Return data for PUT request
return [{
  json: {
    content: updatedBase64,
    sha: githubResponse.sha,
    message: `Update daily brief for ${newBrief.date}`,
    briefCount: briefsArray.length
  }
}];
```

### What it does:
1. Gets current briefs from GitHub (Input 1)
2. Gets new brief from Node 4 (Input 2)
3. Decodes the base64 content
4. Parses JSON array
5. Adds/updates the new brief
6. Keeps only last 30 entries
7. Encodes back to base64
8. Outputs data ready for GitHub PUT

---

## 📋 Node 7: HTTP Request - PUT to GitHub

**Node Type:** `HTTP Request`

### Settings:
- **Method:** `PUT`
- **URL:** `https://api.github.com/repos/aaruvan/aaruvan.github.io/contents/public/briefs.json`
- **Authentication:** Generic Credential Type
  - **Credential Type:** Header Auth
  - **Name:** `Authorization`
  - **Value:** `token ghp_YOUR_GITHUB_TOKEN_HERE`
- **Body Content Type:** JSON
- **Body:**
```json
{
  "message": "={{ $json.message }}",
  "content": "={{ $json.content }}",
  "sha": "={{ $json.sha }}"
}
```
- **Response Format:** JSON

### What it does:
Updates the `public/briefs.json` file on GitHub. The `sha` ensures we're updating the correct version (prevents conflicts).

---

## 🔑 Setting Up GitHub Personal Access Token

### Step 1: Generate Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: `n8n-briefs-update`
4. Select scope: ✅ **repo** (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you can't see it again!)

### Step 2: Add to n8n
1. In n8n, click "Credentials" (left sidebar)
2. Click "+ New Credential"
3. Search for "Header Auth"
4. Fill in:
   - **Name:** `GitHub PAT`
   - **Header Name:** `Authorization`
   - **Value:** `token ghp_YOUR_COPIED_TOKEN_HERE`
5. Click "Save"

### Step 3: Use in Nodes
In Node 5 and Node 7:
- **Authentication:** Generic Credential Type
- **Credential Type:** Header Auth
- Select your "GitHub PAT" credential

---

## ✅ Testing Your Workflow

### Test Run:
1. Run your workflow manually in n8n
2. Check for green checkmarks on all nodes
3. View Node 7 output - should show success

### Verify on GitHub:
1. Go to: https://github.com/aaruvan/aaruvan.github.io/blob/main/public/briefs.json
2. You should see your new entry at the top
3. Check the commit message: "Update daily brief for 2025-10-XX"

### Verify on Website:
1. Wait 30 seconds (for browser cache)
2. Visit: https://aaruvan.github.io/
3. Your new brief should appear!
4. No rebuild was needed! ✨

---

## 🐛 Troubleshooting

### Error: 404 Not Found
**Cause:** File path is wrong  
**Fix:** Ensure URL uses `public/briefs.json` (not `briefs.json`)

### Error: 401 Unauthorized
**Cause:** Token is invalid or missing scope  
**Fix:** 
- Check token starts with `token ghp_...`
- Regenerate token with `repo` scope

### Error: 409 Conflict (SHA mismatch)
**Cause:** File was updated by someone else  
**Fix:** Re-run the workflow (Node 5 will get new SHA)

### Error: Items array is empty
**Cause:** Node 6 isn't receiving both inputs  
**Fix:** 
- Check Node 6 has TWO input connections
- Input 1: Node 5
- Input 2: Node 4

### Website not updating
**Cause:** Browser cache  
**Fix:**
- Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- Or wait 1-2 minutes

---

## 🎯 Final Workflow Structure

```
┌─────────────────────────────────────────────────────────┐
│  COMPLETE n8n WORKFLOW                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Node 1: Filter last 24h tweets                         │
│     ↓                                                    │
│  Node 2: Combine tweets                                 │
│     ↓                                                    │
│  Node 3: Parse OpenAI response                          │
│     ↓                                                    │
│  Node 4: Format brief (HTML + JSON)                     │
│     ↓                                                    │
│     ├──→ Email Node: Send email                         │
│     │                                                    │
│     └──→ Node 5: GET briefs.json from GitHub           │
│             ↓                                            │
│          Node 6: Merge new brief ←──────────────────┐  │
│             ↓                                        │  │
│          Node 7: PUT updated file to GitHub    (Node 4)│
│                                                          │
│  ✅ Website auto-updates!                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### What Node 6 receives:

**From Node 5 (Input 1):**
```json
{
  "content": "W3sgImlkIjogIjIwMjUtMTAtMDkiLCAuLi4=",
  "sha": "abc123def456"
}
```

**From Node 4 (Input 2):**
```json
{
  "id": "2025-10-13",
  "date": "2025-10-13",
  "subject": "Market Brief — October 13, 2025",
  "json": {
    "summary": "...",
    "insights": [...],
    "watchlist": [...],
    "sources": [...]
  }
}
```

### What Node 6 outputs:
```json
{
  "content": "NEW_BASE64_ENCODED_ARRAY",
  "sha": "abc123def456",
  "message": "Update daily brief for 2025-10-13",
  "briefCount": 5
}
```

---

## 🎉 Success!

Once set up, your workflow:
1. ✅ Scrapes tweets daily
2. ✅ Generates AI summary
3. ✅ Sends you email
4. ✅ Updates website automatically
5. ✅ No manual steps needed!

Your website always shows the latest brief without any rebuilding! 🚀

