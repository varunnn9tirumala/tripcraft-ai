import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'trip-craft';

  return (
    <footer className="border-t border-orange-200 bg-white dark:border-orange-800 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-orange-900 dark:text-orange-100">Trip Craft</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">Your AI-powered travel planning companion</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-orange-900 dark:text-orange-100">Quick Links</h3>
            <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-orange-900 dark:text-orange-100">Follow Us</h3>
            <div className="flex gap-4">
              <SiX className="h-5 w-5 text-orange-600 hover:text-orange-700 cursor-pointer" />
              <SiFacebook className="h-5 w-5 text-orange-600 hover:text-orange-700 cursor-pointer" />
              <SiInstagram className="h-5 w-5 text-orange-600 hover:text-orange-700 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-orange-200 pt-8 text-center text-sm text-orange-700 dark:border-orange-800 dark:text-orange-300">
          <p>
            © {currentYear} Trip Craft. Built with <Heart className="inline h-4 w-4 text-orange-600" fill="currentColor" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
