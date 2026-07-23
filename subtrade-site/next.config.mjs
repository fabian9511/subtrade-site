/** @type {import('next').NextConfig} */
const GUIDE =
  '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight/';

const nextConfig = {
  // Match the old WordPress site: every URL ends with a trailing slash.
  // This keeps the new URLs byte-identical to what Google already has indexed,
  // so no existing page gets redirected on launch.
  trailingSlash: true,

  async redirects() {
    return [
      // App access
      { source: '/login', destination: 'https://portal.subtradesoftware.com', permanent: true },
      { source: '/portal', destination: 'https://portal.subtradesoftware.com', permanent: true },
      { source: '/signup', destination: 'https://portal.subtradesoftware.com/signup', permanent: false },
      { source: '/free-trial', destination: 'https://portal.subtradesoftware.com/signup', permanent: false },

      // Duplicate pages -> canonical twins
      { source: '/pricing', destination: '/pricing-plans/', permanent: true },
      { source: '/features', destination: '/construction-management-features/', permanent: true },
      { source: '/project-dashboard', destination: '/construction-management-features/project-dashboard/', permanent: true },
      { source: '/task-management', destination: '/construction-management-features/task-management/', permanent: true },
      { source: '/15min-demo', destination: '/construction-software-15min-demo/', permanent: true },
      { source: '/ticket', destination: '/contact-us/', permanent: true },
      { source: '/free-tools', destination: '/construction-templates/', permanent: true },
      { source: '/free-tools/access', destination: '/construction-templates/', permanent: true },
      { source: '/whats-new', destination: '/blog/', permanent: true },

      // Old standalone pages that no longer exist -> nearest match
      { source: '/interactivedemo', destination: '/construction-software-15min-demo/', permanent: true },
      { source: '/thankyou', destination: '/', permanent: true },

      // Tutorials index -> library (individual tutorials are real pages now)
      { source: '/tutorials', destination: '/how-to-tutorials/', permanent: true },
      // Leftover dev-template posts, not SubTrade content
      { source: '/tutorials/javascript-es6-features', destination: '/how-to-tutorials/', permanent: true },
      { source: '/tutorials/how-to-build-a-react-app', destination: '/how-to-tutorials/', permanent: true },
      { source: '/tutorials/css-grid-layout-mastery', destination: '/how-to-tutorials/', permanent: true },
      { source: '/categories/:path*', destination: '/blog/', permanent: true },

      // Renamed tutorials: old slug -> new slug (closest content match)
      { source: '/tutorials/creating-and-submitting-a-detailed-daily-report-using-subtrade-software', destination: '/tutorials/creating-and-submitting-a-daily-report/', permanent: true },
      { source: '/tutorials/introducing-field-operations-subtrade-software', destination: '/tutorials/introducing-field-operations/', permanent: true },
      { source: '/tutorials/how-to-manage-change-orders', destination: '/tutorials/manage-change-orders-subtrade-software/', permanent: true },
      { source: '/tutorials/how-to-create-custom-notifications-in-subtrade-software', destination: '/tutorials/custom-notifications/', permanent: true },
      { source: '/tutorials/setup-new-employees-in-subtrade-software', destination: '/tutorials/setup-new-employees-fast-in-subtrade-software/', permanent: true },
      { source: '/tutorials/uploading-and-auto-naming-construction-drawings', destination: '/tutorials/subtrade-tutorial-auto-naming-construction-drawings/', permanent: true },
      { source: '/tutorials/manage-employee-shifts-efficiently-with-subtrade-scheduling', destination: '/tutorials/scheduling-feature-workflow-construction-drawings-upload/', permanent: true },
      { source: '/tutorials/activate-time-tracking-approval-and-splitting-features', destination: '/tutorials/time-tracking-approval-and-the-time-splitting/', permanent: true },
      { source: '/tutorials/approve-employee-time-sheets-using-subtrade-software', destination: '/tutorials/workflow-efficiency-with-employee-time-sheets/', permanent: true },
      { source: '/tutorials/manage-time-tracking-and-approvals-in-subtrade-software', destination: '/tutorials/manage-time-tracking-and-approvals/', permanent: true },

      // Thin blog posts -> nearest relevant canonical
      { source: '/how-subcontractor-software-streamlines-your-construction-projects', destination: GUIDE, permanent: true },
      { source: '/why-commercial-subcontractor-software-like-subtrade-is-a-game-changer-for-your-business', destination: GUIDE, permanent: true },
      { source: '/residential-subcontractor-software-like-subtrade-boost-efficiency-for-roofers-and-painters-with-advanced-tools', destination: GUIDE, permanent: true },
      { source: '/from-site-to-office-subtrade-software-field-productivity', destination: GUIDE, permanent: true },
      { source: '/from-crew-to-office-how-subtrade-keeps-your-subcontracting-team-in-sync', destination: GUIDE, permanent: true },
      { source: '/ocuments-with-subtrades-cloud-system', destination: GUIDE, permanent: true },
      { source: '/cut-material-waste-with-subtrade-tools', destination: GUIDE, permanent: true },
      { source: '/slash-construction-delays-30-with-subtrade', destination: GUIDE, permanent: true },
      { source: '/boost-crew-output-2x-using-subtrade-software', destination: GUIDE, permanent: true },
      { source: '/enhances-communication-between-gcs-and-subs', destination: GUIDE, permanent: true },
      { source: '/save-time-on-complex-construction-workflows', destination: GUIDE, permanent: true },
      { source: '/5-ways-subcontractors-can-reduce-rework-and-boost-profits-using-field‑first-software', destination: GUIDE, permanent: true },
      { source: '/safety-compliance-with-digital-checklist', destination: '/construction-management-features/safety-custom-forms/', permanent: true },
      { source: '/stay-compliant-with-easy-to-use-audit-tools-like-subtrade', destination: '/construction-management-features/safety-custom-forms/', permanent: true },
      { source: '/top-5-benefits-of-subtrade-software-for-hvac-contractors', destination: '/hvac-contractor-software/', permanent: true },
      { source: '/subtrade-vs-gc-software', destination: '/compare/', permanent: true },
      { source: '/fsm-software', destination: '/', permanent: true },
      { source: '/real-profitability', destination: '/', permanent: true },
      { source: '/instagram-home-page', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
