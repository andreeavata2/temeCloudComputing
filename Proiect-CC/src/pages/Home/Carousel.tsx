import React, { Component } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Carousel2 from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Props {}
interface State {}
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const mob = "mobile";
export default class Carousel extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div>
        <Carousel2
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          deviceType={mob}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          <div>
            <figure className="av-testimonial-item">
              <img
                src="img/testimonial-img-01.jpg"
                alt="Image2"
                className="img-fluid mx-auto"
              />
              <blockquote>
                I like this application because you can put your products up for
                bidding.
              </blockquote>
              <figcaption>{"Sophie Smith"}</figcaption>
            </figure>
          </div>

          <div>
            <figure className="av-testimonial-item">
              <img
                src="img/testimonial-img-02.jpg"
                alt="Image2"
                className="img-fluid mx-auto"
              />
              <blockquote>
                With the help of this application I was able to sell my old
                phone in the best conditions.
              </blockquote>
              <figcaption>{"Oliver Jones"}</figcaption>
            </figure>
          </div>
          <div>
            <figure className="av-testimonial-item">
              <img
                src="img/testimonial-img-03.jpg"
                alt="Image2"
                className="img-fluid mx-auto"
              />
              <blockquote>
                The announcements are real and according to the pictures.
              </blockquote>
              <figcaption>{"Lily Taylor"}</figcaption>
            </figure>
          </div>
          <div>
            <figure className="av-testimonial-item">
              <img
                src="img/testimonial-img-04.jpg"
                alt="Image2"
                className="img-fluid mx-auto"
              />
              <blockquote>
                The application is easy to use and you can sell / buy / bid your
                products quickly.
              </blockquote>
              <figcaption>{"Chloe Brown"}</figcaption>
            </figure>
          </div>
        </Carousel2>
      </div>
    );
  }
}
