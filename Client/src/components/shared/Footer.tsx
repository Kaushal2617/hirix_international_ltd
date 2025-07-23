import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RotatingCircleText from './RotatingCircleText';

const footerColumns = [
  {
    title: 'Customer Service',
    links: [
      { to: '/contact', label: 'Contact Us' },
      { to: '/faq', label: 'FAQ' },
      { to: '/shipping-returns', label: 'Shipping & Returns' },
      { to: '/track-order', label: 'Track Order' },
    ],
  },
  {
    title: 'About Homnix',
    links: [
      { to: '/about-us', label: 'About Us' },
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/bulk-orders', label: 'Bulk Orders' },
      { to: '/terms-and-conditions', label: 'Terms & Condition' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { to: '/sale', label: 'Sale' },
      { to: '/all-products', label: 'All Products' },
      { to: '/wishlist', label: 'Wishlist' },
      { to: '/cart', label: 'Cart' },
    ],
  },
];

const socialLinks = [
  {
    href: 'https://www.facebook.com/HirixDirect',
    label: 'Facebook',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/hirixdirect.uk/',
    label: 'Instagram',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.08c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      </svg>
    ),
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-10 px-2 sm:px-4">
      <div className="container mx-auto grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-6 items-start">
        {/* Brand Name Animated */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="flex items-center justify-center mb-8 lg:mb-0 text-left"
        >
          <RotatingCircleText />
        </motion.div>
        {/* Footer Columns */}
        {footerColumns.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: 'spring' }}
            className="mb-8 lg:mb-0 text-left"
          >
            <h3 className="text-lg font-semibold mb-4 text-white/90">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-red-400 focus:text-red-400 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
        {/* Social Icons - right aligned, last column, equally spaced */}
        <div className="flex flex-col h-full items-start justify-start mt-0 lg:mt-0 text-left">
          <span className="text-white/90 text-lg font-semibold mb-4 mt-0">Follow Us</span>
          <div className="flex gap-4 flex-wrap items-center">
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, type: 'spring' }}
                className="text-gray-300 hover:text-pink-400 transition-colors duration-200"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-gray-400 break-words">
        &copy; {new Date().getFullYear()} Homnix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;