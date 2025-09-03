# Security Configuration for Examples

This document explains the security measures implemented in the react19-simple-maps examples.

## Content Security Policy (CSP)

All examples include comprehensive Content Security Policy headers to prevent XSS attacks and improve security posture.

### CSP Directives Explained

- **`default-src 'self'`** - Only allow resources from the same origin by default
- **`script-src 'self' 'unsafe-inline' 'unsafe-eval'`** - Allow scripts from same origin, inline scripts (for React), and eval (for Vite HMR in development)
- **`style-src 'self' 'unsafe-inline'`** - Allow styles from same origin and inline styles
- **`img-src 'self' data: blob:`** - Allow images from same origin, data URLs, and blob URLs
- **`font-src 'self' data:`** - Allow fonts from same origin and data URLs
- **`connect-src 'self' https://unpkg.com https://*.unpkg.com`** - Allow connections to same origin and unpkg.com for geography data
- **`object-src 'none'`** - Disable plugins like Flash
- **`base-uri 'self'`** - Restrict base tag to same origin
- **`form-action 'self'`** - Restrict form submissions to same origin
- **`frame-ancestors 'none'`** - Prevent embedding in frames (clickjacking protection)
- **`upgrade-insecure-requests`** - Automatically upgrade HTTP to HTTPS

### Additional Security Headers

- **`X-Content-Type-Options: nosniff`** - Prevent MIME type sniffing
- **`X-Frame-Options: DENY`** - Prevent embedding in frames
- **`X-XSS-Protection: 1; mode=block`** - Enable XSS filtering
- **`Referrer-Policy: strict-origin-when-cross-origin`** - Control referrer information
- **`Permissions-Policy`** - Disable unnecessary browser features

## Development vs Production

### Development Configuration

In development (Vite dev server), the CSP includes additional directives:

- `ws:` and `wss:` in `connect-src` for Hot Module Replacement (HMR)
- `'unsafe-eval'` in `script-src` for Vite's development features

### Production Configuration

The HTML files include production-ready CSP headers that are more restrictive and suitable for deployment.

## External Resources

The examples use the following external resources:

- **unpkg.com** - For geography data (world-atlas package)

These are explicitly allowed in the CSP `connect-src` directive.

## Security Best Practices

1. **HTTPS Only**: The CSP includes `upgrade-insecure-requests` to force HTTPS
2. **No Inline Scripts**: Avoid inline JavaScript when possible
3. **Trusted Sources**: Only allow resources from trusted domains
4. **Regular Updates**: Keep dependencies updated for security patches
5. **Error Boundaries**: Use React error boundaries to handle failures gracefully

## Customizing Security

To modify the security configuration:

1. **HTML CSP**: Edit the `Content-Security-Policy` meta tag in `index.html`
2. **Vite Dev Server**: Modify the `server.headers` in `vite.config.ts`
3. **Production Deployment**: Configure CSP headers at the server level

### Example: Adding a New External Resource

If you need to load data from a new domain, add it to the CSP:

```html
<!-- In index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  ...
  connect-src 'self' https://unpkg.com https://your-new-domain.com;
  ...
"
/>
```

```typescript
// In vite.config.ts
headers: {
  'Content-Security-Policy': [
    // ...
    "connect-src 'self' ws: wss: https://unpkg.com https://your-new-domain.com",
    // ...
  ].join('; '),
}
```

## Security Testing

To test the CSP implementation:

1. Open browser developer tools
2. Check the Console for CSP violations
3. Verify that external resources load correctly
4. Test that unauthorized resources are blocked

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by emailing the maintainer directly rather than opening a public issue.
