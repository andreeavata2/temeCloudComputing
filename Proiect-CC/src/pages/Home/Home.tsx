import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Parallax } from "react-parallax";
import Carousel from "./Carousel";
import classNames from "classnames";
import Scrollspy from "react-scrollspy";
import * as Scroll from "react-scroll";
import DztImageGalleryComponent from "reactjs-image-gallery";
import NavItem from "./NavItem";
import ContactForm from "./ContactForm";
import { Link } from "react-router-dom";

export interface IAppState {
  scrolling: Boolean;
  collapseMenu: Boolean;
  tooltipOpen: boolean | undefined;
}

export default class Home extends React.Component<{}, IAppState> {
  constructor(props: IAppState) {
    super(props);
    this.state = {
      scrolling: false,
      collapseMenu: false,
      tooltipOpen: false,
    };
  }
  image1 = "img/electro-01.jpg";
  image2 = "img/infinite-loop-02.jpg";
  image3 = "img/infinite-loop-03.jpg";

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = (event: any) => {
    if (window.scrollY === 0 && this.state.scrolling === true) {
      this.setState({ scrolling: false });
    } else if (window.scrollY !== 0 && this.state.scrolling !== true) {
      this.setState({ scrolling: true });
    }
  };

  handleCollapse = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({
      collapseMenu: !this.state.collapseMenu,
    });
  };
  handleTooltip = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };

  public render() {
    var data = [
      {
        url: "https://m.media-amazon.com/images/I/411vKu8vgyL.jpg",
        title: "Small kitchen appliances",
        thumbUrl: "https://m.media-amazon.com/images/I/411vKu8vgyL.jpg",
      },
      {
        url: "https://s1.flanco.ro/catalog/category/electrocasnice_mari_2.jpg",
        title: "Big kitchen appliances",
        thumbUrl:
          "https://s1.flanco.ro/catalog/category/electrocasnice_mari_2.jpg",
      },
      {
        url:
          "https://www.pngkey.com/png/full/47-479224_rent-car-noosa-airport-transfer-sunshine-coast-car.png",
        title: "Rent a car",
        thumbUrl:
          "https://www.pngkey.com/png/full/47-479224_rent-car-noosa-airport-transfer-sunshine-coast-car.png",
      },
      {
        url:
          "https://s12emagst.akamaized.net/products/9782/9781633/images/res_e28dc82cb2716351e619d5d7ce30a585_full.jpg",
        title: "Clothes",
        thumbUrl:
          "https://s12emagst.akamaized.net/products/9782/9781633/images/res_e28dc82cb2716351e619d5d7ce30a585_full.jpg",
      },

      {
        url:
          "https://www.scule-austria.ro/media/catalog/product/cache/8/image/500x/9df78eab33525d08d6e5fb8d27136e95/s/e/set_3_unelte.jpg",
        title: "Tools",
        thumbUrl:
          "https://www.scule-austria.ro/media/catalog/product/cache/8/image/500x/9df78eab33525d08d6e5fb8d27136e95/s/e/set_3_unelte.jpg",
      },
      {
        url: "https://magoosh.com/hs/files/2017/06/shutterstock_276178202.jpg",
        title: "Books",
        thumbUrl:
          "https://magoosh.com/hs/files/2017/06/shutterstock_276178202.jpg",
      },
      {
        url:
          "data:image/jpeg;base64,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",
        title: "Phones",
        thumbUrl:
          "data:image/jpeg;base64,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",
      },
      {
        url:
          "https://www.naturalcareshop.ro/wp-content/uploads/2019/03/Joc-pentru-sortat-Autobuz-Plan-Toys.jpg",
        title: "Toys",
        thumbUrl:
          "https://www.naturalcareshop.ro/wp-content/uploads/2019/03/Joc-pentru-sortat-Autobuz-Plan-Toys.jpg",
      },
      {
        url:
          "https://www.mobila-augustin.ro/wp-content/uploads/2020/01/54729700_2546628802075340_262817393963696128_n-500x500.jpg",
        title: "Furniture",
        thumbUrl:
          "https://www.mobila-augustin.ro/wp-content/uploads/2020/01/54729700_2546628802075340_262817393963696128_n-500x500.jpg",
      },
      {
        url:
          "https://www.startech.com.bd/image/cache/catalog/laptop/asus/x409ua/x409ua-500x500.jpg",
        title: "Laptop",
        thumbUrl:
          "https://www.startech.com.bd/image/cache/catalog/laptop/asus/x409ua/x409ua-500x500.jpg",
      },
    ];

    return (
      <div className="homepage">
        <Parallax
          blur={1}
          bgImage={this.image1}
          bgImageAlt="the cat"
          strength={500}
        >
          <section id="infinite" className="text-white av-font-big av-parallax">
            <nav
              className={classNames("navbar navbar-expand-md av-navbar", {
                scroll: this.state.scrolling,
              })}
              id="tmNav"
            >
              <div className="container">
                <div className="av-next">
                  <Scroll.Link
                    activeclassName="active"
                    to="infinite"
                    spy={true}
                    smooth={true}
                    offset={0}
                    duration={500}
                    className="navbar-brand"
                    href="#infinite"
                  >
                    <i className="fas fa-infinity"></i> Electro
                  </Scroll.Link>
                </div>

                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  onClick={this.handleCollapse}
                >
                  <i className="fas fa-bars navbar-toggler-icon"></i>
                </button>
                <div
                  className={classNames("collapse navbar-collapse", {
                    show: this.state.collapseMenu,
                  })}
                  id="navbarSupportedContent"
                >
                  <Scrollspy
                    className="navbar-nav ml-auto"
                    items={[
                      "infinite",
                      "whatwedo",
                      "testimonials",
                      "gallery",
                      "contact",
                    ]}
                    currentClassName="current"
                  >
                    <li className="nav-item">
                      <NavItem
                        scrolling={true}
                        link="infinite"
                        id=""
                        titleForTooltip=""
                        icon="fas fa-home"
                        text=" Home"
                      />
                    </li>
                    <li className="nav-item">
                      <NavItem
                        scrolling={true}
                        link="whatwedo"
                        id=""
                        titleForTooltip=""
                        icon="far fa-question-circle"
                        text=" What We Do"
                      />
                    </li>
                    <li className="nav-item">
                      <NavItem
                        scrolling={true}
                        link="testimonials"
                        id=""
                        titleForTooltip=""
                        icon="far fa-question-circle"
                        text=" Testimonials"
                      />
                    </li>
                    <li className="nav-item">
                      <NavItem
                        scrolling={true}
                        link="gallery"
                        id=""
                        titleForTooltip=""
                        icon="far fa-images"
                        text=" Gallery"
                      />
                    </li>
                    <li className="nav-item">
                      <NavItem
                        scrolling={true}
                        link="contact"
                        id=""
                        titleForTooltip=""
                        icon="far fa-address-card"
                        text=" Contact"
                      />
                    </li>
                    <li className="nav-item">
                      <NavItem
                        scrolling={false}
                        link="/login"
                        id="accountIcon"
                        titleForTooltip="Account"
                        icon="far fa-user"
                        text=""
                      />
                    </li>
                  </Scrollspy>
                </div>
              </div>
            </nav>

            <div className="text-center av-hero-text-container">
              <div className="av-hero-text-container-inner">
                <h2 className="av-hero-title">Electro.ro</h2>
                <p className="av-hero-subtitle">
                  Cloud Computing Application
                  <br />
                  Google Cloud App Engine
                </p>
              </div>
            </div>

            <div className="av-next av-intro-next">
              <Scroll.Link
                activeclassName="active"
                to="whatwedo"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                className="text-center av-down-arrow-link"
                href="#whatwedo"
              >
                <i className="fas fa-arrow-down av-down-arrow"></i>
              </Scroll.Link>
            </div>
          </section>
        </Parallax>
        <section id="whatwedo" className="av-section-pad-top">
          <div className="container">
            <div className="row av-content-box">
              <div className="col-lg-12 col-xl-12">
                <div className="av-intro-text-container">
                  <h2 className="av-text-primary mb-4 av-section-title">
                    What We Do
                  </h2>
                  <p className="mb-4 av-intro-text">
                    Our platform provides three categories of announcements. A
                    normal user can register and has the opportunity to post an
                    announcement to rent a product (car, electronic product,
                    etc), can place an announcement to provide services or can
                    add a product / task to bidding. Also, our application
                    offers the possibility to filter the announcements depending
                    on the type (sell, rent).
                  </p>
                </div>
              </div>
            </div>

            <div className="row av-content-box">
              <div className="col-lg-1">
                <i className="far fa-3x fa-chart-bar text-center av-icon"></i>
              </div>
              <div className="col-lg-5">
                <div className="av-intro-text-container">
                  <h2 className="av-text-primary mb-4">Market Analysis</h2>
                  <p className="mb-4 av-intro-text">
                    We analyze the products uploaded on the site so that
                    customers are satisfied as possible with our services.
                  </p>
                </div>
              </div>

              <div className="col-lg-1">
                <i className="far fa-3x fa-comment-alt text-center av-icon"></i>
              </div>
              <div className="col-lg-5">
                <div className="av-intro-text-container">
                  <h2 className="av-text-primary mb-4">Fast Support</h2>
                  <p className="mb-4 av-intro-text">
                    We try to respond as quickly as we can to the problems you
                    encounter.
                  </p>
                </div>
              </div>
            </div>

            <div className="row av-content-box">
              <div className="col-lg-1">
                <i className="fas fa-3x fa-fingerprint text-center av-icon"></i>
              </div>
              <div className="col-lg-5">
                <div className="av-intro-text-container">
                  <h2 className="av-text-primary mb-4">Top Security</h2>
                  <p className="mb-4 av-intro-text">
                    We offer the best quality security so that customers'
                    personal data is kept safe.
                  </p>

                  <div className="av-continue">
                    <a href="#contact" className="av-intro-text av-btn-primary">
                      Learn More
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-1">
                <i className="fas fa-3x fa-users text-center av-icon"></i>
              </div>
              <div className="col-lg-5">
                <div className="av-intro-text-container">
                  <h2 className="av-text-primary mb-4">Bid Products</h2>
                  <p className="mb-4 av-intro-text">
                    You can bid a product and make a pretty good profit on it.
                  </p>

                  <div className="av-continue">
                    <a href="#contact" className="av-intro-text av-btn-primary">
                      Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Parallax
          blur={1}
          bgImage={this.image2}
          bgImageAlt="the cat"
          strength={500}
        >
          <section
            id="testimonials"
            className="av-section-pad-top av-parallax-2"
          >
            <div className="container av-testimonials-content">
              <div className="row">
                <div className="col-lg-12 av-content-box">
                  <h2 className="text-white text-center mb-4 av-section-title">
                    Testimonials
                  </h2>
                  <p className="mx-auto av-section-desc text-center">
                    Many customers were satisfied with this application. Below
                    are some opinions of our clients.
                  </p>

                  <div className="mx-auto av-gallery-container av-gallery-container-2">
                    <div className="av-testimonials-carousel">
                      <Carousel />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="av-bg-overlay"></div>
          </section>
        </Parallax>
        <section id="gallery" className="av-section-pad-top">
          <div className="container av-container-gallery">
            <div className="row">
              <div className="text-center col-12">
                <h2 className="av-text-primary av-section-title mb-4">
                  Gallery
                </h2>
                <p className="mx-auto av-section-desc">
                  Here are some of the types of products you will find on our
                  website.
                </p>
              </div>
            </div>

            <DztImageGalleryComponent
              imageBackgroundColor="transparent"
              imgClassName="dataaa"
              images={data}
            />
          </div>
        </section>
        <Parallax
          blur={1}
          bgImage={this.image3}
          bgImageAlt="the cat"
          strength={500}
        >
          <section id="contact" className="av-section-pad-top av-parallax-2">
            <div className="container av-container-contact">
              <div className="row">
                <div className="text-center col-12">
                  <h2 className="av-section-title mb-4">Contact Us</h2>
                  <p className="mb-5">
                    If you have any questions or problems do not hesitate to
                    contact us. We will answer you as soon as possible.
                  </p>
                  <br />
                </div>

                <div className="col-sm-12 col-md-6">
                  <ContactForm />
                </div>

                <div className="col-sm-12 col-md-6">
                  <div className="contact-item">
                    <a
                      rel="nofollow"
                      href="https://www.tooplate.com/contact"
                      className="item-link"
                    >
                      <i className="far fa-2x fa-comment mr-4"></i>
                      <span className="mb-0">Chat Online</span>
                    </a>
                  </div>

                  <div className="contact-item">
                    <a
                      rel="nofollow"
                      href="mailto:mail@company.com"
                      className="item-link"
                    >
                      <i className="far fa-2x fa-envelope mr-4"></i>
                      <span className="mb-0">mail@company.com</span>
                    </a>
                  </div>

                  <div className="contact-item">
                    <Link rel="nofollow" to="/map" className="item-link">
                      <i className="fas fa-2x fa-map-marker-alt mr-4"></i>
                      <span className="mb-0">Our Location</span>
                    </Link>
                  </div>

                  <div className="contact-item">
                    <a
                      rel="nofollow"
                      href="tel:0100200340"
                      className="item-link"
                    >
                      <i className="fas fa-2x fa-phone-square mr-4"></i>
                      <span className="mb-0">255-662-5566</span>
                    </a>
                  </div>

                  <div className="contact-item">&nbsp;</div>
                </div>
              </div>
            </div>

            <footer className="text-center small av-footer">
              <p className="mb-0">
                Copyright &copy; 2020 UAIC - Cloud Computin Course - Designed by
                Gliga Dumitru | Vatamanelu Andreea
              </p>
            </footer>
          </section>
        </Parallax>
      </div>
    );
  }
}
