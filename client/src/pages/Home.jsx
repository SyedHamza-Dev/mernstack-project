import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slide1 from '../assets/images/slide-1.jpg';
import slide2 from '../assets/images/slide-2.jpg';
import slide3 from '../assets/images/slide-3.jpg';
import agent4 from '../assets/images/agent-4.jpg';
import agent2 from '../assets/images/agent-2.jpg';
import agent1 from '../assets/images/agent-1.jpg';
import post2 from '../assets/images/post-2.jpg';
import post5 from '../assets/images/post-5.jpg';
import post7 from '../assets/images/post-7.jpg';
import ListingItem from '../components/ListingItem';
import '../index.css'; 

SwiperCore.use([Navigation]);

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  // Slider settings
  const settings = {
    loop: true,
    margin: -1,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <button className="slick-prev">←</button>,
    nextArrow: <button className="slick-next">→</button>,
  };

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=3');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=3');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=3');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <>
      <div className="relative overflow-hidden">
      <Slider {...settings} className="relative">
        {/* Slide 1 */}
        <div className="relative w-full h-[400px]">
          <img src={slide1} alt="Slide 1" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-12">
            <div className="text-center text-white">
              <p className="text-lg font-medium mb-2">Doral, Florida<br /> 78345</p>
              <h1 className="text-4xl font-extrabold mb-4">
                <span className="text-green-500">204 </span>Mount<br /> Olive Road Two
              </h1>
              <p className="text-xl font-semibold">
                <Link to="/rentals" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-400 transition duration-300">
                  Rent | $12,000
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="relative w-full h-[400px]">
          <img src={slide2} alt="Slide 2" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-12">
            <div className="text-center text-white">
              <p className="text-lg font-medium mb-2">Doral, Florida<br /> 78345</p>
              <h1 className="text-4xl font-extrabold mb-4">
                <span className="text-green-500">204 </span>Rino<br /> Venda Road Five
              </h1>
              <p className="text-xl font-semibold">
                <Link to="/rentals" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-400 transition duration-300">
                  Rent | $12,000
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="relative w-full h-[400px]">
          <img src={slide3} alt="Slide 3" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-12">
            <div className="text-center text-white">
              <p className="text-lg font-medium mb-2">Doral, Florida<br /> 78345</p>
              <h1 className="text-4xl font-extrabold mb-4">
                <span className="text-green-500">204 </span>Alira<br /> Roan Road One
              </h1>
              <p className="text-xl font-semibold">
                <Link to="/rentals" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-400 transition duration-300">
                  Rent | $12,000
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Slider>
    </div>


      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 py-20">
        <div className="flex flex-col gap-8 p-10 lg:p-28 px-6 lg:px-12 max-w-6xl mx-auto rounded-lg shadow-lg bg-white">
          <h1 className="text-gray-800 font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight text-center">
            Discover your <span className="text-indigo-500">ideal</span> place 
            <br className="hidden lg:block" />
            with ease
          </h1>
          <p className="text-gray-600 text-sm md:text-base text-center">
            REHAISH offers the best selection of properties to help you find
            <br className="hidden sm:block" />
            your perfect place to live. Explore a wide range of options.
          </p>
          <Link
            to="/search"
            className="text-sm md:text-base text-indigo-600 font-semibold hover:underline text-center"
          >
            Let's get started...
          </Link>
        </div>
      </div>

       
{/* Listing Results for Offer, Sale, and Rent */}
<div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
  {offerListings.length > 0 && (
    <div>
      <div className="my-3">
        <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
        <Link 
          to="/search?offer=true"
          className="no-underline hover:no-underline text-sm text-blue-800 hover:text-blue-600 focus:outline-none"
        >
          Show more offers
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {offerListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
  {rentListings.length > 0 && (
    <div>
      <div className="my-3">
        <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
        <Link 
          to="/search?type=rent"
          className="no-underline hover:no-underline text-sm text-blue-800 hover:text-blue-600 focus:outline-none"
        >
          Show more places for rent
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {rentListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
  {saleListings.length > 0 && (
    <div>
      <div className="my-3">
        <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
        <Link 
          to="/search?type=sale"
          className="no-underline hover:no-underline text-sm text-blue-800 hover:text-blue-600 focus:outline-none"
        >
          Show more places for sale
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {saleListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
</div>


        {/* Services Section */}
        <section className="max-w-6xl mx-auto p-3 my-10">
          <div className="flex flex-col gap-8">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Our Services</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105">
                <div className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="fa fa-gamepad text-3xl text-blue-500"></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">Lifestyle</h3>
                    <p className="text-gray-600 mt-2">
                      Sed porttitor lectus nibh. Cras ultricies ligula sed magna dictum porta. Praesent sapien massa,
                      convallis a pellentesque nec, egestas non nisi.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-100">
                  <a href="#" className="text-blue-800 hover:underline flex items-center space-x-1">
                    <span>Read more</span>
                    <span className="ion-ios-arrow-forward text-sm"></span>
                  </a>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105">
                <div className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="fa fa-usd text-3xl text-green-500"></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">Loans</h3>
                    <p className="text-gray-600 mt-2">
                      Nulla porttitor accumsan tincidunt. Curabitur aliquet quam id dui posuere blandit. Mauris blandit
                      aliquet elit, eget tincidunt nibh pulvinar a.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-100">
                  <a href="#" className="text-blue-800 hover:underline flex items-center space-x-1">
                    <span>Read more</span>
                    <span className="ion-ios-arrow-forward text-sm"></span>
                  </a>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105">
                <div className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="fa fa-home text-3xl text-red-500"></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">Sell</h3>
                    <p className="text-gray-600 mt-2">
                      Sed porttitor lectus nibh. Cras ultricies ligula sed magna dictum porta. Praesent sapien massa,
                      convallis a pellentesque nec, egestas non nisi.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-100">
                  <a href="#" className="text-blue-800 hover:underline flex items-center space-x-1">
                    <span>Read more</span>
                    <span className="ion-ios-arrow-forward text-sm"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="max-w-6xl mx-auto p-3 my-10">
          <div className="flex flex-col gap-8">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Latest News</h2>
              <a href="blog-grid.html" className="text-sm text-blue-800 hover:underline">
                Show all news
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[post2, post5, post7].map((post, index) => (
                <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105"
                  key={index}
                >
                  <img
                    src={post}
                    alt={`News ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2">
                      <a href="#" className="text-blue-800 hover:underline">
                        {index === 0 ? 'Real Estate' : index === 1 ? 'Travel' : 'Parks'}
                      </a>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      <a href="blog-single.html" className="hover:underline">
                        {index === 0
                          ? 'New Trends in Real Estate for 2024'
                          : index === 1
                          ? 'Top Travel Destinations to Visit'
                          : 'The Best Parks for Family Outings'}
                      </a>
                    </h3>
                    <span className="text-gray-400">18 Sep. 2024</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    
    </>
  );
}
