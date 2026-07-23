/** @type {import('next').NextConfig} */
const GUIDE =
  '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight';

const nextConfig = {
  async redirects() {
    return [
      // App access
      { source: '/login', destination: 'https://portal.subtradesoftware.com', permanent: true },
      { source: '/portal', destination: 'https://portal.subtradesoftware.com', permanent: true },
      { source: '/signup', destination: 'https://portal.subtradesoftware.com/signup', permanent: false },
      { source: '/free-trial', destination: 'https://portal.subtradesoftware.com/signup', permanent: false },

      // Duplicate pages -> canonical twins
      { source: '/pricing', destination: '/pricing-plans', permanent: true },
      { source: '/features', destination: '/construction-management-features', permanent: true },
      { source: '/project-dashboard', destination: '/construction-management-features/project-dashboard', permanent: true },
      { source: '/task-management', destination: '/construction-management-features/task-management', permanent: true },
      { source: '/15min-demo', destination: '/construction-software-15min-demo', permanent: true },
      { source: '/ticket', destination: '/contact-us', permanent: true },
      { source: '/free-tools', destination: '/construction-templates', permanent: true },
      { source: '/free-tools/access', destination: '/construction-templates', permanent: true },
      { source: '/whats-new', destination: '/blog', permanent: true },

      // Tutorials index -> library (individual tutorials are real pages now)
      { source: '/tutorials', destination: '/how-to-tutorials', permanent: true },
      // Leftover dev-template posts, not SubTrade content
      { source: '/tutorials/javascript-es6-features', destination: '/how-to-tutorials', permanent: true },
      { source: '/tutorials/how-to-build-a-react-app', destination: '/how-to-tutorials', permanent: true },
      { source: '/tutorials/css-grid-layout-mastery', destination: '/how-to-tutorials', permanent: true },
      { source: '/categories/:path*', destination: '/blog', permanent: true },

      // Thin blog posts -> nearest relevant canonical
      { source: '/how-subcontractor-software-streamlines-your-construction-projects', destination: GUIDE, permanent: true },
      { source: '/why-commercial-subcontractor-software-like-subtrade-is-a-game-changer-for-your-business', destination: GUIDE, permanent: true },
      { source: '/residential-subcontractor-software-like-subtrade-boost-efficiency-for-roofers-and-painters-with-advanced-tools', destination: GUIDE, permanent: true },
      { source: '/from-site-to-office-subtrade-software-field-productivity', destination: GUIDE, permanent: true },
      { source: '/from-crew-to-office-how-subtrade-keeps-your-subcontracting-team-in-sync', destination: GUIDE, permanent: true },
      { source: '/ocuments-with-subtrades-cloud-system', destination: GUIDE, permanent: true },
      { source: '/safety-compliance-with-digital-checklist', destination: '/construction-management-features/safety-custom-forms', permanent: true },
      { source: '/stay-compliant-with-easy-to-use-audit-tools-like-subtrade', destination: '/construction-management-features/safety-custom-forms', permanent: true },
      { source: '/top-5-benefits-of-subtrade-software-for-hvac-contractors', destination: '/hvac-contractor-software', permanent: true },
      { source: '/subtrade-vs-gc-software', destination: '/compare', permanent: true },
      { source: '/fsm-software', destination: '/', permanent: true },
      { source: '/real-profitability', destination: '/', permanent: true },
      { source: '/instagram-home-page', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
