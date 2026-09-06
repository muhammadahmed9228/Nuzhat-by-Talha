# Nuzhat by Talha — ImageKit & Multer Architecture

## 1. Purpose

Images should be stored and delivered through ImageKit.

MongoDB must not store image binaries.

MongoDB stores image metadata and ImageKit references.

---

# 2. Technologies

Frontend:

- React
- FormData
- multipart/form-data

Backend:

- Express
- Multer

Storage/CDN:

- ImageKit

Database:

- MongoDB

---

# 3. Upload Flow

Recommended flow:

React Admin
→ select image
→ FormData
→ POST multipart/form-data
→ Express
→ Multer
→ validate file
→ ImageKit
→ receive ImageKit response
→ save URL/fileId/metadata
→ MongoDB

---

# 4. Product Images

Product images should support:

- multiple images
- color-specific images
- image ordering
- primary image

Image metadata may include:

- url
- fileId
- fileName
- width/height if useful
- order
- primary status

---

# 5. Image Replacement

When replacing an image:

1. Upload new image.
2. Verify successful ImageKit upload.
3. Update database reference.
4. Delete old ImageKit file when safe.
5. If database update fails after upload, avoid leaving unmanaged assets where possible.

The exact failure/recovery strategy should be finalized before implementation.

---

# 6. Image Deletion

When deleting an image:

1. Identify ImageKit file ID.
2. Delete/remove database reference.
3. Delete ImageKit asset where appropriate.

Do not assume the URL alone is sufficient for reliable asset deletion.

---

# 7. Admin Authorization

Image upload and deletion operations must require appropriate admin authorization.

Do not allow arbitrary users to upload/delete store assets.

---

# 8. Security

Validate:

- file type
- file size
- upload count
- file dimensions where appropriate

Do not expose ImageKit private credentials to the frontend.

---

# 9. Frontend Image Handling

The frontend should use ImageKit URLs returned by the backend.

Do not store image binaries in Redux or MongoDB.

---

# 10. Future Considerations

The architecture should support images for:

- products
- product variants
- collections
- hero slides
- promotional banners

without creating unrelated upload systems for every feature.