

// import React, { useContext, useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import '../styles/components/Header.css';
// import logoImage from '../assets/images/logo1.png';
// import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaAngleDown, FaSpinner, FaTimes, FaTags, FaCompass } from 'react-icons/fa';
// import Login from '../pages/Login';

// // Replace with your Google Maps API key
// const GOOGLE_MAPS_API_KEY = 'AIzaSyA5ReIwel6soo1uIWWRvAIdIubZQKnbjfc';

// const Header = () => {
//   const navigate = useNavigate();
//   const { cart } = useContext(CartContext);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     localStorage.getItem('isAuthenticated') === 'true'
//   );
//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   const searchRef = useRef(null);

//   // Location selector state
//   const [isLocationOpen, setIsLocationOpen] = useState(false);
//   const [locationAddress, setLocationAddress] = useState('Select your location');
//   const [fullAddress, setFullAddress] = useState(null);
//   const [selectedCity, setSelectedCity] = useState({
//     id: 'blr',
//     city: 'Bangalore',
//     areas: ['Jayanagar', 'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout']
//   });
//   const [isLocating, setIsLocating] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const locationRef = useRef(null);

//   // Sample locations data
//   const locations = [
//     { id: 'blr', city: 'Bangalore', areas: ['Jayanagar', 'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout'] },
//   ];

//   // Sample products for search (aligned with ProductCard items)
//   const products = [
//     { id: 1, name: 'Chicken Breast', category: 'Chicken', image: '/images/chicken-breast.jpg', price: 249 },
//     { id: 2, name: 'Mutton Curry Cut', category: 'Mutton', image: '/images/mutton-curry.jpg', price: 549 },
//     { id: 3, name: 'Salmon Fillet', category: 'Seafood', image: '/images/salmon.jpg', price: 799 },
//     { id: 4, name: 'Farm Fresh Eggs', category: 'Eggs', image: '/images/eggs.jpg', price: 89 },
//     { id: 5, name: 'Chicken Thighs', category: 'Chicken', image: '/images/chicken-thighs.jpg', price: 219 },
//     { id: 6, name: 'Prawns', category: 'Seafood', image: '/images/prawns.jpg', price: 449 },
//     { id: 7, name: 'Goat Ribs', category: 'Mutton', image: '/images/goat-ribs.jpg', price: 649 },
//   ];

//   // Load saved location from localStorage on component mount
//   useEffect(() => {
//     const savedLocation = localStorage.getItem('userLocation');
//     if (savedLocation) {
//       try {
//         const parsedLocation = JSON.parse(savedLocation);
//         setLocationAddress(parsedLocation.formattedAddress || parsedLocation.address);
//         setFullAddress(parsedLocation);

//         const matchedCity = locations.find(city => city.city === parsedLocation.city);
//         if (matchedCity) {
//           setSelectedCity(matchedCity);
//         }
//       } catch (error) {
//         console.error("Error parsing saved location:", error);
//       }
//     }
//   }, []);

