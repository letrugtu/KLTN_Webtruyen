import "./index.css";
import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
} from "react-router-dom";
import { MainLayout } from "./layouts/mainLayout";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { AdminPage } from "./pages/Admin/AdminPage";
import { AdminLayout } from "./layouts/adminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Detail } from "./pages/Detail";
import { ChapterDetail } from "./pages/ChapterDetail";
import { ListStoriesOfCate } from "./pages/ListStoriesOfCate";
import { ListSearchStories } from "./pages/ListSearchStories";
import { ManageStories } from "./pages/Admin/ManageStories";
import { Profile } from "./pages/Profile";
import { MemberLayout } from "./layouts/memberLayout";
import { CreateNovel } from "./pages/CreateNovel";
import { CreateEditNovel } from "./components/CreateEditNovel";
import { EditNovel } from "./pages/EditNovel";
import { ManageAccounts } from "./pages/Admin/ManageAccount";
import { ManageReviews } from "./pages/Admin/ManageReviews";
import { ManageRate } from "./pages/Admin/ManageRating";
import { ManageCategories } from "./pages/Admin/ManageCate";

function App() {
  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signUp" element={<Auth type="signUp" />} />
          <Route path="/noveldetail/:id" element={<Detail />} />
          <Route path="/chapter/:nid/:id" element={<ChapterDetail />} />
          <Route path="/storiesofcate/:id" element={<ListStoriesOfCate />} />
          <Route path="/search/:search" element={<ListSearchStories />} />

          <Route path="/user" element={<MemberLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="createnovel" element={<CreateNovel />} />
            <Route path="editNovel/:id" element={<EditNovel />} />
          </Route>
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="addNovel" element={<CreateNovel />} />
            <Route path="editNovel/:id" element={<EditNovel />} />
            <Route path="manageNovel" element={<ManageStories />} />
            <Route path="managerAccount" element={<ManageAccounts />} />
            <Route path="managerReview" element={<ManageReviews />} />
            <Route path="managerRating" element={<ManageRate />} />
            <Route path="managerCategories" element={<ManageCategories />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
