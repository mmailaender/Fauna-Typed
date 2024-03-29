## Typesafe Client with built-in State Management for Fauna
!Only React supported at the moment!

# Motivation

Fauna provides with FQL 10 a typescript-like language, and offers built-in type-safety with Schema enforcement (TODO: Link). This client streamlines the typesafe experience between Fauna and your React project by

- syncing the types from Fauna to your Typescript project
- transform and compose your typesafe functions on the fly to FQL.X post Requests

![image](https://github.com/mmailaender/Fauna-Typed/assets/87228994/5260ec7e-9ae5-453f-a996-9fdaaff70cdf)

- Typesafe
- State Management built-in for Optimistic Response
- [TODO] Isomorphic (Code can run on Fauna or in Typescript runtime)
- [TODO] Svelte Support

# Getting Started

## Install

```bash
pnpm install fauna-typed
pnpm install ts-node
```

## Create schema

1. Create `fauna.schema.json` file on the root level (same level as `package.json`)
2. And add your schema into the file:

Example schema

```json
{
  "Car": {
    "fields": {
      "plate": "string",
      "brand": "string",
      "owner": "Customer"
    },
    "constraints": {
      "required": []
    }
  },
  "Customer": {
    "fields": {
      "name": "string",
      "cars": "Cars[]"
    },
    "constraints": {
      "required": ["name"]
    }
  }
}
```

## Extend `package.json`

```
"scripts": {
    ...,
    "fauna:generate": "ts-node node_modules/fauna-typed/src/converter.ts"
},
```

## Generate TS interfaces

```
pnpm fauna:generate
```

You should see the following folder structure as the output

```
|- fqlx-generated
| |- collectionsWithFields.ts
| |- typedefs.ts
```

## Configure Client

Wrap your App with the `<FaunaProvider>`

### Nextjs

```tsx
import { FaunaProvider } from 'fauna-typed';
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
        <FaunaProvider config={{ faunaSecret: <userFaunaAccessToken> }} >
          {children}
        </FaunaProvider>
      </body>
    </html>
  );
}
```

### FaunaProvider

| Property   | Mandatory? | Description                                                                                                                                                                      | Example                                             |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| faunaSecret | ✔️         | The secret to authenticate with Fauna. Recommended to use an <br> accessToken from your users, that you received after user login                                                | `faunaSecret: useAuth()`                             |
| loader     | 🗙          | You can provide a skeleton loader component that displays <br> automatically that component during suspense.                                                                     | `loader: {<Skeleton />}`                            |
| endpoint   | 🗙          | Specify the Fauna endpoint. The default is Fauna cloud `https://db.fauna.com`. If you're not a Fauna Beta tester or using the Fauna Docker version, you probably don't need this | `endpoint: new URL('https://db.fauna-preview.com')` |

## Use Client

```tsx
import { useQuery as query } from 'fauna-typed';

const OwnedCars = (customerId) => {
  return ({
    query.Customer.firstWhere((customer) => {customer.id == customerId}).cars.exec().map((car) => {
        return (
          <div>
            {car.plate}
          </div>
        )
      });
  });
}

export default OwnedCars;
```

### Execute query | .exec()

FQL 10 follows the same syntax as Typescript. e.g., `.map()` can be executed on `Fauna` or on `Browser/Edge/Node` side. That means we need to tell the app which part of the code should run on `Fauna` side and which code should run on `Browser/Edge/Node` side. <br><br>
For that, we use the

```js
.exec()
```

function. Put it at the end of your query, where you want to have a handover from `Fauna` to `Browser/Edge/Node` side. <br>

> Everything **before** `.exec()` will run on `Fauna` side. Everything **after** `.exec()` will run on `Browser/Edge/Node` side.

### Projection | .project()

With projection, you can define what data you want to return. With this, you can avoid over- and under-fetching. Also, you can fetch child fields.

```js
query.Customer.first().cars.project({
  plate = true,
  brand = true,
  owner = true,
})
.exec()
```

#### Fetch child fields

```js
query.Customer.first().cars.project({
  plate = true,
  brand = true,
  owner = {
    name = true,
  },
})
.exec()
```
> Unfortunately, we have not yet found a way to eliminate the `= true` appendix as part of the projection. If you know how to achieve this, we're happy to get your input (Contributions are also more as welcome). We're looking for something like that: .project({
  plate,
  brand,
  owner = {
    name,
  },
}
