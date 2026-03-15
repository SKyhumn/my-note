import { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { auth } from "./SDK/firebase";
import { onAuthStateChanged } from "firebase/auth";

import type { Category } from "./types/Category";
import type { User } from "firebase/auth";

import MainPage from "./pages/MainPage";
import WriteNote from "./pages/WriteNote";
import WrittenNote from "./pages/WrittenNote";
import Edit from "./pages/EditNote";
import AuthModal from "./components/modals/AuthModal";

function App() {
  const [user, setUser] = useState<User|null> (null);
  const [loading, setLoading] = useState<boolean> (true);

  const [category, setCategory] = useState<Category | null>(null);

  // 유저 여부
  useEffect(() => {
    const userOk = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    })

    return () => userOk();
  },[]);

  if (loading) return null;
  
  return (
    <div className="w-screen h-screen bg-gray-100">

      <BrowserRouter>

        <Routes>

          <Route 
          path="/" 
          element={
            <MainPage 
            user={user} 
            category={category} 
            setCategory={setCategory}
            />}
          />

          <Route 
          path="/write" 
          element={<WriteNote category={category}/>}
          />

          <Route 
          path="/:id" 
          element={<WrittenNote/>}
          />

          <Route
          path="/:id/edit"
          element={<Edit category={category}/>}
          />

        </Routes>

      </BrowserRouter>

      {user==null && <AuthModal/>}

    </div>
  )
}

export default App;
