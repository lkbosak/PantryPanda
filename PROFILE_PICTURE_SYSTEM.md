# Profile Picture System Documentation

## Overview
A complete profile picture management system has been implemented, allowing users to:
- View their profile picture next to the logout button in the navigation bar
- Upload/change their profile picture via drag-and-drop or file picker
- Remove their profile picture and revert to default
- Have profile pictures persist across sessions

## Features

### ✅ Profile Picture Display (NavBar)
- **Location**: Next to the logout button (top-right of navbar)
- **Appearance**: 40px circular image with white border and shadow
- **Default Image**: `/default-profile.webp` (from `/Users/ifea/Downloads/blank.webp`)
- **Click Action**: Clicking the profile picture redirects to User Settings
- **Error Handling**: Falls back to default image if loading fails
- **Real-time Updates**: Automatically updates when changed in settings

### ✅ Change Profile Picture (User Settings)
- **Button Location**: First button in User Settings sidebar
- **Icon**: 📷 Camera emoji
- **Color**: Orange/peach border to match theme

### ✅ Upload Modal Features

#### Current Picture Preview
- 150px circular preview at top
- Shows current profile picture or default
- Orange border matching app theme

#### Drag & Drop Zone
- Large drop zone with visual feedback
- Border changes to orange dashed when dragging
- Background highlights when hovering with file
- Supports all image formats

#### File Picker
- "Choose File" button for traditional file selection
- Hidden input element for clean UI
- Accepts: `image/*` (all image types)

#### Action Buttons
- **Remove Picture**: Reverts to default profile picture
- **Close**: Closes modal without changes

#### Status Messages
- Success message: Blue text when upload succeeds
- Error message: Red text if upload fails
- Auto-dismisses after 2 seconds for success
- Closes modal automatically after successful upload

### ✅ Technical Implementation

#### Storage
- **Method**: localStorage with key `profile_picture`
- **Format**: Base64-encoded data URL
- **Size**: No artificial limit (browser typically allows ~5-10MB)
- **Persistence**: Survives page refreshes and browser restarts

#### Event System
- Custom event `profile-picture-changed` dispatched on update
- NavBar listens for this event to update in real-time
- No page reload needed - instant UI update

#### Image Processing
- FileReader API converts uploaded images to base64
- Data URL format allows direct use in `<img src>`
- No server upload needed - fully client-side

## File Changes

### Files Modified

1. **`src/NavBar.tsx`**
   - Added profile picture state and useEffect
   - Added event listener for `profile-picture-changed`
   - Modified logout button area to include profile picture
   - Added click handler to navigate to settings
   - Added error handling for image load failures

2. **`src/UserSettings.tsx`**
   - Added profile picture state variables
   - Added useEffect to load saved profile picture
   - Added file handling functions:
     - `handleFileSelect()` - File picker handler
     - `handleDrop()` - Drag-and-drop handler
     - `handleDragOver()` - Drag feedback
     - `handleDragLeave()` - Drag feedback cleanup
     - `processImageFile()` - Convert and save image
     - `removeProfilePicture()` - Reset to default
   - Added "Change Profile Picture" button in sidebar
   - Added profile picture upload modal with drag-drop UI

3. **`public/default-profile.webp`**
   - Copied from `/Users/ifea/Downloads/blank.webp`
   - Used as default profile picture
   - Served from public folder (accessible at `/default-profile.webp`)

## Usage Instructions

### For Users

#### Uploading a Profile Picture

**Method 1: Drag and Drop**
1. Click "User Settings" in navigation bar
2. Click "📷 Change Profile Picture" button
3. Drag an image file from your computer
4. Drop it in the highlighted drop zone
5. Profile picture updates automatically

**Method 2: File Picker**
1. Click "User Settings" in navigation bar
2. Click "📷 Change Profile Picture" button
3. Click the "Choose File" button
4. Select an image from your computer
5. Profile picture updates automatically

#### Removing Profile Picture
1. Click "User Settings" in navigation bar
2. Click "📷 Change Profile Picture" button
3. Click "Remove Picture" button
4. Profile reverts to default blank image

#### Viewing Profile Picture
- Your profile picture is always visible in the top-right corner when logged in
- It appears next to the "Logout" button
- Click on it to quickly access User Settings

### Supported Image Formats
- JPEG/JPG
- PNG
- GIF
- WEBP
- BMP
- SVG
- Any format supported by `<img>` tags

## Testing Checklist

- ✅ Default picture loads on first login
- ✅ Profile picture visible in NavBar when logged in
- ✅ Clicking profile picture navigates to settings
- ✅ Drag-and-drop uploads work
- ✅ File picker uploads work
- ✅ Profile picture persists after page refresh
- ✅ Remove button reverts to default
- ✅ Real-time update in NavBar when changed
- ✅ Error fallback works if image fails to load
- ✅ Modal closes automatically after upload
- ✅ Success/error messages display correctly

## Browser Compatibility

### Tested Features
- **localStorage**: All modern browsers
- **FileReader API**: IE10+, all modern browsers
- **Drag and Drop API**: All modern browsers
- **CustomEvent**: All modern browsers
- **Base64 encoding**: All browsers

### Limitations
- localStorage size limits vary by browser (typically 5-10MB)
- Very large images may hit storage limits
- Recommend images under 1MB for best performance

## Future Enhancements (Optional)

- [ ] Add image cropping tool
- [ ] Add image size/dimension validation
- [ ] Compress images before storing
- [ ] Add image filters/effects
- [ ] Sync to backend/database instead of localStorage
- [ ] Add profile picture in more locations (settings header, etc.)
- [ ] Add webcam capture option
- [ ] Add preset avatar options
- [ ] Show file size warning before upload

## Troubleshooting

### Profile Picture Not Showing
- Check browser console for errors
- Verify `/default-profile.webp` exists in public folder
- Clear localStorage and try uploading again
- Check if cookies/localStorage are enabled

### Upload Not Working
- Verify file is actually an image
- Check file size (should be under browser localStorage limit)
- Try a different image format
- Check browser console for errors

### Profile Picture Disappears
- Check if localStorage was cleared
- Verify browser allows localStorage
- Check if user is in incognito/private mode

## Code Examples

### Accessing Profile Picture from Any Component
```typescript
const profilePic = localStorage.getItem('profile_picture') || '/default-profile.webp';
```

### Setting Profile Picture Programmatically
```typescript
localStorage.setItem('profile_picture', imageDataURL);
window.dispatchEvent(new Event('profile-picture-changed'));
```

### Listening for Profile Picture Changes
```typescript
useEffect(() => {
  const handleChange = () => {
    const updated = localStorage.getItem('profile_picture');
    setProfilePic(updated || '/default-profile.webp');
  };
  
  window.addEventListener('profile-picture-changed', handleChange);
  return () => window.removeEventListener('profile-picture-changed', handleChange);
}, []);
```

## Security Notes

- All processing happens client-side (no server upload)
- Images stored as base64 in localStorage
- No sensitive data transmitted
- Consider adding file type/size validation for production
- Consider virus scanning if adding server upload later
