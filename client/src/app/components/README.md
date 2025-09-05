# Optimized Jodit Editor Component

## Overview

The `OptimizedJoditEditor` component is a performance-optimized wrapper around the Jodit rich text editor that solves common typing interruption issues.

## Features

- ✅ **Smooth Typing**: Debounced onChange (150ms delay) prevents typing interruptions
- ✅ **Performance Optimized**: Disabled performance-heavy features
- ✅ **CSS Optimizations**: Hardware acceleration and smooth rendering
- ✅ **Memory Management**: Proper cleanup and memory leak prevention
- ✅ **Responsive Toolbar**: Adaptive toolbar for different screen sizes
- ✅ **Image Upload Support**: Configurable image upload API integration
- ✅ **Video Support**: Insert YouTube, Vimeo, and direct video links
- ✅ **Smart Video Handling**: Automatic embedding for popular platforms

## Usage

### Basic Usage

```tsx
import OptimizedJoditEditor from "./components/OptimizedJoditEditor";

function MyComponent() {
  const [content, setContent] = useState("<p>Initial content</p>");

  return (
    <OptimizedJoditEditor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
      height={400}
    />
  );
}
```

### With Image Upload

```tsx
<OptimizedJoditEditor
  value={content}
  onChange={setContent}
  uploadApi="/api/upload/image"
  height={500}
  className="my-custom-editor"
/>
```

### With Video Support

```tsx
<OptimizedJoditEditor
  value={content}
  onChange={setContent}
  enableVideo={true}
  height={500}
  className="my-custom-editor"
/>
```

### With Both Image and Video Upload

```tsx
<OptimizedJoditEditor
  value={content}
  onChange={setContent}
  uploadApi="/api/upload/image"
  enableVideo={true}
  videoUploadApi="/api/upload/video"
  height={600}
  className="my-custom-editor"
/>
```

```tsx
<OptimizedJoditEditor
  value={content}
  onChange={setContent}
  uploadApi="/api/upload/image"
  height={500}
  className="my-custom-editor"
/>
```

### With onBlur Handler

```tsx
<OptimizedJoditEditor
  value={content}
  onChange={setContent}
  onBlur={(value) => {
    // Save content when editor loses focus
    saveContent(value);
  }}
  height={300}
/>
```

## Props

| Prop          | Type                      | Default             | Description                          |
| ------------- | ------------------------- | ------------------- | ------------------------------------ |
| `value`       | `string`                  | `""`                | Current editor content (HTML string) |
| `onChange`    | `(value: string) => void` | Required            | Called when content changes          |
| `onBlur`      | `(value: string) => void` | Optional            | Called when editor loses focus       |
| `placeholder` | `string`                  | `"Start typing..."` | Placeholder text when empty          |
| `height`      | `number`                  | `400`               | Editor height in pixels              |
| `readonly`    | `boolean`                 | `false`             | Whether editor is read-only          |
| `className`   | `string`                  | `""`                | Additional CSS classes               |
| `uploadApi`   | `string`                  | Optional            | Image upload API endpoint            |
| `enableVideo` | `boolean`                 | `false`             | Enable video insertion capabilities  |
| `videoUploadApi` | `string`              | Optional            | Video upload API endpoint            |

## Performance Optimizations Applied

### Disabled Features

- ❌ Auto-height adjustment
- ❌ Character/word counters
- ❌ Search functionality
- ❌ XPath status bar
- ❌ Storage mode
- ❌ Performance-heavy paste dialogs

### Enabled Optimizations

- ✅ Debounced onChange (150ms)
- ✅ CSS hardware acceleration
- ✅ Efficient event handling
- ✅ Memory leak prevention
- ✅ Optimized rendering pipeline

## Migration from Old Jodit

### Before (Old Implementation)

```tsx
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

<JoditEditor
  value={content}
  config={complexConfig}
  onBlur={handleBlur}
  onChange={() => {}} // Empty onChange caused typing issues
/>;
```

### After (Optimized Implementation)

```tsx
import OptimizedJoditEditor from "./components/OptimizedJoditEditor";

<OptimizedJoditEditor
  value={content}
  onChange={handleChange} // Smooth, debounced onChange
  onBlur={handleBlur}
  height={400}
  placeholder="Start typing..."
/>;
```

## Troubleshooting

### Typing Still Interrupted?

1. Check if you're using the `onChange` prop correctly
2. Ensure the component is properly imported
3. Verify no other performance-heavy operations are running

### Editor Not Loading?

1. Check browser console for errors
2. Ensure `jodit-react` is installed: `npm install jodit-react`
3. Verify the component path is correct

### Performance Issues?

1. Check if multiple editors are mounted simultaneously
2. Ensure proper cleanup in useEffect
3. Monitor memory usage in browser dev tools

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Dependencies

- `jodit-react`: ^5.2.19
- `react`: ^19.1.0
- `next`: ^15.4.1
