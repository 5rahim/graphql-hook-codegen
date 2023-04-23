import { ServiceGeneratorPage } from '@/components/pages/ServiceGeneratorPage'
import { Test } from '@/components/Test'
import React, { useState } from 'react'
import { createRouter } from "@swan-io/chicane";
import { match } from "ts-pattern";
const Router = createRouter({
   Home: "/",
   Users: "/users",
   User: "/users/:userId",
});

function App() {
   const [count, setCount] = useState(0)
   const route = Router.useRoute(["Home", "Users", "User"]);
   
   return match(route)
      .with({ name: "Home" }, () => <ServiceGeneratorPage />)
      .otherwise(() => <h1>404</h1>);
}

export default App