//   // Handle click outside to close location popup
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (locationRef.current && !locationRef.current.contains(event.target)) {
//         setIsLocationOpen(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//   };

//   const handleAreaSelect = (area) => {
//     const newAddress = `${area}, ${selectedCity.city}`;

//     setLocationAddress(newAddress);
//     setFullAddress({
//       area: area,
//       city: selectedCity.city,
//       formattedAddress: newAddress
//     });
//     setIsLocationOpen(false);

//     localStorage.setItem('userLocation', JSON.stringify({
//       area: area,
//       city: selectedCity.city,
//       formattedAddress: newAddress
//     }));
//   };

//   // Get detailed address from coordinates using Google Maps Geocoding API
//   const getDetailedAddressFromCoordinates = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
//       );

//       if (!response.ok) {
//         throw new Error('Google Geocoding API error');
//       }

//       const data = await response.json();

//       if (data.status !== 'OK' || !data.results || data.results.length === 0) {
//         throw new Error('No address found for this location');
//       }

//       const fullResult = data.results[0];
//       const addressComponents = fullResult.address_components;
//       const formattedAddress = fullResult.formatted_address;

//       let streetNumber = '';
//       let route = '';
//       let neighborhood = '';
//       let sublocality = '';
//       let locality = '';
//       let city = '';
//       let state = '';
//       let postalCode = '';

//       addressComponents.forEach(component => {
//         const types = component.types;

//         if (types.includes('street_number')) {
//           streetNumber = component.long_name;
//         } else if (types.includes('route')) {
//           route = component.long_name;
//         } else if (types.includes('neighborhood')) {
//           neighborhood = component.long_name;
//         } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
//           sublocality = component.long_name;
//         } else if (types.includes('locality')) {
//           locality = component.long_name;
//           city = component.long_name;
//         } else if (types.includes('administrative_area_level_1')) {
//           state = component.long_name;
//         } else if (types.includes('postal_code')) {
//           postalCode = component.long_name;
//         }
//       });

//       let matchedCity = locations.find(loc =>
//         loc.city.toLowerCase() === city.toLowerCase()
//       );

//       if (!matchedCity && locality) {
//         matchedCity = locations.find(loc =>
//           loc.city.toLowerCase() === locality.toLowerCase()
//         );
//       }

//       if (!matchedCity) {
//         matchedCity = locations.find(loc => loc.id === 'blr');
//       }

//       setSelectedCity(matchedCity);

//       const displayAddress = formattedAddress.split(',').slice(0, 3).join(',');

//       return {
//         streetNumber,
//         route,
//         neighborhood,
//         sublocality,
//         locality,
//         city: matchedCity.city,
//         state,
//         postalCode,
//         fullAddress: formattedAddress,
//         formattedAddress: displayAddress,
//         latitude,
//         longitude
//       };
//     } catch (googleError) {
//       console.error("Error with Google Geocoding:", googleError);

//       try {
//         const response = await fetch(
//           `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
//         );

//         if (!response.ok) {
//           throw new Error('Geocoding API error');
//         }

//         const data = await response.json();

//         const area = data.locality || data.principalSubdivision || '';
//         const city = data.city || data.locality || 'Bangalore';

//         let matchedCity = locations.find(loc =>
//           loc.city.toLowerCase() === city.toLowerCase()
//         );

//         if (!matchedCity) {
//           matchedCity = locations.find(loc => loc.id === 'blr');
//         }

//         setSelectedCity(matchedCity);

//         const formattedAddress = `${area}, ${city}`;

//         return {
//           area,
//           city: matchedCity.city,
//           formattedAddress,
//           latitude,
//           longitude
//         };
//       } catch (fallbackError) {
//         console.error("Error in fallback geocoding:", fallbackError);
//         throw new Error('Could not determine your location. Please select manually.');
//       }
//     }
//   };

//   const handleUseCurrentLocation = () => {
//     if (navigator.geolocation) {
//       setIsLocating(true);
//       setLocationError('');

//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           try {
//             const { latitude, longitude } = position.coords;

//             const addressData = await getDetailedAddressFromCoordinates(latitude, longitude);

//             setLocationAddress(addressData.formattedAddress);
//             setFullAddress(addressData);

//             localStorage.setItem('userLocation', JSON.stringify(addressData));

//             setIsLocationOpen(false);
//             setIsLocating(false);
//           } catch (error) {
//             console.error("Error getting detailed address:", error);
//             setLocationError(error.message);
//             setIsLocating(false);
//           }
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//           let errorMessage = 'Unable to detect location';

//           if (error.code === 1) {
//             errorMessage = 'Location access denied. Please enable location services.';
//           } else if (error.code === 2) {
//             errorMessage = 'Location unavailable. Please try again later.';
//           } else if (error.code === 3) {
//             errorMessage = 'Location request timed out. Please try again.';
//           }

//           setLocationError(errorMessage);
//           setIsLocating(false);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0
//         }
//       );
//     } else {
//       setLocationError('Geolocation is not supported by your browser');
//     }
//   };

//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   const handleSearchSubmit = (e) => {
//     if (e) e.preventDefault();

//     if (searchTerm.trim() === '') return;

//     sessionStorage.setItem('searchQuery', searchTerm);
//     navigate('/categories');
//     setSearchTerm('');
//     setIsMobileSearchActive(false);
//   };

//   const handleMobileSearchClick = () => {
//     setIsMobileSearchActive(!isMobileSearchActive);
//   };

//   const handleLoginOpen = (e) => {
//     if (e) e.preventDefault();
//     setIsLoginOpen(true);
//   };

//   const handleLoginClose = () => {
//     setIsLoginOpen(false);
//   };

//   const handleLoginSuccess = () => {
//     setIsAuthenticated(true);
//     localStorage.setItem("isAuthenticated", "true");
//   };

//   return (
//     <>
//       <div className="marquee-container">
//         <div className="marquee">
//           ZappCart is an innovative E-commerce platform designed to revolutionize the fresh meat delivery industry in Bengaluru,
//           Fresh Meat Delivered To Your Doorstep
//         </div>
//       </div>
//       <header className="header">
//         <div className="header-container">
//           <div className="logo">
//             <Link to="/">
//               <img src={logoImage} alt="ZappCart Logo" />
//             </Link>
//           </div>

//           <div className="location-selector" ref={locationRef}>
//             <div className="delivery-label">Delivery to</div>
//             <div
//               className="address-selector"
//               onClick={() => setIsLocationOpen(!isLocationOpen)}
//             >
//               <FaMapMarkerAlt className="map-icon" />
//               <span className="address" title={fullAddress?.fullAddress || locationAddress}>
//                 {locationAddress}
//               </span>
//               <FaAngleDown className={`dropdown-icon ${isLocationOpen ? 'open' : ''}`} />

//               {isLocationOpen && (
//                 <div className="location-popup scale-in">
//                   <h4 className="location-popup-title">Choose your delivery location</h4>

//                   <button
//                     className="use-current-location"
//                     onClick={handleUseCurrentLocation}
//                     disabled={isLocating}
//                   >
//                     {isLocating ? (
//                       <>
//                         <FaSpinner className="spinner" />
//                         <span>Detecting location...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaMapMarkerAlt />
//                         <span>Use current location</span>
//                       </>
//                     )}
//                   </button>

//                   {locationError && (
//                     <div className="location-error">
//                       {locationError}
//                     </div>
//                   )}

//                   <div className="location-tabs">
//                     {locations.map(city => (
//                       <button
//                         key={city.id}
//                         className={`location-tab ${selectedCity.id === city.id ? 'active' : ''}`}
//                         onClick={() => handleCitySelect(city)}
//                       >
//                         {city.city}
//                       </button>
//                     ))}
//                   </div>

//                   <div className="location-areas">
//                     {selectedCity.areas.map(area => (
//                       <button
//                         key={area}
//                         className="area-btn"
//                         onClick={() => handleAreaSelect(area)}
//                       >
//                         <FaMapMarkerAlt className="area-icon" />
//                         <span>{area}, {selectedCity.city}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="search-container desktop-search" ref={searchRef}>
//             <form className="search-bar" onSubmit={handleSearchSubmit}>
//               <div className="search-wrapper">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Search for any delicious product"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                 />
//                 {searchTerm && (
//                   <button
//                     type="button"
//                     className="clear-search"
//                     onClick={clearSearch}
//                     aria-label="Clear search"
//                   >
//                     <FaTimes />
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           <div className="nav-links desktop-nav">
//             <div className="categories-dropdown">
//               <Link to="/categories" className="categories-link">
//                 <span>Categories</span>
//               </Link>
//             </div>

//             <div className="cart-link">
//               <Link to="/cart" className="cart-trigger">
//                 <FaShoppingCart className="cart-icon" />
//                 <span>Cart</span>
//                 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
//               </Link>
//             </div>

//             <div className="account-link">
//               <a href="#" className="account-trigger" onClick={handleLoginOpen}>
//                 <FaUser className="account-icon" />
//                 <span>{isAuthenticated ? 'Account' : 'Login'}</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Search Overlay */}
//       {isMobileSearchActive && (
//         <div className="mobile-search-overlay">
//           <div className="mobile-search-container">
//             <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search for any delicious product"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 autoFocus
//               />
//               {searchTerm ? (
//                 <button type="button" className="mobile-clear-search" onClick={clearSearch}>
//                   <FaTimes />
//                 </button>
//               ) : (
//                 <button type="button" className="mobile-cancel-search" onClick={handleMobileSearchClick}>
//                   Cancel
//                 </button>
//               )}
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Mobile Bottom Navigation */}
//       <div className="mobile-bottom-nav">
//         <Link to="/" className="mobile-nav-item">
//           <FaCompass className="mobile-nav-icon" />
//           <span className="mobile-nav-text">Explore</span>
//         </Link>
//         <Link to="/deals" className="mobile-nav-item">
//           <FaTags className="mobile-nav-icon" />
//           <span className="mobile-nav-text">categories</span>
//         </Link>
//         <Link to="/cart" className="mobile-nav-item">
//           <FaShoppingCart className="mobile-nav-icon" />
//           {totalItems > 0 && <span className="mobile-cart-count">{totalItems}</span>}
//           <span className="mobile-nav-text">Cart</span>
//         </Link>
//         <button className="mobile-nav-item" onClick={handleMobileSearchClick}>
//           <FaSearch className="mobile-nav-icon" />
//           <span className="mobile-nav-text">Search</span>
//         </button>
//         <button className="mobile-nav-item" onClick={handleLoginOpen}>
//           <FaUser className="mobile-nav-icon" />
//           <span className="mobile-nav-text">Profile</span>
//         </button>
//       </div>

