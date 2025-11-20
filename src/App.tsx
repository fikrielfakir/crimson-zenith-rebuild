import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import EventsActivities from "./pages/EventsActivities";
import Clubs from "./pages/Clubs";
import Book from "./pages/Book";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import SmartEvents from "./pages/SmartEvents";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import ClubsManagement from "./pages/admin/ClubsManagement";
import ClubForm from "./pages/admin/ClubForm";
import ClubsPendingApproval from "./pages/admin/ClubsPendingApproval";
import EventsManagement from "./pages/admin/EventsManagement";
import NewsManagement from "./pages/admin/NewsManagement";
import UserManagement from "./pages/admin/UserManagement";
import UserRolesManagement from "./pages/admin/UserRolesManagement";
import MediaLibrary from "./pages/admin/MediaLibrary";
import EmailCampaigns from "./pages/admin/EmailCampaigns";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import AdminSettings from "./pages/admin/AdminSettings";
import LandingManagement from "./pages/admin/LandingManagement";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import JoinUsConfig from "./pages/admin/JoinUsConfig";
import CookieSettings from "./pages/admin/CookieSettings";
import AuthSettings from "./pages/admin/AuthSettings";
import PaymentSettings from "./pages/admin/PaymentSettings";
import BookingManagement from "./pages/admin/BookingManagement";
import ThemeCustomization from "./pages/admin/ThemeCustomization";
import JoinUs from "./pages/JoinUs";
import ClubDetail from "./pages/ClubDetail";
import ActivityDetail from "./pages/ActivityDetail";
import CityDetail from "./pages/CityDetail";
import UserProfile from "./pages/UserProfile";
import ClubProfileEdit from "./pages/ClubProfileEdit";
import UserLogin from "./pages/UserLogin";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import CookieConsent from "./components/CookieConsent";

// Talents pages
import VolunteersSpontaneous from "./pages/VolunteersSpontaneous";
import VolunteersPosts from "./pages/VolunteersPosts";
import TalentsExperts from "./pages/TalentsExperts";
import WorkOffers from "./pages/WorkOffers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/discover/cities" element={<CityDetail />} />
          <Route path="/events" element={<EventsActivities />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/club/:id" element={<ClubDetail />} />
          <Route path="/activities/:activityName" element={<ActivityDetail />} />
          <Route path="/smart-events" element={<SmartEvents />} />
          <Route path="/book" element={<Book />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/join" element={<JoinUs />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/club/:clubId/edit" element={<ClubProfileEdit />} />
          
          {/* Talents Routes */}
          <Route path="/talents/volunteers/spontaneous" element={<VolunteersSpontaneous />} />
          <Route path="/talents/volunteers/posts" element={<VolunteersPosts />} />
          <Route path="/talents/experts" element={<TalentsExperts />} />
          <Route path="/talents/work-offers" element={<WorkOffers />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/clubs" element={
            <ProtectedRoute>
              <ClubsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/clubs/new" element={
            <ProtectedRoute>
              <ClubForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/clubs/:id/edit" element={
            <ProtectedRoute>
              <ClubForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute>
              <EventsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <NewsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/roles" element={
            <ProtectedRoute>
              <UserRolesManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/clubs/pending" element={
            <ProtectedRoute>
              <ClubsPendingApproval />
            </ProtectedRoute>
          } />
          <Route path="/admin/media" element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          } />
          <Route path="/admin/email" element={
            <ProtectedRoute>
              <EmailCampaigns />
            </ProtectedRoute>
          } />
          <Route path="/admin/monitor" element={
            <ProtectedRoute>
              <SystemMonitoring />
            </ProtectedRoute>
          } />
          <Route path="/admin/system" element={
            <ProtectedRoute>
              <SystemMonitoring />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/landing" element={
            <ProtectedRoute>
              <LandingManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/cms" element={
            <ProtectedRoute>
              <LandingManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute>
              <ApplicationsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/join-config" element={
            <ProtectedRoute>
              <JoinUsConfig />
            </ProtectedRoute>
          } />
          <Route path="/admin/cookies" element={
            <ProtectedRoute>
              <CookieSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/auth" element={
            <ProtectedRoute>
              <AuthSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute>
              <PaymentSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/booking" element={
            <ProtectedRoute>
              <BookingManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute>
              <BookingManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/theme" element={
            <ProtectedRoute>
              <ThemeCustomization />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
