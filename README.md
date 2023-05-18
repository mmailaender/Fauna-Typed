# Install

```bash
pnpm install github:mmailaender/Fauna-React
pnpm install ts-node
```

# Create schema 
1. Create `fqlx.schema.json` file on root level (same level like `package.json`)
2. Add your schema

Example schema
```json
{
  "Car": {
    "fields": {
      "brand": "string",
      "owner": "Customer"
    }
  },
  "Customer": {
    "fields": {
      "name": "string",
      "cars": "[Cars]"
    }
  }
}
```


# Extend `package.json`

```
"scripts": {
    ...,
    "fqlx:generate": "ts-node node_modules/fqlx-client/src/converter.ts"
},
```

# Generate TS interfaces
```
pnpm fqlx:generate
```

You should see the following folder structure as output
```
|- fqlx-generated
| |- collectionsWithFields.ts
| |- typedefs.ts
```

# Configure Client

Wrap your App

## Nextjs
```tsx
import { FqlxProvider } from 'fqlx-client';
import './globals.css';
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <FqlxProvider
              config={{
                fqlxSecret: <userFaunaAccessToken>,
              }}
              
            >
          {children}
      </body>
    </html>
  );
}
```

# FqlxProvider

| Property   | Mandatory? | Description | Example |
|------------|------------|-----------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| fqlxSecret | ✔️         | The secret to authenticate with Fauna. Recommended to use an <br> accessToken from your users, that you received after user login | `fqlxSecret: useAuth()` |
| loader     | 🗙          | You can provide a skeleton loader component that displays <br> automatically that component during suspense.                      | `loader: {<Skeleton />}` |
| endpoint   | 🗙          | Specify the Fauna endpoint. Default is Fauna cloud `https://db.fauna.com`. If you're not a Fauna Beta tester, or using the Fauna Docker version you don't need this | `endpoint: new URL('https://db.fauna-preview.com')` |
