import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script'; // <-- This import was missing

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Empathway - Mental Wellness Platform",
  description: "Your journey to mental wellness starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Empathway - Mental Wellness Platform</title>
        <meta name="description" content="Your journey to mental wellness starts here." />
        <meta name="keywords" content="mental health, wellness, therapy, online therapy, support groups, self-care" />
        <link href="/assets/img/favicon.png" rel="icon" />
        <link href="/assets/img/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
        <link href="/assets/vendor/aos/aos.css" rel="stylesheet" />
        <link href="/assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />
        <link href="/assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
        <link href="/assets/css/main.css" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <header id="header" className="header fixed-top">
          <div className="topbar d-flex align-items-center">
            <div className="container d-flex justify-content-center justify-content-md-between">
              <div className="contact-info d-flex align-items-center">
                <i className="bi bi-envelope d-flex align-items-center">
                  <a href="mailto:contact@empathway.com">contact@empathway.com</a>
                </i>
                <i className="bi bi-phone d-flex align-items-center ms-4">
                  <span>+1 555-123-4567</span>
                </i>
              </div>
              <div className="languages d-none d-md-flex align-items-center">
                <ul>
                  <li>En</li>
                  <li><a href="#">De</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="branding d-flex align-items-cente">
            <div className="container position-relative d-flex align-items-center justify-content-between">
              <a href="index.html" className="logo d-flex align-items-center me-auto me-xl-0">
                <h1 className="sitename">Empathway</h1>
              </a>
              <nav id="navmenu" className="navmenu">
                <ul>
                  <li><a href="#hero" className="active">Home<br /></a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#menu">Services</a></li>
                  <li><a href="#specials">Programs</a></li>
                  <li><a href="#events">Workshops</a></li>
                  <li><a href="#chefs">Team</a></li>
                  <li><a href="#gallery">Gallery</a></li>
                  <li className="dropdown">
                    <a href="#"><span>Resources</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul>
                      <li><a href="#">Articles</a></li>
                      <li><a href="#">Guides</a></li>
                      <li><a href="#">Tools</a></li>
                    </ul>
                  </li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
                <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
              </nav>
              <a className="btn-book-a-table d-none d-xl-block" href="#book-a-table">Book a Session</a>
            </div>
          </div>
        </header>

        {children}

        <footer id="footer" className="footer">
          <div className="container footer-top">
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6 footer-about">
                <a href="index.html" className="logo d-flex align-items-center">
                  <span className="sitename">Empathway</span>
                </a>
                <div className="footer-contact pt-3">
                  <p>A108 Adam Street</p>
                  <p>New York, NY 535022</p>
                  <p className="mt-3"><strong>Phone:</strong> <span>+1 555-123-4567</span></p>
                  <p><strong>Email:</strong> <span>info@empathway.com</span></p>
                </div>
                <div className="social-links d-flex mt-4">
                  <a href=""><i className="bi bi-twitter-x"></i></a>
                  <a href=""><i className="bi bi-facebook"></i></a>
                  <a href=""><i className="bi bi-instagram"></i></a>
                  <a href=""><i className="bi bi-linkedin"></i></a>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About us</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Terms of service</a></li>
                  <li><a href="#">Privacy policy</a></li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li><a href="#">Therapy Sessions</a></li>
                  <li><a href="#">Guided Meditations</a></li>
                  <li><a href="#">Support Groups</a></li>
                  <li><a href="#">Wellness Workshops</a></li>
                  <li><a href="#">Self-Care Tools</a></li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-12 footer-newsletter">
                <h4>Our Newsletter</h4>
                <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
                <form action="forms/newsletter.php" method="post" className="php-email-form">
                  <div className="newsletter-form">
                    <input type="email" name="email" />
                    <input type="submit" value="Subscribe" />
                  </div>
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">Your subscription request has been sent. Thank you!</div>
                </form>
              </div>
            </div>
          </div>

          <div className="container copyright text-center mt-4">
            <p>© <span>Copyright</span> <strong className="px-1 sitename">Empathway</strong> <span>All Rights Reserved</span></p>
            <div className="credits">
              Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a> Distributed by <a href="https://themewagon.com" target="_blank">ThemeWagon</a>
            </div>
          </div>
        </footer>

        {/* Scroll Top */}
        <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
          <i className="bi bi-arrow-up-short"></i>
        </a>

        {/* Preloader */}
        <div id="preloader"></div>

        {/* Vendor JS Files */}
        <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/php-email-form/validate.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/aos/aos.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/glightbox/js/glightbox.min.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/isotope-layout/isotope.pkgd.min.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/swiper/swiper-bundle.min.js" strategy="lazyOnload" />

        {/* Main JS File */}
        <Script src="/assets/js/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}