//       <Login
//         isOpen={isLoginOpen}
//         onClose={handleLoginClose}
//         onLogin={handleLoginSuccess}
//       />
//     </>
//   );
// };

// export default Header;


import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/components/Header.css';
import logoImage from '../assets/images/logo1.png';
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaAngleDown, FaSpinner, FaTimes, FaTags, FaCompass } from 'react-icons/fa';
import Login from '../pages/Login';

// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyA5ReIwel6soo1uIWWRvAIdIubZQKnbjfc';

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const searchRef = useRef(null);

  // Add padding to body for mobile bottom nav
  useEffect(() => {
    const setBodyPadding = () => {
      if (window.innerWidth <= 768) {
        document.body.style.paddingBottom = '60px';
      } else {
        document.body.style.paddingBottom = '0';
      }
    };

    setBodyPadding();
    window.addEventListener('resize', setBodyPadding);

    return () => {
      window.removeEventListener('resize', setBodyPadding);
      document.body.style.paddingBottom = '0';
    };
  }, []);

  // Location selector state
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationAddress, setLocationAddress] = useState('Select your location');
  const [fullAddress, setFullAddress] = useState(null);
  const [selectedCity, setSelectedCity] = useState({
    id: 'blr',
    city: 'Bangalore',
    areas: ['Jayanagar', 'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout']
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const locationRef = useRef(null);

  // Sample locations data
  const locations = [
    { id: 'blr', city: 'Bangalore', areas: ['Jayanagar', 'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout'] },
  ];

  // Sample products for search (aligned with ProductCard items)
  const products = [
    { id: 1, name: 'Chicken Breast', category: 'Chicken', image: '/images/chicken-breast.jpg', price: 249 },
    { id: 2, name: 'Mutton Curry Cut', category: 'Mutton', image: '/images/mutton-curry.jpg', price: 549 },
    { id: 3, name: 'Salmon Fillet', category: 'Seafood', image: '/images/salmon.jpg', price: 799 },
    { id: 4, name: 'Farm Fresh Eggs', category: 'Eggs', image: '/images/eggs.jpg', price: 89 },
    { id: 5, name: 'Chicken Thighs', category: 'Chicken', image: '/images/chicken-thighs.jpg', price: 219 },
    { id: 6, name: 'Prawns', category: 'Seafood', image: '/images/prawns.jpg', price: 449 },
    { id: 7, name: 'Goat Ribs', category: 'Mutton', image: '/images/goat-ribs.jpg', price: 649 },
  ];

  // Load saved location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocationAddress(parsedLocation.formattedAddress || parsedLocation.address);
        setFullAddress(parsedLocation);

        const matchedCity = locations.find(city => city.city === parsedLocation.city);
        if (matchedCity) {
          setSelectedCity(matchedCity);
        }
      } catch (error) {
        console.error("Error parsing saved location:", error);
      }
    }
  }, []);

  // Handle click outside to close location popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleAreaSelect = (area) => {
    const newAddress = `${area}, ${selectedCity.city}`;

    setLocationAddress(newAddress);
    setFullAddress({
      area: area,
      city: selectedCity.city,
      formattedAddress: newAddress
    });
    setIsLocationOpen(false);

    localStorage.setItem('userLocation', JSON.stringify({
      area: area,
      city: selectedCity.city,
      formattedAddress: newAddress
    }));
  };

  // Get detailed address from coordinates using Google Maps Geocoding API
  const getDetailedAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Google Geocoding API error');
      }

      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error('No address found for this location');
      }

      const fullResult = data.results[0];
      const addressComponents = fullResult.address_components;
      const formattedAddress = fullResult.formatted_address;

      let streetNumber = '';
      let route = '';
      let neighborhood = '';
      let sublocality = '';
      let locality = '';
      let city = '';
      let state = '';
      let postalCode = '';

      addressComponents.forEach(component => {
        const types = component.types;

        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        } else if (types.includes('route')) {
          route = component.long_name;
        } else if (types.includes('neighborhood')) {
          neighborhood = component.long_name;
        } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
          sublocality = component.long_name;
        } else if (types.includes('locality')) {
          locality = component.long_name;
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      });

      let matchedCity = locations.find(loc =>
        loc.city.toLowerCase() === city.toLowerCase()
      );

      if (!matchedCity && locality) {
        matchedCity = locations.find(loc =>
          loc.city.toLowerCase() === locality.toLowerCase()
        );
      }

      if (!matchedCity) {
        matchedCity = locations.find(loc => loc.id === 'blr');
      }

      setSelectedCity(matchedCity);

      const displayAddress = formattedAddress.split(',').slice(0, 3).join(',');

      return {
        streetNumber,
        route,
        neighborhood,
        sublocality,
        locality,
        city: matchedCity.city,
        state,
        postalCode,
        fullAddress: formattedAddress,
        formattedAddress: displayAddress,
        latitude,
        longitude
      };
    } catch (googleError) {
      console.error("Error with Google Geocoding:", googleError);

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );

        if (!response.ok) {
          throw new Error('Geocoding API error');
        }

        const data = await response.json();

        const area = data.locality || data.principalSubdivision || '';
        const city = data.city || data.locality || 'Bangalore';

        let matchedCity = locations.find(loc =>
          loc.city.toLowerCase() === city.toLowerCase()
        );

        if (!matchedCity) {
          matchedCity = locations.find(loc => loc.id === 'blr');
        }

        setSelectedCity(matchedCity);

        const formattedAddress = `${area}, ${city}`;

        return {
          area,
          city: matchedCity.city,
          formattedAddress,
          latitude,
          longitude
        };
      } catch (fallbackError) {
        console.error("Error in fallback geocoding:", fallbackError);
        throw new Error('Could not determine your location. Please select manually.');
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setLocationError('');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            const addressData = await getDetailedAddressFromCoordinates(latitude, longitude);

            setLocationAddress(addressData.formattedAddress);
            setFullAddress(addressData);

            localStorage.setItem('userLocation', JSON.stringify(addressData));

            setIsLocationOpen(false);
            setIsLocating(false);
          } catch (error) {
            console.error("Error getting detailed address:", error);
            setLocationError(error.message);
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = 'Unable to detect location';

          if (error.code === 1) {
            errorMessage = 'Location access denied. Please enable location services.';
          } else if (error.code === 2) {
            errorMessage = 'Location unavailable. Please try again later.';
          } else if (error.code === 3) {
            errorMessage = 'Location request timed out. Please try again.';
          }

          setLocationError(errorMessage);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();

    if (searchTerm.trim() === '') return;

    sessionStorage.setItem('searchQuery', searchTerm);
    navigate('/categories');
    setSearchTerm('');
    setIsMobileSearchActive(false);
  };

  const handleMobileSearchClick = () => {
    setIsMobileSearchActive(!isMobileSearchActive);
  };

  const handleLoginOpen = (e) => {
    if (e) e.preventDefault();
    setIsLoginOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  return (
    <>
      <div className="marquee-container">
        <div className="marquee">
          ZappCart is an innovative E-commerce platform designed to revolutionize the fresh meat delivery industry in Bengaluru,
          Fresh Meat Delivered To Your Doorstep
        </div>
      </div>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <img src={logoImage} alt="ZappCart Logo" />
            </Link>
          </div>

          <div className="location-selector" ref={locationRef}>
            <div className="delivery-label">Delivery to</div>
            <div
              className="address-selector"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
            >
              <FaMapMarkerAlt className="map-icon" />
              <span className="address" title={fullAddress?.fullAddress || locationAddress}>
                {locationAddress}
              </span>
              <FaAngleDown className={`dropdown-icon ${isLocationOpen ? 'open' : ''}`} />

              {isLocationOpen && (
                <div className="location-popup scale-in">
                  <h4 className="location-popup-title">Choose your delivery location</h4>

                  <button
                    className="use-current-location"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <>
                        <FaSpinner className="spinner" />
                        <span>Detecting location...</span>
                      </>
                    ) : (
                      <>
                        <FaMapMarkerAlt />
                        <span>Use current location</span>
                      </>
                    )}
                  </button>

                  {locationError && (
                    <div className="location-error">
                      {locationError}
                    </div>
                  )}

                  <div className="location-tabs">
                    {locations.map(city => (
                      <button
                        key={city.id}
                        className={`location-tab ${selectedCity.id === city.id ? 'active' : ''}`}
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.city}
                      </button>
                    ))}
                  </div>

                  <div className="location-areas">
                    {selectedCity.areas.map(area => (
                      <button
                        key={area}
                        className="area-btn"
                        onClick={() => handleAreaSelect(area)}
                      >
                        <FaMapMarkerAlt className="area-icon" />
                        <span>{area}, {selectedCity.city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="search-container desktop-search" ref={searchRef}>
            <form className="search-bar" onSubmit={handleSearchSubmit}>
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="nav-links desktop-nav">
            <div className="categories-dropdown">
              <Link to="/categories" className="categories-link">
                <span>Categories</span>
              </Link>
            </div>

            <div className="cart-link">
              <Link to="/cart" className="cart-trigger">
                <FaShoppingCart className="cart-icon" />
                <span>Cart</span>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            </div>

            <div className="account-link">
              <a href="#" className="account-trigger" onClick={handleLoginOpen}>
                <FaUser className="account-icon" />
                <span>{isAuthenticated ? 'Login' : 'Login'}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isMobileSearchActive && (
        <div className="mobile-search-overlay active">
          <div className="mobile-search-container">
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <FaSearch className="mobile-search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
              />
              {searchTerm ? (
                <button type="button" className="mobile-clear-search" onClick={clearSearch}>
                  <FaTimes />
                </button>
              ) : (
                <button type="button" className="mobile-cancel-search" onClick={handleMobileSearchClick}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <Link to="/" className="mobile-nav-item">
          <FaCompass className="mobile-nav-icon" />
          <span className="mobile-nav-text">Explore</span>
        </Link>
        <Link to="/categories" className="mobile-nav-item">
          <FaTags className="mobile-nav-icon" />
          <span className="mobile-nav-text">Categories</span>
        </Link>
        <Link to="/cart" className="mobile-nav-item">
          <div style={{ position: 'relative' }}>
            <FaShoppingCart className="mobile-nav-icon" />
            {totalItems > 0 && <span className="mobile-cart-count">{totalItems}</span>}
          </div>
          <span className="mobile-nav-text">Cart</span>
        </Link>
        <button className="mobile-nav-item" onClick={handleMobileSearchClick}>
          <FaSearch className="mobile-nav-icon" />
          <span className="mobile-nav-text">Search</span>
        </button>
        <button className="mobile-nav-item" onClick={handleLoginOpen}>
          <FaUser className="mobile-nav-icon" />
          <span className="mobile-nav-text">Profile</span>
        </button>
      </div>

      <Login
        isOpen={isLoginOpen}
        onClose={handleLoginClose}
        onLogin={handleLoginSuccess}
      />
    </>
  );
};

export default Header;


//zappcart header
// import React, { useContext, useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import '../styles/components/Header.css';
// import logoImage from '../assets/images/logo1.png';
// import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaAngleDown, FaSpinner, FaTimes, FaTags, FaCompass } from 'react-icons/fa';
// import Login from '../pages/Login';

// // Replace with your Google Maps API key
// const GOOGLE_MAPS_API_KEY = 'AIzaSyA5ReIwel6soo1uIWWRvAIdIubZQKnbjfc';

// const Header = () => {
//   const navigate = useNavigate();
//   const { cart } = useContext(CartContext);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     localStorage.getItem('isAuthenticated') === 'true'
//   );
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   const searchRef = useRef(null);

//   // Add window resize listener and padding management
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setWindowWidth(width);

//       // Add padding to body for mobile bottom nav only when width <= 1024
//       if (width <= 1024) {
//         document.body.style.paddingBottom = '60px';
//       } else {
//         document.body.style.paddingBottom = '0';
//       }
//     };

//     // Set initial values
//     handleResize();

//     // Add event listener
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       document.body.style.paddingBottom = '0';
//     };
//   }, []);

//   // Location selector state
//   const [isLocationOpen, setIsLocationOpen] = useState(false);
//   const [locationAddress, setLocationAddress] = useState('Select your location');
//   const [fullAddress, setFullAddress] = useState(null);
//   const [selectedCity, setSelectedCity] = useState({
//     id: 'blr',
//     city: 'Bangalore',
//     areas: ['Jayanagar', 'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout']
//   });
//   const [isLocating, setIsLocating] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const locationRef = useRef(null);

//   // Sample locations data
//   const locations = [
//     { id: 'blr', city: 'Bangalore', areas: ['Jayanagar', 'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout'] },
//   ];

//   // Sample products for search (aligned with ProductCard items)
//   const products = [
//     { id: 1, name: 'Chicken Breast', category: 'Chicken', image: '/images/chicken-breast.jpg', price: 249 },
//     { id: 2, name: 'Mutton Curry Cut', category: 'Mutton', image: '/images/mutton-curry.jpg', price: 549 },
//     { id: 3, name: 'Salmon Fillet', category: 'Seafood', image: '/images/salmon.jpg', price: 799 },
//     { id: 4, name: 'Farm Fresh Eggs', category: 'Eggs', image: '/images/eggs.jpg', price: 89 },
//     { id: 5, name: 'Chicken Thighs', category: 'Chicken', image: '/images/chicken-thighs.jpg', price: 219 },
//     { id: 6, name: 'Prawns', category: 'Seafood', image: '/images/prawns.jpg', price: 449 },
//     { id: 7, name: 'Goat Ribs', category: 'Mutton', image: '/images/goat-ribs.jpg', price: 649 },
//   ];

//   // Load saved location from localStorage on component mount
//   useEffect(() => {
//     const savedLocation = localStorage.getItem('userLocation');
//     if (savedLocation) {
//       try {
//         const parsedLocation = JSON.parse(savedLocation);
//         setLocationAddress(parsedLocation.formattedAddress || parsedLocation.address);
//         setFullAddress(parsedLocation);

//         const matchedCity = locations.find(city => city.city === parsedLocation.city);
//         if (matchedCity) {
//           setSelectedCity(matchedCity);
//         }
//       } catch (error) {
//         console.error("Error parsing saved location:", error);
//       }
//     }
//   }, []);

//   // Handle click outside to close location popup
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (locationRef.current && !locationRef.current.contains(event.target)) {
//         setIsLocationOpen(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//   };

//   const handleAreaSelect = (area) => {
//     const newAddress = `${area}, ${selectedCity.city}`;

//     setLocationAddress(newAddress);
//     setFullAddress({
//       area: area,
//       city: selectedCity.city,
//       formattedAddress: newAddress
//     });
//     setIsLocationOpen(false);

//     localStorage.setItem('userLocation', JSON.stringify({
//       area: area,
//       city: selectedCity.city,
//       formattedAddress: newAddress
//     }));
//   };

//   // Get detailed address from coordinates using Google Maps Geocoding API
//   const getDetailedAddressFromCoordinates = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
//       );

//       if (!response.ok) {
//         throw new Error('Google Geocoding API error');
//       }

//       const data = await response.json();

//       if (data.status !== 'OK' || !data.results || data.results.length === 0) {
//         throw new Error('No address found for this location');
//       }

//       const fullResult = data.results[0];
//       const addressComponents = fullResult.address_components;
//       const formattedAddress = fullResult.formatted_address;

//       let streetNumber = '';
//       let route = '';
//       let neighborhood = '';
//       let sublocality = '';
//       let locality = '';
//       let city = '';
//       let state = '';
//       let postalCode = '';

//       addressComponents.forEach(component => {
//         const types = component.types;

//         if (types.includes('street_number')) {
//           streetNumber = component.long_name;
//         } else if (types.includes('route')) {
//           route = component.long_name;
//         } else if (types.includes('neighborhood')) {
//           neighborhood = component.long_name;
//         } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
//           sublocality = component.long_name;
//         } else if (types.includes('locality')) {
//           locality = component.long_name;
//           city = component.long_name;
//         } else if (types.includes('administrative_area_level_1')) {
//           state = component.long_name;
//         } else if (types.includes('postal_code')) {
//           postalCode = component.long_name;
//         }
//       });

//       let matchedCity = locations.find(loc =>
//         loc.city.toLowerCase() === city.toLowerCase()
//       );

//       if (!matchedCity && locality) {
//         matchedCity = locations.find(loc =>
//           loc.city.toLowerCase() === locality.toLowerCase()
//         );
//       }

//       if (!matchedCity) {
//         matchedCity = locations.find(loc => loc.id === 'blr');
//       }

//       setSelectedCity(matchedCity);

//       const displayAddress = formattedAddress.split(',').slice(0, 3).join(',');

//       return {
//         streetNumber,
//         route,
//         neighborhood,
//         sublocality,
//         locality,
//         city: matchedCity.city,
//         state,
//         postalCode,
//         fullAddress: formattedAddress,
//         formattedAddress: displayAddress,
//         latitude,
//         longitude
//       };
//     } catch (googleError) {
//       console.error("Error with Google Geocoding:", googleError);

//       try {
//         const response = await fetch(
//           `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
//         );

//         if (!response.ok) {
//           throw new Error('Geocoding API error');
//         }

//         const data = await response.json();

//         const area = data.locality || data.principalSubdivision || '';
//         const city = data.city || data.locality || 'Bangalore';

//         let matchedCity = locations.find(loc =>
//           loc.city.toLowerCase() === city.toLowerCase()
//         );

//         if (!matchedCity) {
//           matchedCity = locations.find(loc => loc.id === 'blr');
//         }

//         setSelectedCity(matchedCity);

//         const formattedAddress = `${area}, ${city}`;

//         return {
//           area,
//           city: matchedCity.city,
//           formattedAddress,
//           latitude,
//           longitude
//         };
//       } catch (fallbackError) {
//         console.error("Error in fallback geocoding:", fallbackError);
//         throw new Error('Could not determine your location. Please select manually.');
//       }
//     }
//   };

//   const handleUseCurrentLocation = () => {
//     if (navigator.geolocation) {
//       setIsLocating(true);
//       setLocationError('');

//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           try {
//             const { latitude, longitude } = position.coords;

//             const addressData = await getDetailedAddressFromCoordinates(latitude, longitude);

//             setLocationAddress(addressData.formattedAddress);
//             setFullAddress(addressData);

//             localStorage.setItem('userLocation', JSON.stringify(addressData));

//             setIsLocationOpen(false);
//             setIsLocating(false);
//           } catch (error) {
//             console.error("Error getting detailed address:", error);
//             setLocationError(error.message);
//             setIsLocating(false);
//           }
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//           let errorMessage = 'Unable to detect location';

//           if (error.code === 1) {
//             errorMessage = 'Location access denied. Please enable location services.';
//           } else if (error.code === 2) {
//             errorMessage = 'Location unavailable. Please try again later.';
//           } else if (error.code === 3) {
//             errorMessage = 'Location request timed out. Please try again.';
//           }

//           setLocationError(errorMessage);
//           setIsLocating(false);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0
//         }
//       );
//     } else {
//       setLocationError('Geolocation is not supported by your browser');
//     }
//   };

//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   const handleSearchSubmit = (e) => {
//     if (e) e.preventDefault();

//     if (searchTerm.trim() === '') return;

//     sessionStorage.setItem('searchQuery', searchTerm);
//     navigate('/categories');
//     setSearchTerm('');
//     setIsMobileSearchActive(false);
//   };

//   const handleMobileSearchClick = () => {
//     setIsMobileSearchActive(!isMobileSearchActive);
//   };

//   const handleLoginOpen = (e) => {
//     if (e) e.preventDefault();
//     setIsLoginOpen(true);
//   };

//   const handleLoginClose = () => {
//     setIsLoginOpen(false);
//   };

//   const handleLoginSuccess = () => {
//     setIsAuthenticated(true);
//     localStorage.setItem("isAuthenticated", "true");
//   };

//   return (
//     <>
//       <div className="marquee-container">
//         <div className="marquee">
//           ZappCart is an innovative E-commerce platform designed to revolutionize the fresh meat delivery industry in Bengaluru,
//           Fresh Meat Delivered To Your Doorstep
//         </div>
//       </div>
//       <header className="header">
//         <div className="header-container">
//           <div className="logo">
//             <Link to="/">
//               <img src={logoImage} alt="ZappCart Logo" />
//             </Link>
//           </div>

//           <div className="location-selector" ref={locationRef}>
//             <div className="delivery-label">Delivery to</div>
//             <div
//               className="address-selector"
//               onClick={() => setIsLocationOpen(!isLocationOpen)}
//             >
//               <FaMapMarkerAlt className="map-icon" />
//               <span className="address" title={fullAddress?.fullAddress || locationAddress}>
//                 {locationAddress}
//               </span>
//               {/* <FaAngleDown className={`dropdown-icon ${isLocationOpen ? 'open' : ''}`} /> */}

//               {isLocationOpen && (
//                 <div className="location-popup scale-in">
//                   <h4 className="location-popup-title">Choose your delivery location</h4>

//                   <button
//                     className="use-current-location"
//                     onClick={handleUseCurrentLocation}
//                     disabled={isLocating}
//                   >
//                     {isLocating ? (
//                       <>
//                         <FaSpinner className="spinner" />
//                         <span>Detecting location...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaMapMarkerAlt />
//                         <span>Use current location</span>
//                       </>
//                     )}
//                   </button>

//                   {locationError && (
//                     <div className="location-error">
//                       {locationError}
//                     </div>
//                   )}

//                   <div className="location-tabs">
//                     {locations.map(city => (
//                       <button
//                         key={city.id}
//                         className={`location-tab ${selectedCity.id === city.id ? 'active' : ''}`}
//                         onClick={() => handleCitySelect(city)}
//                       >
//                         {city.city}
//                       </button>
//                     ))}
//                   </div>

//                   <div className="location-areas">
//                     {selectedCity.areas.map(area => (
//                       <button
//                         key={area}
//                         className="area-btn"
//                         onClick={() => handleAreaSelect(area)}
//                       >
//                         <FaMapMarkerAlt className="area-icon" />
//                         <span>{area}, {selectedCity.city}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="search-container desktop-search" ref={searchRef}>
//             <form className="search-bar" onSubmit={handleSearchSubmit}>
//               <div className="search-wrapper">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                 />
//                 {searchTerm && (
//                   <button
//                     type="button"
//                     className="clear-search"
//                     onClick={clearSearch}
//                     aria-label="Clear search"
//                   >
//                     <FaTimes />
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           <div className="nav-links desktop-nav">
//             <div className="categories-dropdown">
//               <Link to="/categories" className="categories-link">
//                 <span>Categories</span>
//               </Link>
//             </div>

//             <div className="cart-link">
//               <Link to="/cart" className="cart-trigger">
//                 <FaShoppingCart className="cart-icon" />
//                 <span>Cart</span>
//                 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
//               </Link>
//             </div>

//             <div className="account-link">
//               <a href="#" className="account-trigger" onClick={handleLoginOpen}>
//                 <FaUser className="account-icon" />
//                 <span>{isAuthenticated ? 'Login' : 'Login'}</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Search Overlay */}
//       {isMobileSearchActive && (
//         <div className="mobile-search-overlay active">
//           <div className="mobile-search-container">
//             <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
//               <FaSearch className="mobile-search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 autoFocus
//               />
//               {searchTerm ? (
//                 <button type="button" className="mobile-clear-search" onClick={clearSearch}>
//                   <FaTimes />
//                 </button>
//               ) : (
//                 <button type="button" className="mobile-cancel-search" onClick={handleMobileSearchClick}>
//                   Cancel
//                 </button>
//               )}
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="mobile-bottom-nav">
//         <button
//           className={`mobile-nav-item ${activeMobileTab === 'home' ? 'active' : ''}`}
//           onClick={() => handleMobileTabClick('home')}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mobile-nav-icon">
//             <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
//           </svg>
//           <span className="mobile-nav-text">Home</span>
//         </button>

//         <button
//           className={`mobile-nav-item ${activeMobileTab === 'categories' ? 'active' : ''}`}
//           onClick={() => handleMobileTabClick('categories')}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mobile-nav-icon">
//             <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
//           </svg>
//           <span className="mobile-nav-text">Categories</span>
//         </button>

//         <button
//           className={`mobile-nav-item ${activeMobileTab === 'search' ? 'active' : ''}`}
//           onClick={() => handleMobileTabClick('search')}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mobile-nav-icon">
//             <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//           </svg>
//           <span className="mobile-nav-text">Search</span>
//         </button>

//         <button
//           className={`mobile-nav-item ${activeMobileTab === 'cart' ? 'active' : ''}`}
//           onClick={() => handleMobileTabClick('cart')}
//         >
//           <div className="mobile-cart-container">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mobile-nav-icon">
//               <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
//             </svg>
//             {cartCount > 0 && <span className="mobile-cart-count">{cartCount}</span>}
//           </div>
//           <span className="mobile-nav-text">Cart</span>
//         </button>

//         <button
//           className={`mobile-nav-item ${activeMobileTab === 'profile' ? 'active' : ''}`}
//           onClick={() => handleMobileTabClick('profile')}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mobile-nav-icon">
//             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//           </svg>
//           <span className="mobile-nav-text">{isLoggedIn ? 'Profile' : 'Login'}</span>
//         </button>
//       </div>
      

//       <Login
//         isOpen={isLoginOpen}
//         onClose={handleLoginClose}
//         onLogin={handleLoginSuccess}
//       />
//     </>
//   );
// };

// export default Header;