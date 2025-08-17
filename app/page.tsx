'use client';

export default function Home() {
  return (
    <main className="main">
      {/* Hero Section */}
      <section id="hero" className="hero section dark-background">
        <img src="/assets/img/hero-bg.jpg" alt="A person in a tranquil setting" data-aos="fade-in" />
        <div className="container">
          <div className="row">
            <div className="col-lg-8 d-flex flex-column align-items-center align-items-lg-start">
              <h2 data-aos="fade-up" data-aos-delay="100">Welcome to <span>Empathway</span></h2>
              <p data-aos="fade-up" data-aos-delay="200">Your journey to mental wellness starts here.</p>
              <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
                <a href="#menu" className="cta-btn">Our Services</a>
                <a href="#book-a-table" className="cta-btn">Book a Session</a>
              </div>
            </div>
            <div className="col-lg-4 d-flex align-items-center justify-content-center mt-5 mt-lg-0">
              <a href="https://www.youtube.com/watch?v=Y7f98aduVJ8" className="glightbox pulsating-play-btn"></a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-6 order-1 order-lg-2">
              <img src="/assets/img/about.jpg" className="img-fluid about-img" alt="A person meditating" />
            </div>
            <div className="col-lg-6 order-2 order-lg-1 content">
              <h3>Our Mission: Your Well-Being</h3>
              <p className="fst-italic">
                At Empathway, we believe that everyone deserves a clear path to mental and emotional well-being.
              </p>
              <ul>
                <li><i className="bi bi-check2-all"></i> <span>Providing a safe, supportive, and confidential space for self-discovery.</span></li>
                <li><i className="bi bi-check2-all"></i> <span>Offering expert guidance and a variety of evidence-based resources.</span></li>
                <li><i className="bi bi-check2-all"></i> <span>Empowering you to develop resilience and achieve lasting personal growth.</span></li>
              </ul>
              <p>
                Our platform is designed to be a trusted companion on your journey, offering tools and connections to help you navigate life's challenges with confidence and clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="why-us section">
        <div className="container section-title" data-aos="fade-up">
          <h2>WHY EMPATHWAY</h2>
          <p>Why Choose Our Platform</p>
        </div>
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card-item">
                <span>01</span>
                <h4><a href="#" className="stretched-link">Expert Guidance</a></h4>
                <p>Connect with licensed therapists and wellness coaches who are dedicated to your growth.</p>
              </div>
            </div>
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card-item">
                <span>02</span>
                <h4><a href="#" className="stretched-link">Holistic Approach</a></h4>
                <p>We offer a range of services from therapy and counseling to mindfulness and self-care tools.</p>
              </div>
            </div>
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card-item">
                <span>03</span>
                <h4><a href="#" className="stretched-link">Confidentiality</a></h4>
                <p>Your privacy is our priority. Our platform is a secure and confidential space for your journey.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="menu" className="menu section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Services</h2>
          <p>Explore Our Services</p>
        </div>
        <div className="container isotope-layout" data-default-filter="*" data-layout="masonry" data-sort="original-order">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-12 d-flex justify-content-center">
              <ul className="menu-filters isotope-filters">
                <li data-filter="*" className="filter-active">All</li>
                <li data-filter=".filter-starters">Therapy</li>
                <li data-filter=".filter-salads">Resources</li>
                <li data-filter=".filter-specialty">Workshops</li>
              </ul>
            </div>
          </div>
          <div className="row isotope-container" data-aos="fade-up" data-aos-delay="200">
            <div className="col-lg-6 menu-item isotope-item filter-starters">
              <img src="/assets/img/menu/lobster-bisque.jpg" className="menu-img" alt="Therapy Session" />
              <div className="menu-content">
                <a href="#">One-on-One Therapy</a><span>$5.95</span>
              </div>
              <div className="menu-ingredients">
                Connect with a licensed therapist for personalized sessions.
              </div>
            </div>
            <div className="col-lg-6 menu-item isotope-item filter-specialty">
              <img src="/assets/img/menu/bread-barrel.jpg" className="menu-img" alt="Meditation Session" />
              <div className="menu-content">
                <a href="#">Guided Meditations</a><span>$6.95</span>
              </div>
              <div className="menu-ingredients">
                A library of guided meditations to help you find calm and focus.
              </div>
            </div>
            <div className="col-lg-6 menu-item isotope-item filter-starters">
              <img src="/assets/img/menu/cake.jpg" className="menu-img" alt="Support Group" />
              <div className="menu-content">
                <a href="#">Peer Support Groups</a><span>$7.95</span>
              </div>
              <div className="menu-ingredients">
                Join a supportive community to share experiences and find solidarity.
              </div>
            </div>
            <div className="col-lg-6 menu-item isotope-item filter-salads">
              <img src="/assets/img/menu/caesar.jpg" className="menu-img" alt="Mindfulness Tools" />
              <div className="menu-content">
                <a href="#">Mindfulness Toolkit</a><span>$8.95</span>
              </div>
              <div className="menu-ingredients">
                Interactive tools and exercises to help you practice mindfulness daily.
              </div>
            </div>
            <div className="col-lg-6 menu-item isotope-item filter-specialty">
              <img src="/assets/img/menu/tuscan-grilled.jpg" className="menu-img" alt="Personalized Plan" />
              <div className="menu-content">
                <a href="#">Personalized Wellness Plan</a><span>$9.95</span>
              </div>
              <div className="menu-ingredients">
                A customized plan to help you achieve your mental health goals.
              </div>
            </div>
            <div className="col-lg-6 menu-item isotope-item filter-starters">
              <img src="/assets/img/menu/mozzarella.jpg" className="menu-img" alt="Coping Skills" />
              <div className="menu-content">
                <a href="#">Coping Skills Training</a><span>$4.95</span>
              </div>
              <div className="menu-ingredients">
                Learn effective strategies to manage stress and emotional challenges.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="specials" className="specials section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Programs</h2>
          <p>Check Our Featured Programs</p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row">
            <div className="col-lg-3">
              <ul className="nav nav-tabs flex-column">
                <li className="nav-item">
                  <a className="nav-link active show" data-bs-toggle="tab" href="#specials-tab-1">Anxiety Management</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#specials-tab-2">Stress Reduction</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#specials-tab-3">Mindfulness in Practice</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#specials-tab-4">Building Resilience</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#specials-tab-5">Navigating Relationships</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 mt-4 mt-lg-0">
              <div className="tab-content">
                <div className="tab-pane active show" id="specials-tab-1">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Architecto ut aperiam autem id</h3>
                      <p className="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                      <p>Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="/assets/img/specials-1.png" alt="Anxiety management program" className="img-fluid" />
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="specials-tab-2">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Et blanditiis nemo veritatis excepturi</h3>
                      <p className="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                      <p>Ea ipsum voluptatem consequatur quis est. Illum error ullam omnis quia et reiciendis sunt sunt est. Non aliquid repellendus itaque accusamus eius et velit ipsa voluptates. Optio nesciunt eaque beatae accusamus lerode pakto madirna desera vafle de nideran pal</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="/assets/img/specials-2.png" alt="Stress reduction program" className="img-fluid" />
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="specials-tab-3">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Impedit facilis occaecati odio neque aperiam sit</h3>
                      <p className="fst-italic">Eos voluptatibus quo. Odio similique illum id quidem non enim fuga. Qui natus non sunt dicta dolor et. In asperiores velit quaerat perferendis aut</p>
                      <p>Iure officiis odit rerum. Harum sequi eum illum corrupti culpa veritatis quisquam. Neque necessitatibus illo rerum eum ut. Commodi ipsam minima molestiae sed laboriosam a iste odio. Earum odit nesciunt fugiat sit ullam. Soluta et harum voluptatem optio quae</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="/assets/img/specials-3.png" alt="Mindfulness program" className="img-fluid" />
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="specials-tab-4">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Fuga dolores inventore laboriosam ut est accusamus laboriosam dolore</h3>
                      <p className="fst-italic">Totam aperiam accusamus. Repellat consequuntur iure voluptas iure porro quis delectus</p>
                      <p>Eaque consequuntur consequuntur libero expedita in voluptas. Nostrum ipsam necessitatibus aliquam fugiat debitis quis velit. Eum ex maxime error in consequatur corporis atque. Eligendi asperiores sed qui veritatis aperiam quia a laborum inventore</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="/assets/img/specials-4.png" alt="Resilience program" className="img-fluid" />
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="specials-tab-5">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Est eveniet ipsam sindera pad rone matrelat sando reda</h3>
                      <p className="fst-italic">Omnis blanditiis saepe eos autem qui sunt debitis porro quia.</p>
                      <p>Exercitationem nostrum omnis. Ut reiciendis repudiandae minus. Omnis recusandae ut non quam ut quod eius qui. Ipsum quia odit vero atque qui quibusdam amet. Occaecati sed est sint aut vitae molestiae voluptate vel</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="/assets/img/specials-5.png" alt="Relationships program" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section id="events" className="events section">
        <img className="slider-bg" src="/assets/img/events-bg.jpg" alt="A serene background image" data-aos="fade-in" />
        <div className="container">
          <div className="swiper init-swiper" data-aos="fade-up" data-aos-delay="100">
            <script type="application/json" className="swiper-config">
              {`
                {
                  "loop": true,
                  "speed": 600,
                  "autoplay": {
                    "delay": 5000
                  },
                  "slidesPerView": "auto",
                  "pagination": {
                    "el": ".swiper-pagination",
                    "type": "bullets",
                    "clickable": true
                  }
                }
              `}
            </script>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="row gy-4 event-item">
                  <div className="col-lg-6">
                    <img src="/assets/img/events-slider/events-slider-1.jpg" className="img-fluid" alt="A mental health workshop" />
                  </div>
                  <div className="col-lg-6 pt-4 pt-lg-0 content">
                    <h3>Stress Management Workshop</h3>
                    <div className="price">
                      <p><span>$189</span></p>
                    </div>
                    <p className="fst-italic">
                      Learn practical techniques to cope with daily stress and build resilience.
                    </p>
                    <ul>
                      <li><i className="bi bi-check2-circle"></i> <span>Identifying your stress triggers.</span></li>
                      <li><i className="bi bi-check2-circle"></i> <span>Mindful breathing and relaxation exercises.</span></li>
                      <li><i className="bi bi-check2-circle"></i> <span>Developing a personalized stress management plan.</span></li>
                    </ul>
                    <p>
                      This interactive workshop is designed to provide you with the tools you need to regain control and find peace in your life.
                    </p>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="row gy-4 event-item">
                  <div className="col-lg-6">
                    <img src="/assets/img/events-slider/events-slider-2.jpg" className="img-fluid" alt="Private consultation session" />
                  </div>
                  <div className="col-lg-6 pt-4 pt-lg-0 content">
                    <h3>Private Consultations</h3>
                    <div className="price">
                      <p><span>$290</span></p>
                    </div>
                    <p className="fst-italic">
                      Receive one-on-one personalized support and guidance from a mental health professional.
                    </p>
                    <ul>
                      <li><i className="bi bi-check2-circle"></i> <span>Tailored sessions to meet your individual needs.</span></li>
                      <li><i className="bi bi-check2-circle"></i> <span>A safe and confidential space for open discussion.</span></li>
                      <li><i className="bi bi-check2-circle"></i> <span>Focused strategies for personal growth.</span></li>
                    </ul>
                    <p>
                      Our private consultations offer a dedicated space for you to explore your thoughts and feelings with an experienced professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>

      {/* Book A Session Section */}
      <section id="book-a-table" className="book-a-table section">
        <div className="container section-title" data-aos="fade-up">
          <h2>RESERVATION</h2>
          <p>Book a Session</p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <form action="forms/book-a-table.php" method="post" role="form" className="php-email-form">
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6">
                <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="text" className="form-control" name="phone" id="phone" placeholder="Your Phone" required />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="date" name="date" className="form-control" id="date" placeholder="Date" required />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="time" className="form-control" name="time" id="time" placeholder="Time" required />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="number" className="form-control" name="people" id="people" placeholder="# of people" required />
              </div>
            </div>
            <div className="form-group mt-3">
              <textarea className="form-control" name="message" rows={5} placeholder="Message"></textarea>
            </div>
            <div className="text-center mt-3">
              <div className="loading">Loading</div>
              <div className="error-message"></div>
              <div className="sent-message">Your booking request was sent. We will call back or send an Email to confirm your reservation. Thank you!</div>
              <button type="submit">Book a Session</button>
            </div>
          </form>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Testimonials</h2>
          <p>What they're saying about us</p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="swiper init-swiper" data-speed="600" data-delay="5000" data-breakpoints="{ '320': { 'slidesPerView': 1, 'spaceBetween': 40 }, '1200': { 'slidesPerView': 3, 'spaceBetween': 40 } }">
            <script type="application/json" className="swiper-config">
              {`
                {
                  "loop": true,
                  "speed": 600,
                  "autoplay": {
                    "delay": 5000
                  },
                  "slidesPerView": "auto",
                  "pagination": {
                    "el": ".swiper-pagination",
                    "type": "bullets",
                    "clickable": true
                  },
                  "breakpoints": {
                    "320": {
                      "slidesPerView": 1,
                      "spaceBetween": 40
                    },
                    "1200": {
                      "slidesPerView": 3,
                      "spaceBetween": 20
                    }
                  }
                }
              `}
            </script>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="testimonial-item">
                  <p>
                    <i className="bi bi-quote quote-icon-left"></i>
                    <span>Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.</span>
                    <i className="bi bi-quote quote-icon-right"></i>
                  </p>
                  <img src="/assets/img/testimonials/testimonials-1.jpg" className="testimonial-img" alt="Testimonial photo" />
                  <h3>Saul Goodman</h3>
                  <h4>Ceo & Founder</h4>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="testimonial-item">
                  <p>
                    <i className="bi bi-quote quote-icon-left"></i>
                    <span>Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.</span>
                    <i className="bi bi-quote quote-icon-right"></i>
                  </p>
                  <img src="/assets/img/testimonials/testimonials-2.jpg" className="testimonial-img" alt="Testimonial photo" />
                  <h3>Sara Wilsson</h3>
                  <h4>Designer</h4>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="testimonial-item">
                  <p>
                    <i className="bi bi-quote quote-icon-left"></i>
                    <span>Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.</span>
                    <i className="bi bi-quote quote-icon-right"></i>
                  </p>
                  <img src="/assets/img/testimonials/testimonials-3.jpg" className="testimonial-img" alt="Testimonial photo" />
                  <h3>Jena Karlis</h3>
                  <h4>Store Owner</h4>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="testimonial-item">
                  <p>
                    <i className="bi bi-quote quote-icon-left"></i>
                    <span>Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.</span>
                    <i className="bi bi-quote quote-icon-right"></i>
                  </p>
                  <img src="/assets/img/testimonials/testimonials-4.jpg" className="testimonial-img" alt="Testimonial photo" />
                  <h3>Matt Brandon</h3>
                  <h4>Freelancer</h4>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="testimonial-item">
                  <p>
                    <i className="bi bi-quote quote-icon-left"></i>
                    <span>Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.</span>
                    <i className="bi bi-quote quote-icon-right"></i>
                  </p>
                  <img src="/assets/img/testimonials/testimonials-5.jpg" className="testimonial-img" alt="Testimonial photo" />
                  <h3>John Larson</h3>
                  <h4>Entrepreneur</h4>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Gallery</h2>
          <p>Moments of tranquility and healing</p>
        </div>
        <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
          <div className="row g-0">
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-1.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-1.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-2.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-2.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-3.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-3.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-4.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-4.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-5.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-5.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-6.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-6.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-7.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-7.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href="/assets/img/gallery/gallery-8.jpg" className="glightbox" data-gallery="images-gallery">
                  <img src="/assets/img/gallery/gallery-8.jpg" alt="" className="img-fluid" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="chefs" className="chefs section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Our Team</h2>
          <p>Meet Our Mental Health Professionals</p>
        </div>
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="member">
                <img src="/assets/img/chefs/chefs-1.jpg" className="img-fluid" alt="A professional team member" />
                <div className="member-info">
                  <div className="member-info-content">
                    <h4>Walter White</h4>
                    <span>Licensed Therapist</span>
                  </div>
                  <div className="social">
                    <a href=""><i className="bi bi-twitter-x"></i></a>
                    <a href=""><i className="bi bi-facebook"></i></a>
                    <a href=""><i className="bi bi-instagram"></i></a>
                    <a href=""><i className="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
              <div className="member">
                <img src="/assets/img/chefs/chefs-2.jpg" className="img-fluid" alt="A professional team member" />
                <div className="member-info">
                  <div className="member-info-content">
                    <h4>Sarah Jhonson</h4>
                    <span>Wellness Coach</span>
                  </div>
                  <div className="social">
                    <a href=""><i className="bi bi-twitter-x"></i></a>
                    <a href=""><i className="bi bi-facebook"></i></a>
                    <a href=""><i className="bi bi-instagram"></i></a>
                    <a href=""><i className="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
              <div className="member">
                <img src="/assets/img/chefs/chefs-3.jpg" className="img-fluid" alt="A professional team member" />
                <div className="member-info">
                  <div className="member-info-content">
                    <h4>William Anderson</h4>
                    <span>Counseling Psychologist</span>
                  </div>
                  <div className="social">
                    <a href=""><i className="bi bi-twitter-x"></i></a>
                    <a href=""><i className="bi bi-facebook"></i></a>
                    <a href=""><i className="bi bi-instagram"></i></a>
                    <a href=""><i className="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Contact</h2>
          <p>Contact Us</p>
        </div>
        <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
          <iframe style={{ border: 0, width: '100%', height: '400px' }} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus" frameBorder="0" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-4">
              <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                <i className="bi bi-geo-alt flex-shrink-0"></i>
                <div>
                  <h3>Location</h3>
                  <p>A108 Adam Street, New York, NY 535022</p>
                </div>
              </div>
              <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                <i className="bi bi-telephone flex-shrink-0"></i>
                <div>
                  <h3>Open Hours</h3>
                  <p>Monday-Friday:<br />9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                <i className="bi bi-telephone flex-shrink-0"></i>
                <div>
                  <h3>Call Us</h3>
                  <p>+1 555-123-4567</p>
                </div>
              </div>
              <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="500">
                <i className="bi bi-envelope flex-shrink-0"></i>
                <div>
                  <h3>Email Us</h3>
                  <p>info@empathway.com</p>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="200">
                <div className="row gy-4">
                  <div className="col-md-6">
                    <input type="text" name="name" className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="col-md-6">
                    <input type="email" className="form-control" name="email" placeholder="Your Email" required />
                  </div>
                  <div className="col-md-12">
                    <input type="text" className="form-control" name="subject" placeholder="Subject" required />
                  </div>
                  <div className="col-md-12">
                    <textarea className="form-control" name="message" rows={6} placeholder="Message" required></textarea>
                  </div>
                  <div className="col-md-12 text-center">
                    <div className="loading">Loading</div>
                    <div className="error-message"></div>
                    <div className="sent-message">Your message has been sent. Thank you!</div>
                    <button type="submit">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}