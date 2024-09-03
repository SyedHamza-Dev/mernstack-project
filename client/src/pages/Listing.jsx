import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
   <main className="property-single nav-arrow-b bg-gray-100 py-10">
  <div className="container mx-auto px-4">
    {loading && <p className="text-center text-2xl text-gray-600">Loading...</p>}
    {error && <p className="text-center text-2xl text-red-600">Something went wrong!</p>}
    {listing && !loading && !error && (
      <>
        {/* Carousel */}
        <div className="carousel-container mb-8">
          <Swiper navigation modules={[Navigation]} className="rounded-lg shadow-lg">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>


            <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              <FaShare
                className="text-slate-500"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                Link copied!
              </p>
            )}

            <section className="property-single nav-arrow-b">
              <div className="container">
                <div className="row justify-content-between">
                  <div className="col-md-5 col-lg-4">
                    <div className="property-price d-flex justify-content-center foo">
                      <div className="card-header-c d-flex">
                        <div className="card-box-ico">
                          <span className="ion-money">$</span>
                        </div>
                        <div className="card-title-c align-self-center">
                          <h5 className="title-c">
                            {listing.offer
                              ? listing.discountPrice.toLocaleString('en-US')
                              : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                          </h5>
                          {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
                        </div>
                      </div>
                    </div>
                    <div className="property-summary">
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="title-box-d section-t4">
                            <h3 className="title-d">Quick Summary</h3>
                          </div>
                        </div>
                      </div>
                      <div className="summary-list">
                        <ul className="list">
                          <li className="d-flex justify-content-between">
                            <strong>Property Type:</strong>
                            <span>{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Location:</strong>
                            <span>{listing.address}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Beds:</strong>
                            <span>{listing.bedrooms}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Baths:</strong>
                            <span>{listing.bathrooms}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Parking:</strong>
                            <span>{listing.parking ? 'Yes' : 'No'}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Furnished:</strong>
                            <span>{listing.furnished ? 'Yes' : 'No'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-7 col-lg-7 section-md-t3">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="title-box-d">
                          <h3 className="title-d">Property Description</h3>
                        </div>
                      </div>
                    </div>
                    <div className="property-description">
                      <p className="description color-text-a">
                        {listing.description}
                      </p>
                    </div>
                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                      <button
                        onClick={() => setContact(true)}
                        className="btn btn-a mt-4"
                      >
                        Contact Landlord
                      </button>
                    )}
                    {contact && <Contact listing={listing} />}
                  </div>
                </div>
              </div>
            </section>

            <div className="row section-t3">
              <div className="col-sm-12">
                <div className="title-box-d mb-4">
                  <h3 className="title-d text-2xl font-semibold text-gray-700">Amenities</h3>
                </div>
              </div>

              <div className="amenities-list mt-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <ul className="grid grid-cols-2 gap-4">
                  <li className="flex items-center">
                    <span className="text-gray-600 font-medium w-36">Balcony:</span>
                    <span className={`text-sm ${listing.balcony ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.balcony ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-600 font-medium w-36">Outdoor Kitchen:</span>
                    <span className={`text-sm ${listing.outdoorKitchen ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.outdoorKitchen ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-600 font-medium w-36">Cable TV:</span>
                    <span className={`text-sm ${listing.cableTv ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.cableTv ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-600 font-medium w-36">Deck:</span>
                    <span className={`text-sm ${listing.deck ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.deck ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-600 font-medium w-36">Tennis Courts:</span>
                    <span className={`text-sm ${listing.tennisCourts ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.tennisCourts ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-600 font-medium w-36">Internet:</span>
                    <span className={`text-sm ${listing.internet ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.internet ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-600 font-medium w-36">Marble Floors:</span>
                    <span className={`text-sm ${listing.marbleFloors ? 'text-green-600' : 'text-red-600'}`}>
                      {listing.marbleFloors ? 'Yes' : 'No'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            


            {listing.videoUrl && (
              <div className="video-container my-4">
                <h3 className="text-xl font-semibold mb-2">Listing Video</h3>
                <video
                  src={listing.videoUrl}
                  controls
                  className="w-full max-w-4xl rounded-lg shadow-md border border-gray-200"
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
