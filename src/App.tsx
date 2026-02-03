import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import StickyDownloadButton from "./components/StickyDownloadButton";

const Index = lazy(() => import("./pages/Index"));
const IndustryExpertise = lazy(() => import("./pages/IndustryExpertise"));
const MergersAcquisitions = lazy(() => import("./pages/MergersAcquisitions"));
const Events = lazy(() => import("./pages/Events"));
const Articles = lazy(() => import("./pages/Articles"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Staff = lazy(() => import("./pages/Staff"));
const Team = lazy(() => import("./pages/Team"));

const FAQ = lazy(() => import("./pages/FAQ"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Individual Service Pages
const IRCSection409AValuation = lazy(
  () => import("./pages/IRCSection409AValuation"),
);
const HealthcareValuations = lazy(() => import("./pages/HealthcareValuations"));
const EstateGiftTaxValuations = lazy(
  () => import("./pages/EstateGiftTaxValuations"),
);
const MatrimonialValuationLitigationSupport = lazy(
  () => import("./pages/MatrimonialValuationLitigationSupport"),
);
const DamagesLostProfitClaims = lazy(
  () => import("./pages/DamagesLostProfitClaims"),
);
const FairValueMeasurement = lazy(() => import("./pages/FairValueMeasurement"));
const ShareholderDisputesBusinessDivorce = lazy(
  () => import("./pages/ShareholderDisputesBusinessDivorce"),
);
const QualityOfEarningsReport = lazy(
  () => import("./pages/QualityOfEarningsReport"),
);
const ValuationsForUnderwritingLendingPurposes = lazy(
  () => import("./pages/ValuationsForUnderwritingLendingPurposes"),
);
const Login = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
// const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute")); // Using context-based one now
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageBlogs = lazy(() => import("./pages/admin/blogs/ManageBlogs"));
const BlogEditor = lazy(() => import("./pages/admin/blogs/BlogEditor"));
const ManageArticles = lazy(
  () => import("./pages/admin/articles/ManageArticles"),
);
const ArticleEditor = lazy(
  () => import("./pages/admin/articles/ArticleEditor"),
);
const ManageEvents = lazy(() => import("./pages/admin/events/ManageEvents"));
const EventEditor = lazy(() => import("./pages/admin/events/EventEditor"));
const ManageLeads = lazy(() => import("./pages/admin/leads/ManageLeads"));
// Admin Imports

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<Contact />} />

                {/* Service Routes */}
                <Route
                  path="/services/irc-section-409a-valuation"
                  element={<IRCSection409AValuation />}
                />
                <Route
                  path="/services/mergers-acquisitions"
                  element={<MergersAcquisitions />}
                />
                <Route
                  path="/services/healthcare-valuations"
                  element={<HealthcareValuations />}
                />
                <Route
                  path="/services/estate-gift-tax-valuations"
                  element={<EstateGiftTaxValuations />}
                />
                <Route
                  path="/services/matrimonial-valuation-litigation-support"
                  element={<MatrimonialValuationLitigationSupport />}
                />
                <Route
                  path="/services/damages-lost-profit-claims"
                  element={<DamagesLostProfitClaims />}
                />
                <Route
                  path="/services/fair-value-measurement"
                  element={<FairValueMeasurement />}
                />
                <Route
                  path="/services/shareholder-disputes-business-divorce"
                  element={<ShareholderDisputesBusinessDivorce />}
                />
                <Route
                  path="/services/quality-of-earnings-report"
                  element={<QualityOfEarningsReport />}
                />
                <Route
                  path="/services/valuations-for-underwriting-lending-purposes"
                  element={<ValuationsForUnderwritingLendingPurposes />}
                />

                <Route path="/about" element={<About />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/team" element={<Team />} />
                <Route
                  path="/industry-expertise"
                  element={<IndustryExpertise />}
                />
                <Route path="/events" element={<Events />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/faqs" element={<FAQ />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/admin" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/leads" element={<ManageLeads />} />
                    <Route path="/admin/blogs" element={<ManageBlogs />} />
                    <Route path="/admin/blogs/:id" element={<BlogEditor />} />
                    <Route
                      path="/admin/articles"
                      element={<ManageArticles />}
                    />
                    <Route
                      path="/admin/articles/:id"
                      element={<ArticleEditor />}
                    />
                    <Route path="/admin/events" element={<ManageEvents />} />
                    <Route path="/admin/events/:id" element={<EventEditor />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <StickyDownloadButton />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
